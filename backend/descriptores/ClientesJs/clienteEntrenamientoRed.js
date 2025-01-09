const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const jsonData = require('../matyres.json');
const jsonData2 = require('../parametros.json');

fs.writeFileSync('pruebaTemp.json', JSON.stringify(jsonData));
fs.writeFileSync('pruebaTemp2.json', JSON.stringify(jsonData2));

const form = new FormData();
form.append('jsonFile1', fs.createReadStream('pruebaTemp.json'));
form.append('jsonFile2', fs.createReadStream('pruebaTemp2.json'));

axios.post('http://127.0.0.1:8000/entrenamientoRed', form, {
    headers: {
        ...form.getHeaders(),
    },
    responseType: "arraybuffer",
})
    .then(response => {
        fs.writeFileSync("modelo_recibido1234.h5", response.data);
        console.log("Modelo recibido y guardado como modelo_recibido1234.h5");

        fs.unlinkSync("pruebaTemp.json");
        fs.unlinkSync("pruebaTemp2.json");
    })
    .catch(error => {
      console.error('Error:', error);
    });
