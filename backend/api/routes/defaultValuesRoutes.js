const express = require("express");
const router = express.Router();
const defaultValuesController = require("../controllers/defaultValuesController");
const authMiddleware = require("../middlewares/auth");

router.get("/", authMiddleware, defaultValuesController.getDefaultValues);

module.exports = router;
