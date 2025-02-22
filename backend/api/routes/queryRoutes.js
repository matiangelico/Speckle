const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const queryController = require('../controllers/queryController');

router.post("/", authMiddleware, queryController.queryProcess);

module.exports = router;
