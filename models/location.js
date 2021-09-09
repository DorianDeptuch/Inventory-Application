var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var LocationSchema = new Schema({
  name: { type: String, required: true, minLength: 1, maxLength: 100 },
  description: { type: String, required: true, minLength: 1, maxLength: 1000 },
  // popularBreeds: {type: String, required: true, IMPORT FROM EXTERNAL LIBRARY OF ALL DOG BREEDS???}
  photoURL: { type: String },
});

LocationSchema.virtual("url").get(function () {
  return "/catalog/location/" + this._id;
});

module.exports = mongoose.model("Location", LocationSchema);
