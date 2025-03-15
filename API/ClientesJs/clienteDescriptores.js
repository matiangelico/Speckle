const axios = require('axios');
const https = require('https');
const fs = require('fs');
const FormData = require('form-data');
require('dotenv').config({path:'../.env'});

const agent = new https.Agent({ rejectUnauthorized: false });

const API_KEY = process.env.API_KEY

const datos_descriptores = require('../DatosPrueba/nombredescYparametros.json');

const form = new FormData();
form.append('video_experiencia', fs.createReadStream('../matrizyvideo/bac1.avi',));
form.append('datos_descriptores', JSON.stringify(datos_descriptores))

axios.post('https://127.0.0.1:8000/descriptores', form, {
    headers: {
      'x-api-key': API_KEY,
      ...form.getHeaders()
    },
    httpsAgent: agent
})
    .then(response => {
        const respuesta = response.data
        fs.writeFileSync('../output/matrices_descriptores.json', JSON.stringify(respuesta.matrices_descriptores))
        fs.writeFileSync('../output/imagenes_descriptores.json', JSON.stringify(respuesta.imagenes_descriptores))
        console.log('Respuesta guardada en ../output/matrices_descriptores.json')
        console.log('Respuesta guardada en ../output/imagenes_descriptores.json')
        console.log('Descriptores calculados')
        if (Array.isArray(respuesta.matrices_descriptores)) {
          respuesta.matrices_descriptores.forEach(descriptor => {
              console.log(descriptor.id_descriptor); 
          });
        }
    })
    .catch(error => {
      if (error.response){
        console.error('Error:');
        console.log('API Key cargada:', process.env.API_KEY);
      }
    });
