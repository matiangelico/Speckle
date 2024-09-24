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

// Ruta para subir el video
app.post('/upload', upload.single('video'), (req, res) => {


    if (!req.file) {
        console.log("No se recibio ningun archivo");
        return res.status(400).json({ error: 'No se recibio ningun archivo' });
    }

    const filePath = req.file.path;  // Ruta del archivo subido
    console.log(`Archivo subido: ${req.file.originalname}, Guardado en: ${filePath}`);

    // Ejecutar el script para convertir AVI a .mat y aplicar el descriptor
    const outputMatPath = path.join(__dirname, 'uploads', `${req.file.filename}.mat`);
    const outputImgPath = path.join(__dirname, 'uploads', `${req.file.filename}.png`);

    // Ejecutar tu analizador de video
    const outputPath = path.join(__dirname, 'uploads', `${req.file.filename}.mat`);
    exec(`python ./descriptores/convertirAviaMat.py "${filePath}" "${outputMatPath}" "${outputImgPath}"`, (error, stdout, stderr) => {
        console.log("Procesamiento de video iniciado");
        if (error) {
            console.error(`Error al ejecutar el analizador: ${error}`);
            return res.status(500).json({ error: 'Error al procesar el video' });
        }

        console.log(stdout);
        console.error(stderr); 

        // Verificar si la imagen se generó correctamente
        if (fs.existsSync(outputImgPath)) {
            const resultMessage = `Video procesado y guardado como imagen: ${outputImgPath}`;
            console.log(resultMessage);  // Imprimir el mensaje en la consola del servidor

            // Devolver la URL de la imagen al frontend
            res.json({ result: resultMessage, imageUrl: `/uploads/${req.file.filename}.png` });
        } else {
            console.error('Error: No se generó la imagen');
            res.status(500).json({ error: 'Error al generar la imagen' });
        }
    });
});

// Iniciar el servidor
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

