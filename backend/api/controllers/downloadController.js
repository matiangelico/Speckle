const path = require("path");
const fs = require("fs").promises;

exports.downloadMatrix = async (req, res) => {
  try {
    const { type, method } = req.query;
    const userId = req.auth.payload.sub;

    // Validación de parámetros actualizada
    const validTypes = ["descriptorRaw", "descriptorNormalized", "clustering", "prediction"];
    if (!validTypes.includes(type) || !method) {
      return res.status(400).json({ error: "Parámetros inválidos" });
    }

    // Validación específica para prediction
    if (type === "prediction" && !["tensor", "matrix"].includes(method)) {
      return res.status(400).json({ error: "Método inválido para prediction" });
    }

    const sanitizedUserId = userId.replace(/\|/g, "_");
    const userDir = path.join(__dirname, "..", "..", "uploads", "temp", sanitizedUserId);

    // Determinar el nombre del archivo actualizado
    let filename;
    switch (type) {
      case "descriptorRaw":
        filename = "matrices_descriptores.json";
        break;
      case "descriptorNormalized":
        filename = "matrices_descriptores_normalizada.json";
        break;
      case "clustering":
        filename = "matricesClustering.json";
        break;
      case "prediction":
        filename = `prediction_${method}.json`;
        break;
    }

    const filePath = path.join(userDir, filename);
    const data = await fs.readFile(filePath, "utf8");
    const jsonData = JSON.parse(data);

    let matrix;
    switch (type) {
      case "descriptorRaw":
      case "descriptorNormalized":
        const descriptor = jsonData.find(item => item.id_descriptor === method);
        if (!descriptor) {
          return res.status(404).json({ 
            error: `Descriptor ${method} no encontrado en ${type}`
          });
        }
        matrix = descriptor.matriz_descriptor;
        break;
      case "clustering":
        const filteredMatricesPath = path.join(userDir, "filteredMatrices.json");
        const filteredData = JSON.parse(await fs.readFile(filteredMatricesPath, "utf8"));
        
        const clusteringEntry = jsonData.find(item => item.id_clustering === method);
        if (!clusteringEntry) {
          return res.status(404).json({ 
            error: "Método de clustering no encontrado" 
          });
        }

        matrix = [
          ...filteredData.map(descriptor => ({
            id_descriptor: descriptor.id_descriptor,
            matriz_descriptor: descriptor.matriz_descriptor
          })),
          {
            id_clustering: clusteringEntry.id_clustering,
            matriz_clustering: clusteringEntry.matriz_clustering
          }
        ];
        break; 

      case "prediction":
        matrix = method === "tensor" ? jsonData.tensor : jsonData.matriz;
        break;
    }

    res.setHeader("Content-Type", "application/json");
    res.attachment(`${type}_${method}_${Date.now()}.json`);
    res.json(matrix);
  } catch (error) {
    console.error("Error en descarga:", error);

    if (error.code === "ENOENT") {
      return res.status(404).json({ error: "Recurso no encontrado" });
    }

    res.status(500).json({ 
      error: "Error al procesar la solicitud",
      details: error.message 
    });
  }
};