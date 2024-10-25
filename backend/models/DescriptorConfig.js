// models/DescriptorConfig.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const descriptorConfigSchema  = new Schema({
    "Diferencias Pesadas": {
      peso: String
    },
    Fuzzy: {
      threshold: String
    },
    "Wavelet Entropy": {
      wavelet: String,
      level: String
    },
    "High Low Ratio": {
      fs: String
    },
    "Filtro Bajo": {
      fmin: String,
      fmax: String,
      at_paso: String,
      at_rechazo: String,
      fs: String
    },
    "Filtro Medio": {
      fmin: String,
      fmax: String,
      at_paso: String,
      at_rechazo: String,
      fs: String
    },
    "Filtro Alto": {
      fmin: String,
      fmax: String,
      at_paso: String,
      at_rechazo: String,
      fs: String
    }
  });
  
  // Crear el modelo
  const DescriptorConfig  = mongoose.model('DescriptorConfig', descriptorConfigSchema, 'defaultValues');
  module.exports = DescriptorConfig;
