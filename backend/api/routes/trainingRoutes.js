const express = require("express");
const router = express.Router();
const multer = require("multer");
const { 
  entrenamientoRed,
  entrenamientoRedJSON 
} = require("../controllers/trainingController");
const authMiddleware = require("../middlewares/auth");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * 50 // 50MB
  }
});

// Endpoint original que no se modifica
router.post("/", authMiddleware, entrenamientoRed);

// Para el endpoint /json, se envía el archivo characteristicMatrix y el campo de texto neuralNetwork
router.post(
  "/json",
  authMiddleware,
  upload.single("characteristicMatrix"),
  entrenamientoRedJSON
);

module.exports = router;
