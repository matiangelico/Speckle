const axios = require('axios');
const https = require('https');
const fs = require('fs');
const FormData = require('form-data');
require('dotenv').config({path:'../.env'});

const agent = new https.Agent({ rejectUnauthorized: false });

const API_KEY = process.env.API_KEY

const matrices_descriptores = require('../output/matrices_descriptores.json');
const dimensiones = { 'width': '300', 'height':'300'}

fs.writeFileSync('descriptores_temp.json', JSON.stringify(matrices_descriptores));

const form = new FormData();
form.append('modelo_entrenado', fs.createReadStream('../output/modelo_entrenado.keras',));
form.append('matrices_descriptores', fs.createReadStream('descriptores_temp.json'))
form.append('video_dimensiones', JSON.stringify(dimensiones))

axios.post('https://127.0.0.1:8000/prediccionRed', form, {
    headers: {
        'x-api-key': API_KEY,
        ...form.getHeaders()
    },
    httpsAgent: agent
})
    .then(response => {const respuesta = response.data
        fs.writeFileSync('../output/matriz_prediccion.json', JSON.stringify(respuesta.matriz_prediccion))
        fs.writeFileSync('../output/imagen_prediccion.json', JSON.stringify(respuesta.imagen_prediccion))
        fs.writeFileSync('../output/tensor_prediccion.json', JSON.stringify(respuesta.tensor_prediccion))
        console.log('Respuesta guardada en ../output/tensor_prediccion.json')
        console.log('Respuesta guardada en ../output/matriz_prediccion.json')
        console.log('Respuesta guardada en ../output/imagen_prediccion.json')
        fs.unlinkSync("descriptores_temp.json");

    })
    .catch(error => {
      console.error('Error:');
    });
