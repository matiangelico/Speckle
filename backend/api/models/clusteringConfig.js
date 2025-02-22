const mongoose = require('mongoose');

const ParamSchema = new mongoose.Schema({
  paramName: { type: String, required: true },
  paramId: { type: String, required: true },
  type: { type: String, required: true },
  value: { type: String, required: false },
  min: { type: String, required: false },
  max: { type: String, required: false },
  step: { type: String, required: false }
});

const ClusteringSchema = new mongoose.Schema({
  name: { type: String, required: true },
  id: { type: String, required: true },
  params: { type: [ParamSchema], required: false }
});

const DefaultValuesSchema = new mongoose.Schema({
  clustering: { type: [ClusteringSchema], required: true }
});

module.exports = mongoose.model('clusteringconfigs', DefaultValuesSchema);