const FormData = require("form-data");
const fs = require("fs");
const axios = require("axios");
const path = require("path");

exports.uploadVideo = async (req, res) => {

  const TEMP_DIR = path.join(__dirname, "../../temporal");

  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
    console.log(`Carpeta temporal creada en: ${TEMP_DIR}`);
  } 

  if (!req.files || !req.files.video || !req.files.descriptors) {
    return res.status(400).json({ error: "Faltan archivos: video o descriptors" });
  }

  const videoPath = req.files.video[0].path;  
  const descriptorsPath = req.files.descriptors[0].path;  

  const descriptors = JSON.parse(fs.readFileSync(descriptorsPath, 'utf8'));

  try {
    const formData = new FormData();
    const videoStream = fs.createReadStream(videoPath);

    formData.append("video_experiencia", videoStream, req.files.video[0].originalname);  
    formData.append("datos_descriptores", JSON.stringify(descriptors)); 

    const response = await axios.post("http://localhost:8000/descriptores", formData, {
      headers: formData.getHeaders(),
    });

    const imagenes_descriptores = response.data.imagenes_descriptores;
    const matrices_descriptores = response.data.matrices_descriptores;

    const matricesFilePath = path.join(TEMP_DIR, "matrices_descriptores.json");
    fs.writeFileSync(matricesFilePath, JSON.stringify(matrices_descriptores, null, 2));
    console.log(`Archivo JSON creado en: ${matricesFilePath}`);

    res.status(200).json({imagenes_descriptores});
  } catch (error) {
    console.error("Error al procesar la solicitud:", error.message);
    res.status(500).json({ error: error.message });
  }
};




/*exports.uploadVideo = (req, res) => {
  console.log("Entre aVA");
  if (!req.file) {
    console.log("No se recibió ningún archivo");
    return res.status(400).json({ error: "No se recibió ningún archivo" });
  }

  console.log("Entre a uploadVIdeo y recibi:", req.body.descriptors);

  const filePath = req.file.path;
  let descriptors = req.body.descriptors;
  let descriptorParams = req.body.params;

  if (descriptorParams) {
    descriptorParams = JSON.parse(descriptorParams);
    console.log(
      `Los parámetros de los descriptores ${JSON.stringify(descriptorParams)}`
    );
  }

  descriptors = descriptors
    .replace(/[\[\]"]/g, "")
    .split(",")
    .map((descriptor) => descriptor.trim());
  console.log(`Los descriptores limpios son ${descriptors}`);

  // Ajusta la ruta del archivo Python
  const scriptPath = path.join(
    __dirname,
    "../../descriptores/convertirAviaMat.py"
  );

  const processingPromises = descriptors.map((descriptor) => {
    console.log(`El descriptor sanitizado es ${descriptor}`);

    // Ajusta las rutas de salida para archivos MAT y PNG
    const outputMatPath = path.join(
      __dirname,
      "../../uploads",
      `${req.file.filename}_${descriptor}.mat`
    );
    const outputImgPath = path.join(
      __dirname,
      "../../uploads",
      `${req.file.filename}_${descriptor}.png`
    );

    const params = descriptorParams[descriptor]
      ? Object.values(descriptorParams[descriptor])
      : [];
    const paramArgs = params
      .map((param) => `${param.paramName}=${param.value}`)
      .join(" ");

    const command = `python "${scriptPath}" "${filePath}" "${outputMatPath}" "${outputImgPath}" "${descriptor}" ${paramArgs}`;
    console.log(`Ejecutando comando: ${command}`);

    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        console.log(
          `Procesamiento de video con descriptor ${descriptor} iniciado`
        );
        if (error) {
          console.error(
            `Error al ejecutar el analizador para el descriptor ${descriptor}: ${error}`
          );
          return reject(
            `Error al procesar el video para descriptor ${descriptor}`
          );
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
    .then((imageUrls) => {
      const result = imageUrls.map((url, index) => ({
        url,
        descriptor: descriptors[index],
      }));

      res.json({ result: "Videos procesados correctamente", images: result });
    })
    .catch((error) => {
      console.error(error);
      res
        .status(500)
        .json({ error: "Hubo un error al procesar algunos descriptores" });
    });
};*/
