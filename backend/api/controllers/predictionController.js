const axios = require("axios");
const fs = require("fs");
const fsp = fs.promises;
const path = require("path");
const FormData = require("form-data");
const https = require("https");
const Experience = require("../models/experienceConfig");

const agent = new https.Agent({ rejectUnauthorized: false });
const API_KEY = process.env.API_KEY;
const API_URL = process.env.API_URL;

exports.experiencePrediction = async (req, res) => {
  let modelPath, matricesFilePath;

  try {
    const { experienceId } = req.params;
    const userId = req.auth.payload.sub;
    const { videoDimension } = req.body;

    console.log("El experienceId es: ", experienceId);

    if (!experienceId) {
      return res.status(400).json({ error: "Se requiere el ID de experiencia" });
    }

    if (!videoDimension || !videoDimension.width || !videoDimension.height) {
      return res.status(400).json({
        error: "Dimensiones de video inválidas (width y height requeridos)"
      });
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

    await fsp.mkdir(userTempDir, { recursive: true });

    const experience = await Experience.findOne({ _id: experienceId, userId });
    if (!experience) {
      return res.status(404).json({
        error: "Experiencia no encontrada o no pertenece al usuario.",
      });
    }

    const matricesDescriptorPath = path.join(userTempDir, "matrices_descriptores_normalizada.json");
    const matricesData = await fsp.readFile(matricesDescriptorPath, "utf8");
    const matrices_descriptores = JSON.parse(matricesData);

    if (!experience.trainedModel || !Buffer.isBuffer(experience.trainedModel)) {
      return res.status(400).json({
        error: "Modelo entrenado no disponible o formato inválido.",
      });
    }

    modelPath = path.join(userTempDir, "modelo_temporal.keras");
    await fsp.writeFile(modelPath, experience.trainedModel);

    // Preparar formulario
    const predictionForm = new FormData();
    predictionForm.append("video_dimensiones", JSON.stringify(videoDimension));
    predictionForm.append("modelo_entrenado", fs.createReadStream(modelPath), {
      filename: "model.keras",
      contentType: "application/octet-stream",
    });

    matricesFilePath = path.join(userTempDir, "matrices.json");
    await fsp.writeFile(matricesFilePath, JSON.stringify(matrices_descriptores));
    predictionForm.append("matrices_descriptores", fs.createReadStream(matricesFilePath), {
      filename: "matrices.json",
      contentType: "application/json",
    });

    // Enviar a la API
    const response = await axios.post(`${API_URL}/prediccionRed`, predictionForm, {
      headers: {
        "x-api-key": API_KEY,
        ...predictionForm.getHeaders(),
      },
      httpsAgent: agent,
      timeout: 120000,
    });

    // Guardar resultados
    const predictionPaths = {
      matrix: path.join(userTempDir, "prediction_matrix.json"),
      tensor: path.join(userTempDir, "prediction_tensor.json"),
    };

    await Promise.all([
      fsp.writeFile(predictionPaths.matrix, JSON.stringify(response.data.matriz_prediccion)),
      fsp.writeFile(predictionPaths.tensor, JSON.stringify(response.data.tensor_prediccion)),
    ]);

    res.json({ prediction_image: response.data.imagen_prediccion });

  } catch (error) {
    console.error("Error en experiencePrediction:", error);

    // Limpieza de archivos temporales
    const cleanup = async (filePath) => {
      try {
        if (filePath) await fsp.unlink(filePath);
      } catch (cleanupError) {
        console.error("Error limpiando archivo:", cleanupError);
      }
    };

    await Promise.allSettled([
      cleanup(modelPath),
      cleanup(matricesFilePath),
    ]);

    const statusCode = error.response?.status || 500;
    const errorMessage = error.response?.data?.error || error.message;

    res.status(statusCode).json({
      error: errorMessage,
      details: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};