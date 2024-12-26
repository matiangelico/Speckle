const FormData = require("form-data");
const fs = require("fs");
const axios = require("axios");

exports.calculateClustering = async (req, res) => {
    const { matrices, methods } = req.body;
  
    if (!matrices || !methods) {
      return res.status(400).json({ error: "Se requieren matrices y métodos" });
    }
  
    try {
      const matricesJson = JSON.stringify(matrices);
      const methodsJson = JSON.stringify(methods);
  
      const formData = new FormData();
      formData.append("jsonFile1", Buffer.from(matricesJson), "matrices.json");
      formData.append("jsonFile2", Buffer.from(methodsJson), "methods.json");
  
      const response = await axios.post("http://localhost:8000/ia", formData, {
        headers: formData.getHeaders(),
      });
  
      res.status(200).json(response.data);
    } catch (error) {
      console.error("Error al comunicarse con la API Python:", error.message);
      res.status(500).json({ error: error.message });
    }
  };