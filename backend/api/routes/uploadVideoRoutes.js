const express = require("express");
const router = express.Router();
const uploadController = require("../controllers/uploadVideoController");
const authMiddleware = require("../middlewares/auth");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// 1. Configuración mejorada de storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      const userId = req.auth.payload.sub;
      const sanitizedUserId = userId.replace(/[|:<>"?*]/g, "_");
      const userTempDir = path.join(
        __dirname,
        "../../uploads/temp",
        sanitizedUserId
      );

      // Crear directorio si no existe
      if (!fs.existsSync(userTempDir)) {
        fs.mkdirSync(userTempDir, { recursive: true });
        console.log(`Directorio creado: ${userTempDir}`);
      }

      cb(null, userTempDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  try {
    console.log(
      `Procesando archivo: ${file.fieldname} - Tipo: ${file.mimetype}`
    );

    if (file.fieldname === "video") {
      const allowedVideoTypes = [
        "video/avi",
        "video/x-msvideo",
        "video/msvideo",
        "video/vnd.avi",
      ];

      if (!allowedVideoTypes.includes(file.mimetype)) {
        return cb(new Error("Tipo de video no permitido. Solo AVI"), false);
      }
    }

    if (file.fieldname === "selectedDescriptors") {
      if (file.mimetype !== "application/json") {
        return cb(new Error("El descriptor debe ser un JSON"), false);
      }
    }

    cb(null, true);
  } catch (error) {
    cb(error);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 500,
    files: 2,
  },
});

const handleMulterErrors = (err, req, res, next) => {
  if (err) {
    console.error("Error en Multer:", err.message);

    if (err instanceof multer.MulterError) {
      return res.status(400).json({
        error: `Error de carga: ${err.message}`,
      });
    }

    return res.status(400).json({
      error: err.message || "Error al procesar archivos",
    });
  }
  next();
};

router.post(
  "/",
  authMiddleware,
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "selectedDescriptors", maxCount: 1 },
  ]),
  handleMulterErrors,
  uploadController.uploadVideo
);

module.exports = router;
