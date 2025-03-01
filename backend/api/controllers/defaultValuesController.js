const DefaultValuesConfig = require('../models/defaultValuesConfig');

exports.getDefaultValues = async (req, res) => {
  try {
    const config = await DefaultValuesConfig.findOne()
      .select('-_id -__v') 
      .lean();

    if (!config) {
      return res.status(404).json({ message: 'No se encontró la configuración' });
    }

    res.status(200).json(config.defaultValues);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al obtener la configuración',
      error: error.message 
    });
  }
};