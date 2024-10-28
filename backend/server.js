const cors = require('cors');
const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const path = require('path');
const app = express();
const fs = require('fs');
const mongoose = require('mongoose');
const descriptorRoutes = require('./routes/descriptorRoutes');

app.use(cors());
app.use(express.json()); // Middleware para parsear JSON en las solicitudes

app.use((req, res, next) => {
    console.log(`Método: ${req.method}, Ruta: ${req.originalUrl}`);
    next();
});


const upload = multer({ dest: 'uploads/' }); // Carpeta temporal para los archivos subidos

// Configurar el middleware para servir archivos estáticos desde la carpeta uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect('mongodb://localhost:27017/speckle')
    .then(() => {
        console.log('Conectado a MongoDB');
    })
    .catch(error => {
        console.error('Error al conectar a MongoDB', error);
    });
    
//Rutas
app.use('/descriptor', descriptorRoutes);

// Ruta para obtener el contenido del archivo JSON
app.get('/api/descriptors', (req, res) => {
    fs.readFile(path.join(__dirname, 'descriptors.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error al leer el archivo JSON' });
        }
        res.json(JSON.parse(data));
    });
});

// Ruta para actualizar el contenido del archivo JSON
app.post('/api/descriptors', (req, res) => {
    const newData = req.body;
    console.log('Datos recibidos:', newData); // Verifica qué datos están llegando

    fs.writeFile(path.join(__dirname, 'descriptors.json'), JSON.stringify(newData, null, 2), (err) => {
        if (err) {
            return res.status(500).json({ error: 'Error al escribir en el archivo JSON' });
        }
        res.status(200).json({ message: 'Archivo JSON actualizado correctamente' });
    });
});


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
        console.log(`Los parametros de los descriptores ${JSON.stringify(descriptorParams)}`);
    }

    // Limpiar descriptores: Quitar corchetes y comillas si existen
    descriptors = descriptors.replace(/[\[\]"]/g, '').split(',').map(descriptor => descriptor.trim());

    console.log(`Los descriptores limpios son ${descriptors}`);

    // Mapa de promesas para el procesamiento de cada descriptor
    const processingPromises = descriptors.map(descriptor => {
        console.log(`El descriptor sanitizado es ${descriptor}`);

        const outputMatPath = path.join(__dirname, 'uploads', `${req.file.filename}_${descriptor}.mat`);
        const outputImgPath = path.join(__dirname, 'uploads', `${req.file.filename}_${descriptor}.png`);

        // Asegúrate de que params sea un array
        const params = descriptorParams[descriptor] ? Object.values(descriptorParams[descriptor]) : [];

        // Convertir los parámetros en una cadena de argumentos para pasar al comando de Python
        const paramArgs = params.map(param => `${param.paramName}=${param.value}`).join(' '); // Ajuste aquí

        console.log(`LO ejecutamos con los parametros :, ${paramArgs}`);
        console.log(`Parámetros para ${descriptor}:, ${paramArgs}`);

        const command = `python ./descriptores/convertirAviaMat.py "${filePath}" "${outputMatPath}" "${outputImgPath}" "${descriptor}" ${paramArgs}`;
        console.log(`Ejecutando comando: ${command}`);
        return new Promise((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                console.log(`Procesamiento de video con descriptor ${descriptor} iniciado`);
                if (error) {
                    console.error(`Error al ejecutar el analizador para el descriptor ${descriptor}: ${error}`);
                    reject(`Error al procesar el video para descriptor ${descriptor}`);
                }
                console.log(stdout);
                console.error(stderr);

                // Verificar si la imagen se generó correctamente
                if (fs.existsSync(outputImgPath)) {
                    resolve(`/uploads/${req.file.filename}_${descriptor}.png`);
                } else {
                    reject(`Error al generar la imagen para ${descriptor}`);
                }
            });
        });
    });

    // Ejecutar todas las promesas y enviar la respuesta una vez que todas se completen
    Promise.all(processingPromises)
        .then(imageUrls => {
            const result = imageUrls.map((url, index) => ({
                url,
                descriptor: descriptors[index]  // Agrega el nombre del descriptor aquí
            }));
    
            res.json({ result: 'Videos procesados correctamente', images: result });
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


