const Experience = require("../models/experienceConfig");
const path = require("path");
const fs = require("fs").promises;
const DefaultValuesConfig = require("../models/defaultValuesConfig");
const { execFile } = require("child_process");
const ffprobePath = require("ffprobe-static").path;

exports.saveExperience = async (req, res) => {
  try {
    const { name, video, selectedDescriptors } = req.body;
    const userId = req.auth.payload.sub;
    const sanitizedUserId = userId.replace(/[|:<>"?*]/g, "_");

    if (!video?.name || !video?.width || !video?.height || !video?.frames) {
      throw new Error("Parámetros del video incompletos");
    }

    const userTempDir = path.join(__dirname, "../../uploads/temp", sanitizedUserId);
    await fs.access(userTempDir).catch(() => {
      throw new Error("La carpeta del usuario no existe");
    });

    const modelPath = path.join(userTempDir, "modelo_entrenado.keras");
    const trainedModel = await fs.readFile(modelPath);

    const defaultConfig = await DefaultValuesConfig.findOne();
    if (!defaultConfig) throw new Error("Configuración por defecto no encontrada");

    const completeDescriptors = selectedDescriptors.map((frontendDesc) => {
      const fullDescriptor = defaultConfig.defaultValues.descriptors.find(
        d => d.id === frontendDesc.id
      );

      if (!fullDescriptor) throw new Error(`Descriptor ${frontendDesc.id} no encontrado`);
      
      return {
        name: fullDescriptor.name,
        id: frontendDesc.id,
        params: frontendDesc.params.map((param) => ({
          paramName: fullDescriptor.params.find(p => p.paramId === param.paramId)?.paramName || "unknown",
          paramId: param.paramId,
          value: param.value
        }))
      };
    });

    const newExperience = new Experience({
      userId,
      name,
      video: {
        name: video.name,
        width: String(video.width),
        height: String(video.height),
        frames: String(video.frames)
      },
      selectedDescriptors: completeDescriptors,
      trainedModel,
    });

    const savedExperience = await newExperience.save();
    res.status(201).json({ id: savedExperience._id });
    
  } catch (error) {
    console.error("Error al guardar la experiencia:", error);
    res.status(500).json({
      error: "Error al guardar la experiencia",
      details: error.message
    });
  }
};

exports.getExperience = async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id).select(
      "-trainedModel"
    );
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
    const experiences = await Experience.find({ userId }).select("name date");
    res.json(experiences);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener experiencias" });
  }
};

exports.deleteExperience = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.auth.payload.sub;

    const experience = await Experience.findOne({ _id: id, userId });

    if (!experience) {
      return res
        .status(404)
        .json({
          error: "Experiencia no encontrada o no autorizada para eliminar",
        });
    }

    await Experience.deleteOne({ _id: id });

    res.status(200).json({ message: "Experiencia eliminada exitosamente" });
  } catch (error) {
    console.error("Error al eliminar la experiencia:", error);
    res.status(500).json({ error: "Error al eliminar la experiencia" });
  }
};
