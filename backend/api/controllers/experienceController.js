const Experience = require("../models/experienceConfig");
const path = require('path');
const fs = require('fs').promises;
const DefaultValuesConfig = require('../models/defaultValuesConfig');
const { execFile } = require('child_process');
const ffprobePath = require('ffprobe-static').path;

exports.saveExperience = async (req, res) => {
  try {
    const { name, video, selectedDescriptors } = req.body;
    const userId = req.auth.payload.sub;
    const sanitizedUserId = userId.replace(/[|:<>"?*]/g, "_"); // Sanitiza el ID del usuario

    // Carpeta donde se almacenan los videos del usuario
    const userTempDir = path.join(__dirname, "../../uploads/temp", sanitizedUserId);

    // Verifica si la carpeta existe (opcional, pero recomendable)
    await fs.access(userTempDir).catch(() => {
      throw new Error('La carpeta del usuario no existe');
    });

    const videoPath = path.join(userTempDir, video.name);

    console.log("Ruta del video:", videoPath);

    const dimensions = await new Promise((resolve, reject) => {
      execFile(ffprobePath, [
        '-v', 'error',
        '-select_streams', 'v:0',
        '-show_entries', 'stream=width,height',
        '-of', 'json',
        videoPath
      ], (err, stdout, stderr) => {
        if (err) {
          reject(new Error(`Error ejecutando ffprobe: ${stderr || err.message}`));
          return;
        }

        try {
          const metadata = JSON.parse(stdout);
          const stream = metadata.streams?.[0];

          if (!stream || !stream.width || !stream.height) {
            reject(new Error('No se pudieron obtener las dimensiones del video'));
            return;
          }

          resolve({ width: stream.width, height: stream.height });
        } catch (parseError) {
          reject(new Error('Error al analizar la salida de ffprobe'));
        }
      });
    });

    const modelPath = path.join(userTempDir, "modelo_entrenado.keras");
    const trainedModel = await fs.readFile(modelPath);

    const defaultConfig = await DefaultValuesConfig.findOne();
    if (!defaultConfig) throw new Error('Configuración por defecto no encontrada');

    const completeDescriptors = selectedDescriptors.map(frontendDesc => {
      const fullDescriptor = defaultConfig.defaultValues.descriptors.find(
        d => d.id === frontendDesc.id
      );

      if (!fullDescriptor) throw new Error(`Descriptor ${frontendDesc.id} no encontrado en configuración`);

      return {
        name: fullDescriptor.name,
        id: frontendDesc.id,
        params: frontendDesc.params.map(param => ({
          paramName: fullDescriptor.params.find(p => p.paramId === param.paramId)?.paramName || 'unknown',
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
        width: String(dimensions.width),  
        height: String(dimensions.height) 
      },
      selectedDescriptors: completeDescriptors,
      trainedModel
    });

    await newExperience.save();
    res.status(201).json({ message: "Experiencia guardada exitosamente" });
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
    const experience = await Experience.findById(req.params.id).select('-trainedModel');
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
      return res.status(404).json({ error: "Experiencia no encontrada o no autorizada para eliminar" });
    }

    await Experience.deleteOne({ _id: id });

    res.status(200).json({ message: "Experiencia eliminada exitosamente" });
  } catch (error) {
    console.error("Error al eliminar la experiencia:", error);
    res.status(500).json({ error: "Error al eliminar la experiencia" });
  }
};

