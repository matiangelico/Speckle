const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs').promises;
const path = require('path');
const https = require('https');

require('dotenv').config({path:'../../.env'});

const agent = new https.Agent({ rejectUnauthorized: false });
const API_KEY = process.env.API_KEY

const uploadsBasePath = path.join(__dirname, '../../uploads/temp');

const entrenamientoRed = async (req, res, next) => {

    if (!req.auth || !req.auth.payload || !req.auth.payload.sub) {
        return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    const userId = req.auth.payload.sub;
    const sanitizedUserId = userId.replace(/[|:<>"?*]/g, "_");
    const userTempDir = path.join(uploadsBasePath, sanitizedUserId);

    try {
        const { neuralNetworkLayers, selectedClustering } = req.body;

        const [matricesDescData, matricesClusData] = await Promise.all([
            fs.readFile(path.join(userTempDir, 'filteredMatrices.json'), 'utf-8'),
            fs.readFile(path.join(userTempDir, 'matricesClustering.json'), 'utf-8')
        ]);

        const matricesClus = JSON.parse(matricesClusData);
        const selectedClusteringObj = matricesClus.find(c => c.nombre_clustering === selectedClustering);
        
        if (!selectedClusteringObj) {
            return res.status(404).json({ error: 'Clustering no encontrado' });
        }

        await fs.writeFile(
            path.join(userTempDir, 'filteredClustering.json'),
            JSON.stringify(selectedClusteringObj)
        );

        const trainingForm = new FormData();
        trainingForm.append('matrices_descriptores', matricesDescData, 'descriptores.json');
        trainingForm.append('matriz_clustering', JSON.stringify(selectedClusteringObj), 'clustering.json');
        trainingForm.append('neural_network_layers', JSON.stringify(neuralNetworkLayers));

        const { data } = await axios.post('https://localhost:8000/entrenamientoRed', trainingForm, {
            headers: {
                'x-api-key': API_KEY,
                ...trainingForm.getHeaders()
              },
            httpsAgent: agent,
            responseType: 'arraybuffer'
        });

        await fs.writeFile(path.join(userTempDir, 'modeloEntrenado.keras'), data);
        next();

    } catch (error) {
        res.status(500).json({ error: `Error en entrenamiento: ${error.message}` });
    }
};

module.exports = {
    entrenamientoRed
};