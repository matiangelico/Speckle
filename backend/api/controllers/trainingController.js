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
      `${URL_KEY}/entrenamientoRed`,
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

module.exports = { entrenamientoRed };
