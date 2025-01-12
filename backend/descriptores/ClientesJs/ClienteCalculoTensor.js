const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const form = new FormData();
form.append('file', fs.createReadStream('../matrizyvideo/moneda10.avi',));


axios.post('http://127.0.0.1:8000/calculoTensor', form, {
    headers: {
        ...form.getHeaders()
    },
    responseType: "arraybuffer",
})
    .then(response => {
        const respuesta = response.data
        fs.writeFileSync('../output/tensor_comprimido.npz',respuesta)     
        console.log('Respuesta guardada en ../output/tensor_comprimido.npz')
    })
    .catch(error => {
      console.error('Error:', error);
    });
