const Experience = require("../models/experienceConfig");
const path = require("path");
const fs = require("fs");
const axios = require("axios");

exports.queryProcess = async (req, res) => {
  try {

    const { experienceId } = req.body;
    const videoFile = req.file;
    const userId = req.auth.payload.sub;

    if (!experienceId || !videoFile) {
        return res.status(400).json({ error: "Se requieren experienceId y un archivo de video." });
    }

    const experience = await Experience.findOne({ _id: experienceId, userId });
    if (!experience) {
        return res.status(404).json({ error: "Experiencia no encontrada o no pertenece al usuario." });
    }
    const trainedModelBuffer = experience.trainedModel.buffer;

    res.json(experience);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la experiencia" });
  }
};