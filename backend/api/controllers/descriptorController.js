const { DescriptorConfig } = require("../models/DescriptorConfig");

const getAllDescriptors = async (req, res) => {
  try {
    const allDescriptors = await DescriptorConfig.find();
    res.json(allDescriptors);
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

module.exports = { getAllDescriptors, updateDefaultValues };
