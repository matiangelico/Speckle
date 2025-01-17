const { DescriptorConfig } = require("../models/descriptorConfig");
const defaultDescriptors = require("../../data/defaultDescriptors.json");


//registrar valores predeterminados
const registerDefaultDescriptors = async (userId) => {
  try {
    const existingConfig = await DescriptorConfig.findOne({ userId });
    if (existingConfig) {
      return { message: "User already has default descriptors." };
    }

    const newConfig = new DescriptorConfig({
      userId,
      descriptors: defaultDescriptors.descriptors,
    });

    await newConfig.save();

    return { message: "Default descriptors added successfully." };
  } catch (error) {
    console.error("Error adding default descriptors:", error);
    throw new Error("Failed to add default descriptors.");
  }
};

const getAllDescriptors = async (req, res) => {

  console.log('req.auth:', req.auth);
  console.log('req.user:', req.user); 

  if (!req.user || !req.user.sub) {
    return res.status(401).json({ message: 'Usuario no autenticado.' });
  }
  const userId = req.user.sub;

  try {
    const config = await DescriptorConfig.findOne({ userId });


    if (!config) {
      const registrationResponse = await registerDefaultDescriptors(userId);
      return res.status(201).json({ message: registrationResponse.message });
    }

    res.json(config.descriptors);
  } catch (error) {
    console.error("Error al obtener descriptores:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

const updateDefaultValues = async (req, res) => {
  const updatedDescriptors = req.body;

  try {
    for (const descriptor of updatedDescriptors) {
      const { id, params } = descriptor;

      const descriptorToUpdate = await DescriptorConfig.findById(id);
      if (!descriptorToUpdate) {
        return res
          .status(404)
          .json({ message: `Descriptor con ID ${id} no encontrado` });
      }

      for (const param of params) {
        const paramIndex = descriptorToUpdate.params.findIndex(
          (p) => p.paramName === param.paramName
        );
        if (paramIndex !== -1) {
          descriptorToUpdate.params[paramIndex].value = param.value;
        }
      }

      await descriptorToUpdate.save();
    }

    return res
      .status(200)
      .json({
        message:
          "Valores por defecto de los descriptores actualizados correctamente",
      });
  } catch (error) {
    console.error("Error al actualizar los valores por defecto:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

module.exports = { registerDefaultDescriptors, getAllDescriptors, updateDefaultValues };
