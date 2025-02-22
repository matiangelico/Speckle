const fs = require("fs");
const FormData = require("form-data");
const axios = require("axios");
const path = require("path");
const https = require('https');


require('dotenv').config({path:'../../.env'});

const ClusteringConfig = require('../models/clusteringConfig');

const agent = new https.Agent({ rejectUnauthorized: false });
const API_KEY = process.env.API_KEY

exports.calculateClustering = async (req, res) => {
  const { descriptores, clustering } = req.body;

  if (!descriptores || !clustering) {
    return res.status(400).json({ error: "Se requieren descriptores y métodos de clustering" });
  }

  if (!req.auth || !req.auth.payload || !req.auth.payload.sub) {
    return res.status(401).json({ error: "Usuario no autenticado" });
  }

  const userId = req.auth.payload.sub;
  const sanitizedUserId = userId.replace(/[|:<>"?*]/g, "_");
  const userTempDir = path.join(__dirname, "../../uploads/temp", sanitizedUserId);

  try {

    const matricesPath = path.join(userTempDir, "matrices_descriptores.json");

    if (!fs.existsSync(matricesPath)) {
      return res.status(404).json({ error: "El archivo matrices_descriptores.json no existe" });
    }

    const matricesData = JSON.parse(fs.readFileSync(matricesPath, "utf8"));
    const filteredMatrices = matricesData.filter((item) =>
      descriptores.includes(item.nombre_descriptor)
    );

    if (filteredMatrices.length === 0) {
      return res.status(404).json({ error: "No se encontraron matrices para los descriptores enviados" });
    }

    const filteredMatricesPath = path.join(userTempDir, "filteredMatrices.json");
    fs.writeFileSync(filteredMatricesPath, JSON.stringify(filteredMatrices, null, 2));
    console.log(`Guardado filteredMatrices.json en ${filteredMatricesPath}`);

    const formData = new FormData();
    const fileStream = fs.createReadStream(filteredMatricesPath);

    formData.append("matrices_descriptores", fileStream, {
      filename: "matrices.json",
      contentType: "application/json",
    });

    formData.append("datos_clustering", JSON.stringify(clustering), {
      contentType: "application/json",
    });

    const response = await axios.post("https://localhost:8000/clustering", formData, {
      headers: {
        'x-api-key': API_KEY,
        ...formData.getHeaders()
      },
      httpsAgent: agent
    });

    console.log("Respuesta de la API Python:", response.data);

    const { imagenes_clustering, matrices_clustering } = response.data;

    if (!imagenes_clustering || !matrices_clustering) {
      return res.status(500).json({ error: "Faltan datos en la respuesta de la API Python" });
    }

    const matricesClusteringPath = path.join(userTempDir, "matricesClustering.json");
    fs.writeFileSync(matricesClusteringPath, JSON.stringify(matrices_clustering, null, 2));

    console.log(`Guardado matricesClustering.json en ${matricesClusteringPath}`);

    res.status(200).json({ imagenes_clustering });
  } catch (error) {
    console.error("Error al procesar la solicitud:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.getClusteringConfig = async (req, res) => {
  try {
    const clusteringConfig = await ClusteringConfig.findOne();

    if (!clusteringConfig) {
      return res.status(404).json({ error: "No se encontraron valores por defecto" });
    }

    res.status(200).json(clusteringConfig);

  } catch (error) {
    console.error('Error al obtener valores por defecto:', error);
    res.status(500).json({ error: "Error al procesar la solicitud" });
  }
};
