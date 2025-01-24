const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const matrices_descriptores = require('../output/matrices_descriptores.json');

fs.writeFileSync('descriptores_temp.json', JSON.stringify(matrices_descriptores));

const form = new FormData();
form.append('modelo_entrenado', fs.createReadStream('../output/modelo_recibido.keras',));
form.append('matrices_descriptores', fs.createReadStream('descriptores_temp.json'))

axios.post('http://127.0.0.1:8000/prediccionRed', form, {
    headers: {
        ...form.getHeaders()
    }
})
    .then(response => {const respuesta = response.data
        fs.writeFileSync('../output/matriz_prediccion.json', JSON.stringify(respuesta.matriz_prediccion))
        fs.writeFileSync('../output/imagen_prediccion.json', JSON.stringify(respuesta.imagen_prediccion))
        console.log('Respuesta guardada en ../output/matriz_prediccion.json')
        console.log('Respuesta guardada en ../output/imagen_prediccion.json')
        fs.unlinkSync("descriptores_temp.json");

    })
    .catch(error => {
      console.error('Error:', error);
    });
