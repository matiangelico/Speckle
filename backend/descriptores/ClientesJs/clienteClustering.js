const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const jsonData = require('../matrices.json');
const jsonData2 = require('../ia.json');

fs.writeFileSync('pruebaTemp.json', JSON.stringify(jsonData));
fs.writeFileSync('pruebaTemp2.json', JSON.stringify(jsonData2));

const form = new FormData();
form.append('jsonFile1', fs.createReadStream('pruebaTemp.json'));
form.append('jsonFile2', fs.createReadStream('pruebaTemp2.json'));

axios.post('http://127.0.0.1:8000/clustering', form, {
    headers: {
        ...form.getHeaders()
    }
})
    .then(response => {
        let respuesta
        for(t=0;t<response.data.length;t++){
          respuesta = response.data[t]
        console.log(respuesta.nombre)
        fs.writeFileSync('ia/matriz.json', JSON.stringify(respuesta.matriz))
        const imageBuffer = Buffer.from(respuesta.imagen, 'base64');
        fs.writeFileSync('ia/imagen.png', imageBuffer)
        console.log(respuesta.matriz.length+"x"+respuesta.matriz[1].length)
        console.log(respuesta.imagen.substring(0, 50))
        }
        fs.unlinkSync('pruebaTemp.json');
        fs.unlinkSync('pruebaTemp2.json');
    })
    .catch(error => {
      console.error('Error:', error);
    });
