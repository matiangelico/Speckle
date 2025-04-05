const fs = require("fs");
const FormData = require("form-data");
const axios = require("axios");
const path = require("path");
const https = require("https");

require("dotenv").config({ path: "../../.env" });

const agent = new https.Agent({ rejectUnauthorized: false });
const API_KEY = process.env.API_KEY;
const API_URL = process.env.API_URL;

exports.calculateClustering = async (req, res) => {
  const { selectedDescriptors, selectedClustering, videoDimension } = req.body;

  if (!selectedDescriptors || !selectedClustering || !videoDimension) {
    return res
      .status(400)
      .json({ error: "Se requieren selectedDescriptors y selectedClustering" });
  }

  console.log("videoDimension", videoDimension);

  if (!videoDimension.width || !videoDimension.height) {
    return res.status(400).json({
      error: "videoDimension debe contener width y height",
    });
  }

  if (!req.auth?.payload?.sub) {
    return res.status(401).json({ error: "Usuario no autenticado" });
  }

  const userId = req.auth.payload.sub;
  const sanitizedUserId = userId.replace(/[|:<>"?*]/g, "_");
  const userTempDir = path.join(
    __dirname,
    "../../uploads/temp",
    sanitizedUserId
  );

  try {
    const matricesPath = path.join(userTempDir, "matrices_descriptores_normalizada.json");

    if (!fs.existsSync(matricesPath)) {
      return res
        .status(404)
        .json({ error: "El archivo matrices_descriptores.json no existe" });
    }

    const matricesData = JSON.parse(fs.readFileSync(matricesPath, "utf8"));

    const filteredMatrices = matricesData.filter((item) =>
      selectedDescriptors.includes(item.id_descriptor)
    );

    if (filteredMatrices.length === 0) {
      return res.status(404).json({
        error: "No se encontraron matrices para los descriptores enviados",
      });
    }

    const filteredMatricesPath = path.join(
      userTempDir,
      "filteredMatrices.json"
    );

    fs.writeFileSync(
      filteredMatricesPath,
      JSON.stringify(filteredMatrices, null, 2)
    );

    // Transformamos los datos al formato esperado por la API Python
    const clusteringParams = selectedClustering.map((method) => ({
      name: method.id,
      nro_clusters: method.value,
    }));

    const formData = new FormData();
    const fileStream = fs.createReadStream(filteredMatricesPath);

    formData.append("matrices_descriptores", fileStream, {
      filename: "matrices.json",
      contentType: "application/json",
    });
    formData.append("video_dimensiones", JSON.stringify(videoDimension));

    const clusteringParamsString = JSON.stringify(selectedClustering);
    formData.append("datos_clustering", clusteringParamsString);

    const response = await axios.post(`${API_URL}/clustering`, formData, {
      // const response = await axios.post(
      //     `https://127.0.0.1:8000/clustering`,
      //     formData,
      //   {
      headers: {
        "x-api-key": API_KEY,
        ...formData.getHeaders(),
      },
      httpsAgent: agent,
    });

    const { imagenes_clustering, matrices_clustering } = response.data;

    if (!imagenes_clustering || !matrices_clustering) {
      return res
        .status(500)
        .json({ error: "Faltan datos en la respuesta de la API Python" });
    }

    const matricesClusteringPath = path.join(
      userTempDir,
      "matricesClustering.json"
    );

    fs.writeFileSync(
      matricesClusteringPath,
      JSON.stringify(matrices_clustering, null, 2)
    );

    res.status(200).json({ imagenes_clustering });
  } catch (error) {
    console.error("Error al procesar la solicitud:", error.message);
    res.status(500).json({
      error: error.response?.data?.message || error.message,
    });
  }
};
