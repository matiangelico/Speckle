const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const experienceController = require('../controllers/experienceController');

router.get("/:id", authMiddleware, experienceController.getExperience);
router.post("/", authMiddleware, experienceController.saveExperience);
router.get("/user/all", authMiddleware, experienceController.getUserExperiences);

module.exports = router;
