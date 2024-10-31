const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

exports.uploadVideo = (req, res) => {
    console.log("Entre aVA");
    if (!req.file) {
        console.log("No se recibió ningún archivo");
        return res.status(400).json({ error: 'No se recibió ningún archivo' });
    }

    const filePath = req.file.path;
    let descriptors = req.body.descriptors;
    let descriptorParams = req.body.params;

    if (descriptorParams) {
        descriptorParams = JSON.parse(descriptorParams);
        console.log(`Los parámetros de los descriptores ${JSON.stringify(descriptorParams)}`);
    }

    descriptors = descriptors.replace(/[\[\]"]/g, '').split(',').map(descriptor => descriptor.trim());
    console.log(`Los descriptores limpios son ${descriptors}`);

    // Ajusta la ruta del archivo Python
    const scriptPath = path.join(__dirname, '../../descriptores/convertirAviaMat.py');

    const processingPromises = descriptors.map(descriptor => {
        console.log(`El descriptor sanitizado es ${descriptor}`);

        // Ajusta las rutas de salida para archivos MAT y PNG
        const outputMatPath = path.join(__dirname, '../../uploads', `${req.file.filename}_${descriptor}.mat`);
        const outputImgPath = path.join(__dirname, '../../uploads', `${req.file.filename}_${descriptor}.png`);

        const params = descriptorParams[descriptor] ? Object.entries(descriptorParams[descriptor]) : [];
        const paramArgs = params
            .filter(([paramName, value]) => paramName && value) // Filtrar valores válidos
            .map(([paramName, value]) => `${paramName}=${value}`)
            .join(' ');

        const command = `python "${scriptPath}" "${filePath}" "${outputMatPath}" "${outputImgPath}" "${descriptor}" ${paramArgs}`;
        console.log(`Ejecutando comando: ${command}`);

        return new Promise((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                console.log(`Procesamiento de video con descriptor ${descriptor} iniciado`);
                if (error) {
                    console.error(`Error al ejecutar el analizador para el descriptor ${descriptor}: ${error}`);
                    return reject(`Error al procesar el video para descriptor ${descriptor}`);
                }
                console.log(stdout);
                console.error(stderr);

                if (fs.existsSync(outputImgPath)) {
                    resolve(`/uploads/${req.file.filename}_${descriptor}.png`);
                } else {
                    reject(`Error al generar la imagen para ${descriptor}`);
                }
            });
        });
    });

    Promise.all(processingPromises)
        .then(imageUrls => {
            const result = imageUrls.map((url, index) => ({
                url,
                descriptor: descriptors[index]
            }));

            res.json({ result: 'Videos procesados correctamente', images: result });
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'Hubo un error al procesar algunos descriptores' });
        });
};
