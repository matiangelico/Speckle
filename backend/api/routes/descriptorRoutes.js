const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const { authMiddleware } = require('../middlewares/jwt');
const {
  getAllDescriptors,
  updateDefaultValues,
  registerDefaultDescriptors,
} = require("../controllers/descriptorController");

router.get("/", authMiddleware, getAllDescriptors);

router.get('/descriptors', (req, res) => {
  const filePath = path.join(__dirname, '../descriptors/descriptors.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
          console.error('Error al leer el archivo:', err);
          res.status(500).json({ message: 'Error en el servidor' });
          return;
      }
      res.json(JSON.parse(data));
  });
});

router.post("/update-default-values", updateDefaultValues);

router.post("/register-default-descriptors", async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "userId es obligatorio" });
  }

  try {
    const response = await registerDefaultDescriptors(userId);
    res.status(200).json(response);
  } catch (error) {
    console.error("Error al registrar valores predeterminados:", error);
    res.status(500).json({ message: "Error al registrar valores predeterminados" });
  }
});

module.exports = router;
