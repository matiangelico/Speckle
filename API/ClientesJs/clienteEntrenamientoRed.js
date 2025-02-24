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
        // Convertir el buffer a cadena y luego a JSON
        const responseText = Buffer.from(response.data).toString('utf-8');
        const respuesta = JSON.parse(responseText);

        // Guardar el modelo recibido
        fs.writeFileSync("../output/modelo_recibido.keras", respuesta.model_file);
        console.log("Modelo recibido y guardado como modelo_recibido.keras");

        // Guardar la matriz de confusión como imagen
        const imagenBase64 = respuesta.confusion_matrix_image;
        const imagenBuffer = Buffer.from(imagenBase64, 'base64');
        fs.writeFileSync("../output/matrizConfusion.png", imagenBuffer); 
        console.log("Matriz de confusión guardada como matrizConfusion.png");
    })
    .catch(error => {
      console.error('Error:');
    });
