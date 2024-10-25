// routes/descriptorRoutes.js
const express = require('express');
const router = express.Router();
const descriptorController = require('../controllers/descriptorController');

// Ruta para obtener todos los defaultValues
router.get('/', descriptorController.getAllDescriptors);

module.exports = router;

