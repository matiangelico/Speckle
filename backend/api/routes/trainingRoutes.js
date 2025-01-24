const express = require("express");
const router = express.Router();
const { entrenamientoRed, PrediccionRed } = require("../controllers/trainingController");


router.post("/", 
    entrenamientoRed,
    PrediccionRed      
);


module.exports = router;