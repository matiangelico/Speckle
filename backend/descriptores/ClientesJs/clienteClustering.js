const axios = require('axios');
const https = require('https');
const fs = require('fs');
const FormData = require('form-data');
require('dotenv').config({path:'../.env'});

const agent = new https.Agent({ rejectUnauthorized: false });

const API_KEY = process.env.API_KEY

const matrices_descriptores = require('../output/matrices_descriptores.json');
const datos_clustering = require('../DatosPrueba/nomClus+nroClusters.json');

fs.writeFileSync('descriptores_temp.json', JSON.stringify(matrices_descriptores));

const form = new FormData();
form.append('matrices_descriptores', fs.createReadStream('descriptores_temp.json'));
form.append('datos_clustering', JSON.stringify(datos_clustering))


axios.post('https://127.0.0.1:8000/clustering', form, {
      headers: {
      'x-api-key': API_KEY,
      ...form.getHeaders()
    },
    httpsAgent: agent
})
    .then(response => {
        const respuesta = response.data
        fs.writeFileSync('../output/matrices_clustering.json', JSON.stringify(respuesta.matrices_clustering))
        fs.writeFileSync('../output/imagenes_clustering.json', JSON.stringify(respuesta.imagenes_clustering))
        console.log('Respuesta guardada en ../output/matrices_clustering.json')
        console.log('Respuesta guardada en ../output/imagenes_clustering.json')
        console.log('Clusterings calculados')
        if (Array.isArray(respuesta.matrices_clustering)) {
          respuesta.matrices_clustering.forEach(clustering => {
              console.log(clustering.nombre_clustering); 
          });
        }
         fs.unlinkSync("descriptores_temp.json");
  })
    .catch(error => {
      if (error.response){
        console.error('Error:');
        console.log('API Key cargada:', process.env.API_KEY);
      }

    });
