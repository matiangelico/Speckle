const express = require("express");
const router = express.Router();
const videoDimensionsController = require("../controllers/videoDimensionsController");
const authMiddleware = require("../middlewares/auth");
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;

// Configuración específica para dimensiones
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const userId = req.auth.payload.sub;
      const sanitizedUserId = userId.replace(/[|:<>"?*]/g, "_");
      const userTempDir = path.join(
        __dirname,
        "../../uploads/temp",
        sanitizedUserId
      );

      await fs.mkdir(userTempDir, { recursive: true });
      cb(null, userTempDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "video/avi",
      "video/x-msvideo",
      "video/msvideo",
      "video/vnd.avi",
      "application/octet-stream"
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Solo se permiten videos AVI"), false);
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 500, // 500MB
  },
});

router.post(
  "/",
  authMiddleware,
  upload.single("video"),
  videoDimensionsController.getDimensions
);

module.exports = router;
