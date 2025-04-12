const FormData = require("form-data");
const fs = require("fs");
const axios = require("axios");
const path = require("path");
const https = require("https");

require("dotenv").config({ path: "../../.env" });

const agent = new https.Agent({ rejectUnauthorized: false });
const API_KEY = process.env.API_KEY;
const API_URL = process.env.API_URL;

exports.uploadVideo = async (req, res) => {
  console.log("Cuerpo de la solicitud (body):", req.body);
  console.log("Archivos recibidos:", req.files);

  const userId = req.auth.payload.sub;
  const sanitizedUserId = userId.replace(/[|:<>"?*]/g, "_");
  const userTempDir = path.join(
    __dirname,
    "../../uploads/temp",
    sanitizedUserId
  );

  if (!fs.existsSync(userTempDir)) {
    fs.mkdirSync(userTempDir, { recursive: true });
    console.log(`Carpeta temporal creada en: ${userTempDir}`);
  }

  // Validación actualizada con el nombre correcto
  if (!req.files?.video || !req.files?.selectedDescriptors) {
    return res
      .status(400)
      .json({ error: "Faltan archivos: video o selectedDescriptors" });
  }

  const videoPath = req.files.video[0].path;
  const descriptorsPath = req.files.selectedDescriptors[0].path; // Nombre actualizado

  try {
    const descriptors = JSON.parse(fs.readFileSync(descriptorsPath, "utf8"));

    // Validación adicional del formato JSON
    if (
      !descriptors.selectedDescriptors ||
      !Array.isArray(descriptors.selectedDescriptors)
    ) {
      return res
        .status(400)
        .json({ error: "Formato inválido en selectedDescriptors" });
    }

    console.log("Enviando a endpoint python");

    const formData = new FormData();
    const videoStream = fs.createReadStream(videoPath);

    formData.append(
      "video_experiencia",
      videoStream,
      req.files.video[0].originalname
    );
    formData.append(
      "datos_descriptores",
      JSON.stringify(descriptors.selectedDescriptors)
    ); 

    const response = await axios.post(`${API_URL}/descriptores`, formData, {
      headers: {
        "x-api-key": API_KEY,
        ...formData.getHeaders(),
      },
      httpsAgent: agent,
    });

    console.log("Proceso completado");

    const { matrices_descriptores,imagenes_descriptores, matrices_descriptores_normalizada } = response.data;
    const matricesFilePath = path.join(
      userTempDir,
      "matrices_descriptores.json"
    );
    const matricesNormalizadaFilePath = path.join(
      userTempDir,
      "matrices_descriptores_normalizada.json"
    );

    fs.writeFileSync(
      matricesFilePath,
      JSON.stringify(matrices_descriptores, null, 2)
    );
    fs.writeFileSync(
      matricesNormalizadaFilePath,
      JSON.stringify(matrices_descriptores_normalizada, null, 2)
    );
    console.log(`Archivo de matrices creado en: ${matricesFilePath}`);

    res.status(200).json({ imagenes_descriptores });
  } catch (error) {
    console.error("Error al procesar la solicitud:", error.message);

    if (error instanceof SyntaxError) {
      return res.status(400).json({
        error: "Archivo selectedDescriptors con formato JSON inválido",
      });
    }

    res.status(500).json({
      error: error.response?.data?.message || error.message,
    });
  }
  finally {
    fs.unlink(videoPath, (err) => {
      if (err) console.error("Error al eliminar el archivo de video:", err);
      else console.log("Archivo de video eliminado:", videoPath);
    });
  }
};
