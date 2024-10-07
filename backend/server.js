const cors = require('cors');
const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const path = require('path');
const app = express();
const fs = require('fs');

app.use(cors());

const upload = multer({ dest: 'uploads/' }); // Carpeta temporal para los archivos subidos

// Configurar el middleware para servir archivos estáticos desde la carpeta uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.post('/upload', upload.single('video'), (req, res) => {
    if (!req.file) {
        console.log("No se recibió ningún archivo");
        return res.status(400).json({ error: 'No se recibió ningún archivo' });
    }

    const filePath = req.file.path;  // Ruta del archivo subido
    let descriptors = req.body.descriptors;
    let descriptorParams = req.body.params;

    if (descriptorParams) {
        descriptorParams = JSON.parse(descriptorParams);
    }

    // Limpiar descriptores: Quitar corchetes y comillas si existen
    descriptors = descriptors.replace(/[\[\]"]/g, '').split(',').map(descriptor => descriptor.trim());
    

    // Mapa de promesas para el procesamiento de cada descriptor
    const processingPromises = descriptors.map(descriptor => {
        // Limpiar caracteres no deseados en el nombre del descriptor
        const sanitizedDescriptor = descriptor.replace(/[^a-zA-Z0-9_-]/g, '');


        const outputMatPath = path.join(__dirname, 'uploads', `${req.file.filename}_${sanitizedDescriptor}.mat`);
        const outputImgPath = path.join(__dirname, 'uploads', `${req.file.filename}_${sanitizedDescriptor}.png`);

        const params = descriptorParams[sanitizedDescriptor] || {};

        // Convertir los parámetros en una cadena de argumentos para pasar al comando de Python
        const paramArgs = Object.keys(params)
            .map(key => `${key}=${params[key]}`)
            .join(' '); // Por ejemplo, 'threshold=120'

        console.log(`Parámetros para ${sanitizedDescriptor}:, ${paramArgs}`);

        const command = `python ./descriptores/convertirAviaMat.py "${filePath}" "${outputMatPath}" "${outputImgPath}" "${sanitizedDescriptor}" ${paramArgs}`;
        console.log(`Ejecutando comando: ${command}`);
        return new Promise((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                console.log(`Procesamiento de video con descriptor ${sanitizedDescriptor} iniciado`);
                if (error) {
                    console.error(`Error al ejecutar el analizador para el descriptor ${sanitizedDescriptor}: ${error}`);
                    reject(`Error al procesar el video para descriptor ${sanitizedDescriptor}`);
                }
                console.log(stdout);
                console.error(stderr);

                // Verificar si la imagen se generó correctamente
                if (fs.existsSync(outputImgPath)) {
                    resolve(`/uploads/${req.file.filename}_${sanitizedDescriptor}.png`);
                } else {
                    reject(`Error al generar la imagen para ${sanitizedDescriptor}`);
                }
            });
        });
    });

    // Ejecutar todas las promesas y enviar la respuesta una vez que todas se completen
    Promise.all(processingPromises)
        .then(imageUrls => {
            res.json({ result: 'Videos procesados correctamente', imageUrls });
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'Hubo un error al procesar algunos descriptores' });
        });
});

// Iniciar el servidor
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

