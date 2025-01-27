const DescriptorConfig = require('../models/descriptorConfig');

const getOrCreateUserDescriptors = async (userId) => {
  return DescriptorConfig.findOneAndUpdate(
    { userId },
    { $setOnInsert: { descriptors: require('../data/defaultDescriptors.json') } },
    { upsert: true, new: true }
  );
};

const getUserDescriptors = async (req, res) => {
  try {
    const config = await getOrCreateUserDescriptors(req.auth.payload.sub);
    res.json(config.descriptors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {getUserDescriptors};