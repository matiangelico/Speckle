const express = require("express");
const router = express.Router();
const { entrenamientoRed} = require("../controllers/trainingController");
const authMiddleware = require("../middlewares/auth");



router.post("/", 
    authMiddleware,
    entrenamientoRed    
);


module.exports = router;