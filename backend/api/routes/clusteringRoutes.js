const express = require("express");
const router = express.Router();
const clusteringController = require("../controllers/clusteringController");
const authMiddleware = require("../middlewares/auth");

router.post("/",authMiddleware, clusteringController.calculateClustering);


module.exports = router;