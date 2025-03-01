const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { descriptorSchema } = require("./defaultValuesConfig"); 

const experienceSchema = new Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true }, 
  videoName: { type: String, required: true },
  descriptors: { type: [descriptorSchema], required: true },
  trainedModel: { type: Buffer, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Experience", experienceSchema);
