const axios = require('axios');
const https = require('https');
const fs = require('fs');
const FormData = require('form-data');
require('dotenv').config({path:'../.env'});

const agent = new https.Agent({ rejectUnauthorized: false });

const API_KEY = process.env.API_KEY

const matrices_descriptores = require('../output/matrices_descriptores.json');
const matriz_clustering = require('../DatosPrueba/kmeans.json');
const parametros_entrenamiento = require('../DatosPrueba/parametrosEntrenamiento.json');

fs.writeFileSync('descriptores_temp.json', JSON.stringify(matrices_descriptores));
fs.writeFileSync('clustering_temp.json', JSON.stringify(matriz_clustering));

const form = new FormData();
form.append('matrices_descriptores', fs.createReadStream('descriptores_temp.json'));
form.append('matriz_clustering', fs.createReadStream('clustering_temp.json'));
form.append('parametros_entrenamiento', JSON.stringify(parametros_entrenamiento))

axios.post('https://127.0.0.1:8000/entrenamientoRed', form, {
    headers: {
        'x-api-key': API_KEY,
        ...form.getHeaders()
    },
    httpsAgent: agent,
    responseType: "arraybuffer",
})
    .then(response => {
        fs.writeFileSync("../output/modelo_recibido.keras", response.data);
        console.log("Modelo recibido y guardado como modelo_recibido.keras");

        fs.unlinkSync("descriptores_temp.json");
        fs.unlinkSync("clustering_temp.json");
    })
    .catch(error => {
      console.error('Error:');
    });
