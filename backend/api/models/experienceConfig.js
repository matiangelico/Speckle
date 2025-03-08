const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { descriptorSchema } = require("./defaultValuesConfig");

const experienceSchema = new Schema(
  {
    userId: { type: String, required: true },
    name: { type: String, required: true },
    video: {
      name: { type: String, required: true },
      width: { type: String, required: true },
      height: { type: String, required: true },
    },
    selectedDescriptors: { type: [descriptorSchema], required: true },
    trainedModel: { type: Buffer, required: true },
    date: {
      type: Number,
      default: () => Date.now(),
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Experience", experienceSchema);
