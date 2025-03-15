const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const prediction = require("../controllers/predictionController");

router.post(
  "/:experienceId",
  authMiddleware,
  prediction.experiencePrediction
);

module.exports = router;