const FormData = require("form-data");
const fs = require("fs");
const axios = require("axios");
const path = require("path");

exports.uploadVideo = async (req, res) => {
  console.log("Auth payload:", req.auth?.payload); 
  console.log("Cuerpo de la solicitud (body):", req.body);
  console.log("Archivos recibidos:", req.files); 

  const userId = req.auth.payload.sub; 
  const sanitizedUserId = userId.replace(/[|:<>"?*]/g, "_");
  const userTempDir = path.join(__dirname, "../../uploads/temp", sanitizedUserId);

  if (!fs.existsSync(userTempDir)) {
    fs.mkdirSync(userTempDir, { recursive: true });
    console.log(`Carpeta temporal creada en: ${userTempDir}`);
  } 

  if (!req.files || !req.files.video || !req.files.descriptors) {
    return res.status(400).json({ error: "Faltan archivos: video o descriptors" });
  }

  const videoPath = req.files.video[0].path;  
  const descriptorsPath = req.files.descriptors[0].path;  

  const descriptors = JSON.parse(fs.readFileSync(descriptorsPath, 'utf8'));

  try {
    const formData = new FormData();
    const videoStream = fs.createReadStream(videoPath);

    formData.append("video_experiencia", videoStream, req.files.video[0].originalname);  
    formData.append("datos_descriptores", JSON.stringify(descriptors)); 

    const response = await axios.post("http://localhost:8000/descriptores", formData, {
      headers: formData.getHeaders(),
    });

    const imagenes_descriptores = response.data.imagenes_descriptores;
    const matrices_descriptores = response.data.matrices_descriptores;

    const matricesFilePath = path.join(userTempDir, "matrices_descriptores.json");
    fs.writeFileSync(matricesFilePath, JSON.stringify(matrices_descriptores, null, 2));
    console.log(`Archivo JSON creado en: ${matricesFilePath}`);

    res.status(200).json({imagenes_descriptores});
  } catch (error) {
    console.error("Error al procesar la solicitud:", error.message);
    res.status(500).json({ error: error.message });
  }
};
