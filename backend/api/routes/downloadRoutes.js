const express = require("express");
const router = express.Router();
const downloadController = require("../controllers/downloadController");
const authMiddleware = require("../middlewares/auth");

router.get("/",authMiddleware, downloadController.downloadMatrix);

module.exports = router;