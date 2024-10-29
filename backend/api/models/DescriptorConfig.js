
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paramSchema = new Schema({
    paramName: { type: String, required: true },
    value: { type: String, required: true }
}, { _id: false });

const descriptorSchema = new Schema({
    name: { type: String, required: true, unique: true }, 
    params: { type: [paramSchema], default: [] } 
});

const DescriptorConfig = mongoose.model('DescriptorConfig', descriptorSchema, 'defaultValues');

module.exports = {
    DescriptorConfig
};

