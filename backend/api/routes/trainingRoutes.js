const express = require("express");
const router = express.Router();
const { entrenamientoRed, PrediccionRed } = require("../controllers/trainingController");
const authMiddleware = require("../middlewares/auth");



router.post("/", 
    authMiddleware,
    entrenamientoRed,
    PrediccionRed      
);


module.exports = router;