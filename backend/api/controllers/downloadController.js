const path = require("path");
const fs = require("fs").promises;

exports.downloadMatrix = async (req, res) => {
  try {
    const { type, method } = req.query;
    const userId = req.auth.payload.sub;

    // Validación de parámetros
    if (
      !["descriptor", "clustering", "prediction"].includes(type) ||
      !method
    ) {
      return res.status(400).json({ error: "Parámetros inválidos" });
    }

    // Validación específica para prediction
    if (type === "prediction" && !["tensor", "matrix"].includes(method)) {
      return res.status(400).json({ error: "Método inválido para prediction" });
    }

    const sanitizedUserId = userId.replace(/\|/g, "_");
    const userDir = path.join(
      __dirname,
      "..",
      "..",
      "uploads",
      "temp",
      sanitizedUserId
    );

    // Determinar el nombre del archivo
    let filename;
    switch (type) {
      case "descriptor":
        filename = "matrices_descriptores.json";
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
      case "descriptor":
        const descriptor = jsonData.find(
          (item) => item.id_descriptor === method
        );
        if (!descriptor) {
          return res.status(404).json({ error: "Descriptor no encontrado" });
        }
        matrix = descriptor.matriz_descriptor;
        break;

        case "clustering":
          const clustering = jsonData.find(
            (item) => item.id_clustering === method 
          );
          if (!clustering) {
            return res.status(404).json({ error: "Método de clustering no encontrado" });
          }
          matrix = clustering.matriz_clustering;
          break;

          case "prediction":
            if (method === "tensor") {
              matrix = jsonData.tensor; 
            } else {
              matrix = jsonData.matriz;
            }
            break;
    }

    res.setHeader("Content-Type", "application/json");
    res.attachment(`${type}_${method}_${Date.now()}.json`);
    res.send(JSON.stringify(matrix));

  } catch (error) {
    console.error("Error en descarga:", error);

    if (error.code === "ENOENT") {
      return res.status(404).json({ error: "Recurso no encontrado" });
    }

    res.status(500).json({ error: "Error al procesar la solicitud" });
  }
};
