const express = require("express");
const router = express.Router();
const uploadController = require("../controllers/uploadVideoController");
const multer = require("multer");

// Configurar multer para manejar la carga de archivos
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("video"), uploadController.uploadVideo);

module.exports = router;