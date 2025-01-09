const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const jsonData = require('../DatosPrueba/matricesDescriptores.json');
const jsonData2 = require('../DatosPrueba/nomClus+nroClusters.json');

fs.writeFileSync('pruebaTemp.json', JSON.stringify(jsonData));
fs.writeFileSync('pruebaTemp2.json', JSON.stringify(jsonData2));

const form = new FormData();
form.append('jsonFile1', fs.createReadStream('pruebaTemp.json'));
form.append('jsonFile2', fs.createReadStream('pruebaTemp2.json'));

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
        const respuesta_total = response.data
        fs.writeFileSync('../output/calculoClustering.json', JSON.stringify(respuesta_total,jsonFormat,4))
        let respuesta
        console.log('Clusterings calculados')
        for(t=0;t<response.data.length;t++){
          respuesta = response.data[t]
          console.log(respuesta.nombre_clustering)
        }     
        console.log('Respuesta guardada en ../output/calculoClustering.json')
        fs.unlinkSync('pruebaTemp.json');
        fs.unlinkSync('pruebaTemp2.json');
    })
    .catch(error => {
      console.error('Error:', error);
    });
