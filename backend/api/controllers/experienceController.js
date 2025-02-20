const Experience = require("../models/experienceConfig");

exports.saveExperience = async (req, res) => {
    try {
      console.log("Guardando experiencia...");
      
      const { name, videoName, descriptors, trainedModel } = req.body;
      const userId = req.auth.payload.sub;
  
      const newExperience = new Experience({
        userId,
        name,
        videoName,
        descriptors,
        trainedModel,
      });
  
      await newExperience.save();
      res.status(201).json({ message: "Experiencia guardada exitosamente" });
    } catch (error) {
      console.error("Error al guardar la experiencia:", error);
      res.status(500).json({ error: "Error al guardar la experiencia", details: error.message });
    }
  };
  

exports.getExperience = async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience) {
      return res.status(404).json({ error: "Experiencia no encontrada" });
    }
    res.json(experience);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la experiencia" });
  }
};

exports.getUserExperiences = async (req, res) => {
  try {
    const userId = req.auth.payload.sub;
    const experiences = await Experience.find({ userId }).select("name");
    res.json(experiences);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener experiencias" });
  }
};
