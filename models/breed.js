var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var BreedSchema = new Schema({
  name: { type: String, required: true },
  size: {
    type: String,
    required: true,
    enum: ["Small", "Medium", "Large", "Extra-Large"],
  },
  description: { type: String, required: true, minLength: 1, maxLength: 1700 },
});

BreedSchema.virtual("url").get(function () {
  return "/catalog/breed/" + this._id;
});

module.exports = mongoose.model("Breed", BreedSchema);
