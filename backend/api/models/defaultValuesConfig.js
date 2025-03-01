const mongoose = require('mongoose');

const paramSchema = new mongoose.Schema({
  paramName: String,
  paramId: String,
  type: String,
  min: { type: String, required: false },
  max: { type: String, required: false },
  step: { type: String, required: false },
  value: String,
  options: { type: [{
    value: String,
    label: String
  }], required: false },
  unit: { type: String, required: false }
}, { _id: false }); 

const descriptorSchema = new mongoose.Schema({
  name: String,
  id: String,
  params: [paramSchema]
}, { _id: false });  

const clusteringSchema = new mongoose.Schema({
  name: String,
  id: String,
  params: [paramSchema]
}, { _id: false });  

const neuralNetworkParamSchema = new mongoose.Schema({
  name: String,
  id: String,
  value: String,
  type: String
}, { _id: false }); 

const neuralNetworkLayerSchema = new mongoose.Schema({
  neurons: String,
  batchNorm: String,
  dropout: String
}, { _id: false });  

const defaultValuesSchema = new mongoose.Schema({
  descriptors: [descriptorSchema],
  clustering: [clusteringSchema],
  neuralNetworkParams: [neuralNetworkParamSchema],
  neuralNetworkLayers: [neuralNetworkLayerSchema]
}, { _id: false });  

const DefaultValuesConfig = mongoose.model('DefaultValuesConfig', new mongoose.Schema({
  defaultValues: defaultValuesSchema
}));

module.exports = DefaultValuesConfig;