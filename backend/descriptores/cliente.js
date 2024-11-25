const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const form = new FormData();
form.append('file', fs.createReadStream('matrizMoneda10.mat'));

axios.post('http://127.0.0.1:8000/diferenciasPromediadas', form,{
    headers: {
        ...form.getHeaders()
    }
})
    .then(response => {
        console.log(response.data); 
    })
    .catch(error => {
        console.error(error);
    });

