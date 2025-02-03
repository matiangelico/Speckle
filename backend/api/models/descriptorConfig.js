const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const paramSchema = new Schema({
  paramName: { type: String, required: true },
  value: { type: String, required: true }
}, { _id: false });

const descriptorSchema = new Schema({
  name: { type: String, required: true },
  params: { type: [paramSchema], default: [] }
}, { _id: false });

const userDescriptorSchema = new Schema({
  userId: { type: String, required: true, unique: true },
  descriptors: { 
    type: [descriptorSchema],
    default: () => require('../../data/defaultDescriptors.json').descriptors
  }
});

module.exports = mongoose.model('DescriptorConfig', userDescriptorSchema);
