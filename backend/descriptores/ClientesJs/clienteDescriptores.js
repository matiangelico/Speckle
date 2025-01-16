const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const jsonData = require('../DatosPrueba/nombredescYparametros.json');

const form = new FormData();
form.append('file', fs.createReadStream('../matrizyvideo/moneda10.avi',));
form.append('jsonData', JSON.stringify(jsonData))

const jsonFormat = (key, value) => {
  // Si el valor es un array y tiene más de un número, convertirlo a una sola línea
  if (Array.isArray(value) && value.length > 10) {
      return JSON.stringify(value); // Lo deja en una sola línea
  }
  return value; // Devuelve normalmente los otros valores
};

axios.post('http://127.0.0.1:8000/descriptores', form, {
    headers: {
        ...form.getHeaders()
    }
})
    .then(response => {
        const respuesta = response.data
        fs.writeFileSync('../output/matrices_descriptores.json', JSON.stringify(respuesta.matrices_descriptores))
        fs.writeFileSync('../output/imagenes_descriptores.json', JSON.stringify(respuesta.imagenes_descriptores))
        console.log('Respuesta guardada en ../output/matrices_escriptores.json')
        console.log('Respuesta guardada en ../output/imagenes_escriptores.json')
        console.log('Descriptores calculados')
        if (Array.isArray(respuesta.matrices_descriptores)) {
          respuesta.matrices_descriptores.forEach(descriptor => {
              console.log(descriptor.nombre_descriptor); 
          });
        }     
    })
    .catch(error => {
      console.error('Error:', error);
    });
