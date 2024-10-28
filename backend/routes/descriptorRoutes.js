const express = require('express');
const router = express.Router();
const { getAllDescriptors, updateDefaultValues } = require('../controllers/descriptorController');

router.get('/', getAllDescriptors);
router.post('/update-default-values',updateDefaultValues);


module.exports = router;

