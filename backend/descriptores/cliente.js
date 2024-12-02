const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const jsonData = require('./prueba.json');

const form = new FormData();
form.append('file', fs.createReadStream('moneda10.avi',));
form.append('jsonData', JSON.stringify(jsonData))

axios.post('http://127.0.0.1:8000/calc', form, {
    headers: {
        ...form.getHeaders()
    }
})
    .then(response => {
        let respuesta
        for(t=0;t<response.data.length;t++){
          respuesta = response.data[t]
          console.log(respuesta.nombre)
          fs.writeFileSync('output/matriz.json', JSON.stringify(respuesta.matriz))
          const imageBuffer = Buffer.from(respuesta.imagen, 'base64');
          fs.writeFileSync('output/imagen.png', imageBuffer)
          console.log(respuesta.matriz.length+"x"+respuesta.matriz[1].length)
          console.log(respuesta.imagen.substring(0, 50))
        }     
    })
    .catch(error => {
      console.error('Error:', error);
    });

/*    
fs.readFile('./defaultvalues.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Error leyendo el archivo:', err);
    return;
  }
  try {
    const jsonData = JSON.parse(data);
    console.log(jsonData);
  } catch (parseError) {
    console.error('Error al analizar el JSON:', parseError);
  }
});

*/


