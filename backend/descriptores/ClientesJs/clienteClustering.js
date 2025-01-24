const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const matrices_descriptores = require('../output/matrices_descriptores.json');
const datos_clustering = require('../DatosPrueba/nomClus+nroClusters.json');

fs.writeFileSync('descriptores_temp.json', JSON.stringify(matrices_descriptores));

const form = new FormData();
form.append('matrices_descriptores', fs.createReadStream('descriptores_temp.json'));
form.append('datos_clustering', JSON.stringify(datos_clustering))


const jsonFormat = (key, value) => {
  // Si el valor es un array y tiene más de un número, convertirlo a una sola línea
  if (Array.isArray(value) && value.length > 10) {
      return JSON.stringify(value); // Lo deja en una sola línea
  }
  return value; // Devuelve normalmente los otros valores
};

axios.post('http://127.0.0.1:8000/clustering', form, {
    headers: {
        ...form.getHeaders()
    }
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
      console.error('Error:', error);
    });
