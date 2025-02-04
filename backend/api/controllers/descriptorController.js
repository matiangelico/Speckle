const DescriptorConfig = require('../models/descriptorConfig');

const getOrCreateUserDescriptors = async (userId) => {
  return DescriptorConfig.findOneAndUpdate(
    { userId },
    { 
      $setOnInsert: { descriptors: require('../../data/defaultDescriptors.json').descriptors } 
    },
    { upsert: true, new: true, runValidators: true } 
  );
};

const getUserDescriptors = async (req, res) => {
  try {
    const config = await getOrCreateUserDescriptors(req.auth.payload.sub);
    res.json({ descriptors: config.descriptors }); 
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUserDescriptors = async (req, res) => {
  try {
    const userId = req.auth.payload.sub;
    const { descriptors } = req.body;

    if (!descriptors || !Array.isArray(descriptors)) {
      return res.status(400).json({ error: "Formato inválido. Se espera un array de descriptores." });
    }

    const updatedConfig = await DescriptorConfig.findOneAndUpdate(
      { userId },
      { descriptors},
      { new: true }
    );

    if (!updatedConfig) {
      const newConfig = new DescriptorConfig({
        userId,
        descriptors
      });
      await newConfig.save();
      return res.status(201).json({ descriptors: newConfig.descriptors });
    }

    res.json({ descriptors: updatedConfig.descriptors });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {getUserDescriptors, updateUserDescriptors};