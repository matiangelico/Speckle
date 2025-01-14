const express = require("express");
const router = express.Router();
const multer = require("multer");
const clusteringController = require("../controllers/clusteringController");

const upload = multer({ dest: "uploads/" });

router.post("/", clusteringController.calculateClustering);

module.exports = router;