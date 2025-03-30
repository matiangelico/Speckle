const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");
const https = require("https");
const { Buffer } = require("buffer");
const unzipper = require("unzipper");

require("dotenv").config({ path: "../../.env" });

const agent = new https.Agent({ rejectUnauthorized: false });
const API_KEY = process.env.API_KEY;
const API_URL = process.env.API_URL;

const uploadsBasePath = path.join(__dirname, "../../uploads/temp");

const entrenamientoRed = async (req, res, next) => {
  if (!req.auth || !req.auth.payload || !req.auth.payload.sub) {
    return res.status(401).json({ error: "Usuario no autenticado" });
  }

  const userId = req.auth.payload.sub;
  const sanitizedUserId = userId.replace(/[|:<>"?*]/g, "_");
  const userTempDir = path.join(uploadsBasePath, sanitizedUserId);

  try {
    const { neuralNetworkLayers, neuralNetworkParams, selectedClustering } =
      req.body;

    const [matricesDescData, matricesClusData] = await Promise.all([
      fs.promises.readFile(path.join(userTempDir, "filteredMatrices.json")),
      fs.promises.readFile(path.join(userTempDir, "matricesClustering.json")),
    ]);

    const matricesClus = JSON.parse(matricesClusData.toString());
    const selectedClusteringObj = matricesClus.find(
      (c) => c.id_clustering === selectedClustering
    );

    if (!selectedClusteringObj) {
      return res.status(404).json({ error: "Clustering no encontrado" });
    }

    await fs.promises.writeFile(
      path.join(userTempDir, "filteredClustering.json"),
      JSON.stringify(selectedClusteringObj)
    );

    const trainingForm = new FormData();
    trainingForm.append("matrices_descriptores", matricesDescData, {
      filename: "descriptores.json",
      contentType: "application/json",
    });
    trainingForm.append(
      "matriz_clustering",
      JSON.stringify(selectedClusteringObj),
      {
        filename: "clustering.json",
        contentType: "application/json",
      }
    );

    const parametrosEntrenamiento = JSON.stringify({
      neuralNetworkLayers,
      neuralNetworkParams,
    });
    trainingForm.append("parametros_entrenamiento", parametrosEntrenamiento);

    const { data } = await axios.post(
      `${API_URL}/entrenamientoRed`,
      trainingForm,
      {
        headers: {
          "x-api-key": API_KEY,
          ...trainingForm.getHeaders(),
        },
        httpsAgent: agent,
        responseType: "arraybuffer",
      }
    );

    const zipPath = path.join(userTempDir, "archivos.zip");
    await fs.promises.writeFile(zipPath, data);

    const directory = await unzipper.Open.buffer(data);

    const modelFilePath = path.join(userTempDir, "modelo_entrenado.keras");
    const modelFile = directory.files.find(
      (file) => file.path === "modelo_entrenado.keras"
    );
    await modelFile.stream().pipe(fs.createWriteStream(modelFilePath));

    const confusionMatrixFile = directory.files.find(
      (file) => file.path === "matriz_confusion.json"
    );
    const confusionMatrixData = await confusionMatrixFile.buffer();
    const confusionMatrixJson = JSON.parse(
      confusionMatrixData.toString("utf-8")
    );

    const confusionMatrixPath = path.join(userTempDir, "matriz_confusion.json");
    await fs.promises.writeFile(
      confusionMatrixPath,
      JSON.stringify(confusionMatrixJson)
    );

    res.json({
      image_prediction: confusionMatrixJson.matriz_confusion,
    });

    next();
  } catch (error) {
    console.error("Error en entrenamiento:", error);
    res.status(500).json({ error: `Error en entrenamiento: ${error.message}` });
  }
};

const entrenamientoRedJSON = async (req, res) => {
  if (!req.auth?.payload?.sub) {
    return res.status(401).json({ error: "Usuario no autenticado" });
  }

  const userId = req.auth.payload.sub;
  const sanitizedUserId = userId.replace(/[|:<>"?*]/g, "_");
  const userTempDir = path.join(__dirname, "../../uploads/temp", sanitizedUserId);

  try {
    // 1. Validar archivo subido
    if (!req.file) {
      return res.status(400).json({ error: "Se requiere el archivo characteristicMatrix.json" });
    }

    // 2. Parsear y validar JSON
    const characteristicData = JSON.parse(req.file.buffer.toString());
    
    // 3. Validar estructura básica
    const hasDescriptors = characteristicData.some(item => item.id_descriptor);
    const hasClustering = characteristicData.some(item => item.id_clustering);

    if (!hasDescriptors || !hasClustering) {
      return res.status(400).json({
        error: "El JSON debe contener al menos un descriptor y un clustering"
      });
    }

    // 4. Crear directorio temporal
    await fs.promises.mkdir(userTempDir, { recursive: true });

    // 5. Guardar archivo original
    const matricesPath = path.join(userTempDir, "matrices_descriptores.json");
    await fs.promises.writeFile(matricesPath, JSON.stringify(characteristicData));

    // 6. Configurar FormData para Python
    const form = new FormData();
    form.append("matrices_descriptores", fs.createReadStream(matricesPath), {
      filename: "matrices_descriptores.json",
      contentType: "application/json"
    });

    let neuralNetworkData;
    try {
      neuralNetworkData = JSON.parse(req.body.neuralNetwork);
    } catch (parseError) {
      return res.status(400).json({
        error: "El campo neuralNetwork debe ser un JSON válido"
      });
    }

    const parametrosEntrenamiento = JSON.stringify(neuralNetworkData);

    form.append("parametros_entrenamiento", parametrosEntrenamiento);

    // 8. Enviar a API Python
    const { data } = await axios.post(`${API_URL}/entrenamientoRed`, form, {
      headers: {
        "x-api-key": API_KEY,
        ...form.getHeaders(),
        "Content-Type": "multipart/form-data"
      },
      httpsAgent: agent,
      responseType: "arraybuffer"
    });

    const zipPath = path.join(userTempDir, "archivos.zip");
    await fs.promises.writeFile(zipPath, data);

    const directory = await unzipper.Open.buffer(data);

    const modelFilePath = path.join(userTempDir, "modelo_entrenado.keras");
    const modelFile = directory.files.find(
      (file) => file.path === "modelo_entrenado.keras"
    );
    await modelFile.stream().pipe(fs.createWriteStream(modelFilePath));

    const confusionMatrixFile = directory.files.find(
      (file) => file.path === "matriz_confusion.json"
    );
    const confusionMatrixData = await confusionMatrixFile.buffer();
    const confusionMatrixJson = JSON.parse(
      confusionMatrixData.toString("utf-8")
    );

    const confusionMatrixPath = path.join(userTempDir, "matriz_confusion.json");
    await fs.promises.writeFile(
      confusionMatrixPath,
      JSON.stringify(confusionMatrixJson)
    );

    res.json({
      image_prediction: confusionMatrixJson.matriz_confusion,
    });


  } catch (error) {
    console.error("Error en entrenamientoRedJSON:", error);
    
    const statusCode = error.response?.status || 500;
    const errorMessage = error.response?.data?.error || error.message;

    res.status(statusCode).json({
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.stack : null
    });
  }
};

module.exports = { entrenamientoRed, entrenamientoRedJSON };
