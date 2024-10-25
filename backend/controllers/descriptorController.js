const DescriptorConfig = require('../models/DescriptorConfig');

const getAllDescriptors = async (req, res) => {
    try {
        const descriptorConfigs = await DescriptorConfig.find({});
        res.json(descriptorConfigs);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los descriptores' });
    }
};

module.exports = {getAllDescriptors};

