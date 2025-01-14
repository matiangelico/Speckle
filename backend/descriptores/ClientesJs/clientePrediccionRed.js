const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const jsonData = require('../DatosPrueba/descPrediccion.json');

fs.writeFileSync('pruebaTemp.json', JSON.stringify(jsonData));

const form = new FormData();
form.append('file', fs.createReadStream('../output/modelo_recibido1234.h5',));
form.append('jsonFile', fs.createReadStream('pruebaTemp.json'))

axios.post('http://127.0.0.1:8000/prediccionRed', form, {
    headers: {
        ...form.getHeaders()
    }
})
    .then(response => {
        const respuesta = response.data
        fs.writeFileSync('../output/matriz_final.json', JSON.stringify(respuesta))
        console.log('Matriz guardada como ../output/matriz_final.json')
    })
    .catch(error => {
      console.error('Error:', error);
    });
