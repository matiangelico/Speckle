const express = require("express");
const router = express.Router();
const clusteringController = require("../controllers/clusteringController");

router.post("/", clusteringController.calculateClustering);

module.exports = router;