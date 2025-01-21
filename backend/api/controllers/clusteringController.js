const fs = require("fs");
const FormData = require("form-data");
const axios = require("axios");
const path = require("path");

exports.calculateClustering = async (req, res) => {
  const { descriptores, clustering } = req.body;

  if (!descriptores || !clustering) {
    return res.status(400).json({ error: "Se requieren descriptores y métodos de clustering" });
  }

  try {
    const matricesPath = path.join(__dirname, "../../uploads/matrices_descriptores.json");

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

    const filteredMatricesPath = path.join(__dirname, "../../uploads/filteredMatrices.json");
    const filteredMatricesJson = JSON.stringify(filteredMatrices, null, 2);

    fs.writeFileSync(filteredMatricesPath, filteredMatricesJson);
    console.log(`Guardado filteredMatrices.json en ${filteredMatricesPath}`);

    const clusteringJson = JSON.stringify(clustering);

    const formData = new FormData();
    formData.append("matrices_descriptores", Buffer.from(filteredMatricesJson), "matrices.json");
    formData.append("datos_clustering", clusteringJson);

    const response = await axios.post("http://localhost:8000/clustering", formData, {
      headers: formData.getHeaders(),
    });

    console.log("Respuesta de la API Python:", response.data);

    const { imagenesClustering, matricesClustering } = response.data;

    if (!imagenesClustering || !matricesClustering) {
      return res.status(500).json({ error: "Faltan datos en la respuesta de la API Python" });
    }

    const matricesClusteringPath = path.join(__dirname, "../uploads/matricesClustering.json");
    fs.writeFileSync(matricesClusteringPath, JSON.stringify(matricesClustering, null, 2));

    console.log(`Guardado matricesClustering.json en ${matricesClusteringPath}`);

    res.status(200).json({ imagenesClustering });
  } catch (error) {
    console.error("Error al procesar la solicitud:", error.message);
    res.status(500).json({ error: error.message });
  }
};
