const express = require("express");
const router = express.Router();
const uploadController = require("../controllers/uploadVideoController");
const multer = require("multer");

const upload = multer({ dest: "uploads/" });

router.post("/", upload.fields([
    { name: "video", maxCount: 1 }, 
    { name: "descriptors", maxCount: 1 }  
  ]), uploadController.uploadVideo);



module.exports = router;