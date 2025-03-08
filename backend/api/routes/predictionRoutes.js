const express = require("express");
const multer = require("multer");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const prediction = require("../controllers/predictionController");

const upload = multer({ dest: "uploads/" });

router.post(
  "/",
  authMiddleware,
  upload.single("video"),
  prediction.experiencePrediction
);

module.exports = router;
