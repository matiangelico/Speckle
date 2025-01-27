const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs').promises;
const path = require('path');

const uploadsBasePath = path.join(__dirname, '../../uploads/temp');

const entrenamientoRed = async (req, res, next) => {

    if (!req.auth || !req.auth.payload || !req.auth.payload.sub) {
        return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    const userId = req.auth.payload.sub;
    const sanitizedUserId = userId.replace(/[|:<>"?*]/g, "_");
    const userTempDir = path.join(uploadsBasePath, sanitizedUserId);

    try {
        const { parametros, clusteringSeleccionado } = req.body;

        const [matricesDescData, matricesClusData] = await Promise.all([
            fs.readFile(path.join(userTempDir, 'filteredMatrices.json'), 'utf-8'),
            fs.readFile(path.join(userTempDir, 'matricesClustering.json'), 'utf-8')
        ]);

        const matricesClus = JSON.parse(matricesClusData);
        const selectedClustering = matricesClus.find(c => c.nombre_clustering === clusteringSeleccionado);
        
        if (!selectedClustering) {
            return res.status(404).json({ error: 'Clustering no encontrado' });
        }

        await fs.writeFile(
            path.join(userTempDir, 'filteredClustering.json'),
            JSON.stringify(selectedClustering)
        );

        const trainingForm = new FormData();
        trainingForm.append('matrices_descriptores', matricesDescData, 'descriptores.json');
        trainingForm.append('matriz_clustering', JSON.stringify(selectedClustering), 'clustering.json');
        trainingForm.append('parametros_entrenamiento', JSON.stringify(parametros));

        const { data } = await axios.post('http://localhost:8000/entrenamientoRed', trainingForm, {
            headers: trainingForm.getHeaders(),
            responseType: 'arraybuffer'
        });

        await fs.writeFile(path.join(userTempDir, 'modeloEntrenado.keras'), data);
        next();

    } catch (error) {
        res.status(500).json({ error: `Error en entrenamiento: ${error.message}` });
    }
};

const PrediccionRed = async (req, res) => {
    try {

        if (!req.auth || !req.auth.payload || !req.auth.payload.sub) {
            return res.status(401).json({ error: 'Usuario no autenticado' });
        }

        const userId = req.auth.payload.sub;
        const sanitizedUserId = userId.replace(/[|:<>"?*]/g, "_");
        const userTempDir = path.join(uploadsBasePath, sanitizedUserId);

        const [modelo, filteredClustering] = await Promise.all([
            fs.readFile(path.join(userTempDir, 'modeloEntrenado.keras')),
            fs.readFile(path.join(userTempDir, 'filteredMatrices.json'), 'utf-8')
        ]);

        if (!filteredClustering) {
            return res.status(400).json({ error: 'No se encontró clustering filtrado' });
        }

        const predictionForm = new FormData();
        predictionForm.append('modelo_entrenado', modelo, 'modelo.keras');
        predictionForm.append('matrices_descriptores', filteredClustering, 'clustering.json');

        const { data } = await axios.post('http://localhost:8000/prediccionRed', predictionForm, {
            headers: predictionForm.getHeaders()
        });

        res.json({
            success: true,
            imagen_prediccion: data.imagen_prediccion
        });

    } catch (error) {
        res.status(500).json({ 
            error: `Error en predicción: ${error.message}`,
            sugerencia: 'Verifique que primero se haya realizado el entrenamiento'
        });
    }
};

module.exports = {
    entrenamientoRed,
    PrediccionRed
};