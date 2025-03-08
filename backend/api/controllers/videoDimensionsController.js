const { execFile } = require("child_process");
const path = require("path");
const fs = require("fs").promises;
const ffprobePath = require("ffprobe-static").path;

// controllers/videoDimensionsController.js
exports.getDimensions = async (req, res) => {
  let videoPath;

  try {
    if (!req.file) throw new Error("No se recibió archivo de video");

    // Usar la ruta directa de Multer
    videoPath = req.file.path;

    const dimensions = await new Promise((resolve, reject) => {
      execFile(
        ffprobePath,
        [
          "-v",
          "error",
          "-select_streams",
          "v:0",
          "-show_entries",
          "stream=width,height",
          "-of",
          "json",
          videoPath,
        ],
        (err, stdout, stderr) => {
          if (err)
            return reject(
              new Error(`Error en ffprobe: ${stderr || err.message}`)
            );

          try {
            const metadata = JSON.parse(stdout);
            const stream = metadata.streams[0];

            if (!stream?.width || !stream?.height) {
              throw new Error("Formato de video no soportado");
            }

            resolve({
              width: stream.width,
              height: stream.height,
            });
          } catch (error) {
            reject(error);
          }
        }
      );
    });

    res.status(200).json(dimensions);
  } catch (error) {
    res.status(500).json({
      error: "Error al obtener dimensiones",
      details: error.message,
    });
  } finally {
    if (videoPath) {
      try {
        await fs.unlink(videoPath);
        console.log(`Archivo temporal eliminado: ${videoPath}`);
      } catch (error) {
        console.error("Error limpiando archivo temporal:", error);
      }
    }
  }
};
