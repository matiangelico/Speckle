const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const matrices_descriptores = require('../output/matrices_descriptores.json');
const matriz_clustering = require('../DatosPrueba/matriz_clustering.json');
const parametros_entrenamiento = require('../DatosPrueba/parametrosEntrenamiento.json');

fs.writeFileSync('descriptores_temp.json', JSON.stringify(matrices_descriptores));
fs.writeFileSync('clustering_temp.json', JSON.stringify(matriz_clustering));

const form = new FormData();
form.append('matrices_descriptores', fs.createReadStream('descriptores_temp.json'));
form.append('matriz_clustering', fs.createReadStream('clustering_temp.json'));
form.append('parametros_entrenamiento', JSON.stringify(parametros_entrenamiento))

axios.post('http://127.0.0.1:8000/entrenamientoRed', form, {
    headers: {
        ...form.getHeaders(),
    },
    responseType: "arraybuffer",
})
    .then(response => {
        fs.writeFileSync("../output/modelo_recibido.keras", response.data);
        console.log("Modelo recibido y guardado como modelo_recibido.keras");

        fs.unlinkSync("descriptores_temp.json");
        fs.unlinkSync("clustering_temp.json");
    })
    .catch(error => {
      console.error('Error:', error);
    });
