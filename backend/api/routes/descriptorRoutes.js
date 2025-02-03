const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const descriptorController = require('../controllers/descriptorController');

router.get("/", authMiddleware, descriptorController.getUserDescriptors);
router.put("/", authMiddleware, descriptorController.updateUserDescriptors);

module.exports = router;
