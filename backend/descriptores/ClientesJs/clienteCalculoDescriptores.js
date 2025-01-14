const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const jsonData = require('../DatosPrueba/todosDescyParams.json');

const form = new FormData();
form.append('file', fs.createReadStream('../output/tensor_comprimido.npz',));
form.append('jsonData', JSON.stringify(jsonData))

const jsonFormat = (key, value) => {
  // Si el valor es un array y tiene más de un número, convertirlo a una sola línea
  if (Array.isArray(value) && value.length > 10) {
      return JSON.stringify(value); // Lo deja en una sola línea
  }
  return value; // Devuelve normalmente los otros valores
};

axios.post('http://127.0.0.1:8000/imagenesDescriptores', form, {
    headers: {
        ...form.getHeaders()
    }
})
    .then(response => {
        const respuesta_total = response.data
        fs.writeFileSync('../output/todosDescriptores.json', JSON.stringify(respuesta_total))
        let respuesta
        console.log('Descriptores calculados')
        for(t=0;t<response.data.length;t++){
          respuesta = response.data[t]
          console.log(respuesta.nombre_descriptor)
        }     
        console.log('Respuesta guardada en ../output/todosDescriptores.json')
    })
    .catch(error => {
      console.error('Error:', error);
    });
