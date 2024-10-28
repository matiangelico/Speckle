const {DescriptorConfig} = require('../models/DescriptorConfig');

const getAllDescriptors = async (req, res) => {
  try {
    // Aquí deberías realizar una consulta que incluya todos los descriptores
    const allDescriptors = await DescriptorConfig.find(); // Asegúrate de que este modelo incluya todos los descriptores
    res.json(allDescriptors);
  } catch (error) {
    console.error('Error al obtener descriptores:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

const updateDefaultValues = async (req, res) => {
  console.log("Actualizando valores");
  const updatedDescriptors = req.body;

  try {
      // Iterar sobre cada descriptor y actualizar los parámetros
      for (const descriptor of updatedDescriptors) {
          const { id, params } = descriptor;

          // Buscar el descriptor por ID
          const descriptorToUpdate = await DescriptorConfig.findById(id);
          if (!descriptorToUpdate) {
              return res.status(404).json({ message: `Descriptor con ID ${id} no encontrado` });
          }

          // Actualizar los parámetros en el descriptor
          for (const param of params) {
              const paramIndex = descriptorToUpdate.params.findIndex(p => p.paramName === param.paramName);
              if (paramIndex !== -1) {
                  descriptorToUpdate.params[paramIndex].value = param.value; // Actualizar el valor
              }
          }

          // Guardar los cambios en la base de datos
          await descriptorToUpdate.save();
      }

      return res.status(200).json({ message: 'Valores por defecto de los descriptores actualizados correctamente' });
  } catch (error) {
      console.error('Error al actualizar los valores por defecto:', error);
      return res.status(500).json({ message: 'Error interno del servidor' });
  }
};



module.exports = {getAllDescriptors,updateDefaultValues};

