const express = require("express");
const router = express.Router();
const uploadController = require("../controllers/uploadVideoController");
const authMiddleware = require("../middlewares/auth");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.auth.payload.sub; 
    const sanitizedUserId = userId.replace(/[|:<>"?*]/g, "_"); 
    const userTempDir = path.join(__dirname, "../../uploads/temp", sanitizedUserId); 

    fs.mkdirSync(userTempDir, { recursive: true });

    cb(null, userTempDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});


const upload = multer({storage});

router.post(
  "/",
  authMiddleware,
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "descriptors", maxCount: 1 },
  ]),
  uploadController.uploadVideo
);

module.exports = router;