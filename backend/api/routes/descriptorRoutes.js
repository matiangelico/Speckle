const express = require("express");
const router = express.Router();
const {
  getAllDescriptors,
  updateDefaultValues,
} = require("../controllers/descriptorController");

router.get("/", getAllDescriptors);

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

module.exports = router;
