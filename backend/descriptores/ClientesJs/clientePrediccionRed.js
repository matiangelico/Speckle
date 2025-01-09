const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const jsonData = require('../matrices.json');

fs.writeFileSync('pruebaTemp.json', JSON.stringify(jsonData));

const form = new FormData();
form.append('file', fs.createReadStream('modelo_recibido1234.h5',));
form.append('jsonFile', fs.createReadStream('pruebaTemp.json'))

axios.post('http://127.0.0.1:8000/prediccionRed', form, {
    headers: {
        ...form.getHeaders()
    }
})
    .then(response => {
        const respuesta = response.data
        console.log(respuesta.prediccion)
        //fs.writeFileSync('./matriz1234.json', JSON.stringify(respuesta))
        //console.log('Matriz guardada como matriz1234.json')
    })
    .catch(error => {
      console.error('Error:', error);
    });
