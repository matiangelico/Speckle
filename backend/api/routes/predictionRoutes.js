const express = require("express");
const multer = require("multer");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const experiencePrediction = require("../controllers/experiencePredictionController");

const upload = multer({ dest: "uploads/" });

router.post("/", authMiddleware, upload.single("video"), experiencePrediction.experiencePrediction);

module.exports = router;

