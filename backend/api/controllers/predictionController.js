const axios = require("axios");
const fs = require("fs");
const path = require("path");
const FormData = require("form-data");
const https = require("https");
const Experience = require("../models/experienceConfig");

const agent = new https.Agent({ rejectUnauthorized: false });
const API_KEY = process.env.API_KEY;
const API_URL = process.env.API_URL;

exports.experiencePrediction = async (req, res) => {
  let videoPath, modelPath, matricesFilePath;

  try {
    const { experienceId } = req.body;
    const video = req.file;
    const userId = req.auth.payload.sub;

    console.log("experienceId", experienceId);

    // Validaciones iniciales
    if (!experienceId || !video) {
      return res
        .status(400)
        .json({ error: "Se requieren experienceId y un archivo de video." });
    }

    const sanitizedUserId = userId.replace(/\|/g, "_");
    const userTempDir = path.join(
      __dirname,
      "..",
      "..",
      "uploads",
      "temp",
      sanitizedUserId
    );

    // Crear directorio temporal
    if (!fs.existsSync(userTempDir)) {
      fs.mkdirSync(userTempDir, { recursive: true });
    }

    // Buscar experiencia
    const experience = await Experience.findOne({ _id: experienceId, userId });
    if (!experience) {
      return res.status(404).json({
        error: "Experiencia no encontrada o no pertenece al usuario.",
      });
    }

    // Paso 1: Generar matrices de descriptores
    videoPath = path.join(userTempDir, video.originalname);
    fs.renameSync(video.path, videoPath); // Mover el archivo subido a nuestra estructura

    const matrices_descriptores = await generateDescriptorMatrices({
      videoPath,
      descriptors: experience.selectedDescriptors,
      userTempDir,
    });

    // Paso 2: Preparar modelo para predicción
    if (!experience.trainedModel || !Buffer.isBuffer(experience.trainedModel)) {
      return res
        .status(400)
        .json({ error: "Modelo entrenado no disponible o formato inválido." });
    }

    modelPath = path.join(userTempDir, "modelo_temporal.keras");
    fs.writeFileSync(modelPath, experience.trainedModel);

    // Paso 3: Enviar a API de predicción
    const predictionForm = new FormData();
    predictionForm.append("modelo_entrenado", fs.createReadStream(modelPath), {
      filename: "model.keras",
      contentType: "application/octet-stream",
    });

    matricesFilePath = path.join(userTempDir, "matrices.json");
    fs.writeFileSync(matricesFilePath, JSON.stringify(matrices_descriptores));
    predictionForm.append(
      "matrices_descriptores",
      fs.createReadStream(matricesFilePath),
      {
        filename: "matrices.json",
        contentType: "application/json",
      }
    );

    const response = await axios.post(
      `${API_URL}/prediccionRed`,
      predictionForm,
      {
        headers: {
          "x-api-key": API_KEY,
          ...predictionForm.getHeaders(),
        },
        httpsAgent: agent,
        timeout: 120000,
      }
    );

    const predictionMatrixPath = path.join(
      userTempDir,
      "prediction_matrix.json"
    );
    const predictionTensorPath = path.join(
      userTempDir,
      "prediction_tensor.json"
    );

    fs.writeFileSync(
      predictionMatrixPath,
      JSON.stringify(response.data.matriz_prediccion)
    );
    fs.writeFileSync(
      predictionTensorPath,
      JSON.stringify(response.data.tensor_prediccion)
    );

    res.json({
      prediction_image: response.data.imagen_prediccion,
    });
  } catch (error) {
    console.error("Error en experiencePrediction:", error);

    const statusCode = error.response?.status || 500;
    const errorMessage = error.response?.data?.error || error.message;

    res.status(statusCode).json({
      error: errorMessage,
      details: error.stack,
    });
  }
};

const generateDescriptorMatrices = async ({ videoPath, descriptors }) => {
  try {
    const formData = new FormData();
    const videoStream = fs.createReadStream(videoPath);

    formData.append("video_experiencia", videoStream, path.basename(videoPath));
    formData.append("datos_descriptores", JSON.stringify(descriptors));

    const response = await axios.post(`${API_URL}/descriptores`, formData, {
      headers: {
        "x-api-key": API_KEY,
        ...formData.getHeaders(),
      },
      httpsAgent: agent,
    });

    if (!response.data.matrices_descriptores) {
      throw new Error("Respuesta inválida del servidor de descriptores");
    }

    return response.data.matrices_descriptores;
  } catch (error) {
    console.error("Error en generateDescriptorMatrices:", error);
    throw new Error(`Error al generar matrices: ${error.message}`);
  }
};
