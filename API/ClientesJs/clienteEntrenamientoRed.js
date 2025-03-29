const axios = require('axios');
const https = require('https');
const fs = require('fs');
const FormData = require('form-data');
const AdmZip = require('adm-zip');

require('dotenv').config({path:'../.env'});

const agent = new https.Agent({ rejectUnauthorized: false });

const API_KEY = process.env.API_KEY

const matrices_descriptores = require('../DatosPrueba/matricesDescriptores.json');
//const matriz_clustering = require('../DatosPrueba/kmeans.json');
const parametros_entrenamiento = require('../DatosPrueba/parametrosEntrenamiento.json');

fs.writeFileSync('descriptores_temp.json', JSON.stringify(matrices_descriptores));
//fs.writeFileSync('clustering_temp.json', JSON.stringify(matriz_clustering));

const form = new FormData();
form.append('matrices_descriptores', fs.createReadStream('descriptores_temp.json'));
//form.append('matriz_clustering', fs.createReadStream('clustering_temp.json'));
form.append('parametros_entrenamiento', JSON.stringify(parametros_entrenamiento))

axios.post('https://127.0.0.1:8000/entrenamientoArchivo', form, {
    headers: {
        'x-api-key': API_KEY,
        ...form.getHeaders()
    },
    httpsAgent: agent,
    responseType: "arraybuffer",
})
    .then(response => {
        console.log('📌 Respuesta recibida correctamente.');
        console.log('📌 Headers:', response.headers);

        const zipPath = '../output/archivos.zip';

        // Guardar el archivo ZIP en disco
        try {
            fs.writeFileSync(zipPath, response.data);
            console.log("✅ ZIP guardado en:", zipPath);
        } catch (error) {
            console.error("❌ Error al guardar el ZIP:", error);
            return;
        }

        // Intentar extraer el ZIP
        try {
            const zip = new AdmZip(zipPath);
            zip.extractAllTo("../output", true);
            console.log("✅ Archivos extraídos en ./output");
            fs.unlinkSync(zipPath);
        } catch (error) {
            console.error("❌ Error al extraer el ZIP:", error);
        }
    })
    .catch(error => {
        console.error('❌ Error en la petición:', error.message);
        if (error.response) {
            console.error('📌 Código de estado:', error.response.status);
            console.error('📌 Respuesta del servidor:', error.response.data.toString('utf-8'));
        }
    });