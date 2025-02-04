const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { descriptorSchema } = require("./descriptorConfig"); 

const experienceSchema = new Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true }, 
  videoName: { type: String, required: true },
  descriptors: { type: [descriptorSchema], required: true },
  trainedModel: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Experience", experienceSchema);
