const axios = require("axios");
const fs = require("fs");
const path = require("path");
const FormData = require("form-data");
const https = require("https");
const Experience = require("../models/experienceConfig");

const agent = new https.Agent({ rejectUnauthorized: false });
const API_KEY = process.env.API_KEY;

exports.experiencePrediction = async (req, res) => {
  try {
    const { experienceId } = req.body;
    const video = req.file;
    const userId = req.auth.payload.sub;


    if (!experienceId || !video) {
      return res.status(400).json({ error: "Se requieren experienceId y un archivo de video." });
    }

    // Crear directorio temporal para el usuario si no existe
    const sanitizedUserId = userId.replace(/\|/g, "_");
    const userTempDir = path.join(__dirname, "..", "..", "uploads", "temp", sanitizedUserId);

    console.log("El userTempDir es",userTempDir);
    if (!fs.existsSync(userTempDir)) {
      fs.mkdirSync(userTempDir, { recursive: true });
    }

    // Obtener experiencia desde la base de datos
    const experience = await Experience.findOne({ _id: experienceId, userId });
    if (!experience) {
      return res.status(404).json({ error: "Experiencia no encontrada o no pertenece al usuario." });
    }

    // Guardar los descriptores en un archivo JSON temporal
    const descriptorsPath = path.join(userTempDir, "descriptors.json");
    fs.writeFileSync(descriptorsPath, JSON.stringify(experience.descriptors, null, 2));

    // Modificar req.files para que la función uploadVideo lo reciba correctamente
    req.files = {
      video: [video], // Video que viene de la petición
      descriptors: [{ path: descriptorsPath }] // JSON con descriptores
    };

    // Llamar a la nueva función generateDescriptorMatrices que procesará el video y generará las matrices de descriptores
    const matrices_descriptores = await generateDescriptorMatrices(req, res, userTempDir);

    // Verificar si el modelo entrenado está disponible
    const trainedModelBuffer = experience.trainedModel.buffer;
    if (!trainedModelBuffer) {
      return res.status(400).json({ error: "El modelo entrenado no está disponible." });
    }

    // Guardar modelo entrenado en un archivo temporal
    const modelPath = path.join(userTempDir, "temp_modeloEntrenado.keras");
    fs.writeFileSync(modelPath, Buffer.from(trainedModelBuffer)); // Convertir ArrayBuffer a Buffer

    // Preparar la solicitud a la API Python para la predicción
    const formData = new FormData();
    formData.append("modelo_entrenado", fs.createReadStream(modelPath), {
      filename: "modeloEntrenado.keras",
      contentType: "application/octet-stream"
    });

    // Agregar las matrices de descriptores generadas
    const matricesFilePath = path.join(userTempDir, "matrices_descriptores.json");
    formData.append("matrices_descriptores", fs.createReadStream(matricesFilePath), {
      filename: "matrices_descriptores.json",
      contentType: "application/json"
    });

    // Enviar la petición a la API Python para obtener la predicción
    const pythonApiUrl = "https://localhost:8000/prediccionRed";
    const response = await axios.post(pythonApiUrl, formData, {
      headers: {
        "x-api-key": API_KEY,
        ...formData.getHeaders()
      },
      httpsAgent: agent,
      timeout: 120000 // 2 minutos de timeout
    });

    // Responder con el resultado de la predicción
    res.json(response.data);
  } catch (error) {
    console.error("Error en experiencePrediction:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Error al procesar la predicción", details: error.message });
    }
  }
};

// Esta es la función que genera las matrices de descriptores
const generateDescriptorMatrices = async (req, res, userTempDir) => {
  const { video, descriptors } = req.files;

  if (!video || !descriptors) {
    return res.status(400).json({ error: "Faltan archivos: video o descriptors" });
  }

  const videoPath = video[0].path;
  const descriptorsPath = descriptors[0].path;

  const descriptorsData = JSON.parse(fs.readFileSync(descriptorsPath, 'utf8'));

  console.log("Enviando a endpoint Python");

  try {
    const formData = new FormData();
    const videoStream = fs.createReadStream(videoPath);

    formData.append("video_experiencia", videoStream, video[0].originalname);
    formData.append("datos_descriptores", JSON.stringify(descriptorsData));

    const response = await axios.post("https://localhost:8000/descriptores", formData, {
      headers: {
        'x-api-key': API_KEY,
        ...formData.getHeaders()
      },
      httpsAgent: new https.Agent({ rejectUnauthorized: false })
    });

    const matrices_descriptores = response.data.matrices_descriptores;
    const matricesFilePath = path.join(userTempDir, "matrices_descriptores.json");
    fs.writeFileSync(matricesFilePath, JSON.stringify(matrices_descriptores, null, 2)); // Guardar matrices como JSON

    console.log(`Archivo JSON de matrices de descriptores guardado en: ${matricesFilePath}`);

    return matrices_descriptores;
  } catch (error) {
    console.error("Error al generar matrices de descriptores:", error.message);
    return res.status(500).json({ error: error.message });
  }
};
