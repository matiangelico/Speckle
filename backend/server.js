const cors = require('cors');
const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const path = require('path');
const app = express();
const fs = require('fs');
const mongoose = require('mongoose');
const descriptorRoutes = require('./api/routes/descriptorRoutes');
const uploadVideoRoutes  = require('./api/routes/uploadVideoRoutes');

app.use(cors());
app.use(express.json()); // Middleware para parsear JSON en las solicitudes

app.use((req, res, next) => {
    console.log(`Método: ${req.method}, Ruta: ${req.originalUrl}`);
    next();
});


const upload = multer({ dest: 'uploads/' }); // Carpeta temporal para los archivos subidos

//middleware para servir archivos estáticos desde la carpeta uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//conexion a la base de datos
mongoose.connect('mongodb://localhost:27017/speckle')
    .then(() => {
        console.log('Conectado a MongoDB');
    })
    .catch(error => {
        console.error('Error al conectar a MongoDB', error);
    });
    
//Rutas
app.use('/descriptor', descriptorRoutes);
app.use('/uploadVideo', uploadVideoRoutes);

// Iniciar el servidor
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});


