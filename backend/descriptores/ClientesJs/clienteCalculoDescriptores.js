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

axios.post('http://127.0.0.1:8000/calculoDescriptores', form, {
    headers: {
        ...form.getHeaders()
    }
})
    .then(response => {
        const respuesta_total = response.data
        fs.writeFileSync('../output/calculoDescriptores.json', JSON.stringify(respuesta_total,jsonFormat,4))
        let respuesta
        console.log('Descriptores calculados')
        for(t=0;t<response.data.length;t++){
          respuesta = response.data[t]
          console.log(respuesta.nombre_descriptor)
        }     
        console.log('Respuesta guardada en ../output/calculoDescriptores.json')
    })
    .catch(error => {
      console.error('Error:', error);
    });
