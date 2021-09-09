var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var DogSchema = new Schema({
  name: { type: String, required: true, minLength: 1, maxLength: 20 },
  breed: { type: Schema.Types.ObjectId, ref: "Breed", required: true },
  breeder: { type: Schema.Types.ObjectId, ref: "Breeder", required: true },
  location: { type: Schema.Types.ObjectId, ref: "Location", required: true },
  // size: { type: Schema.Types.ObjectId.size, ref: "Breed", required: true },
  description: { type: String, required: true, minLength: 1, maxLength: 100 },
  temperment: { type: String, enum: ["Assertive", "Neutral", "Passive"] },
  // size: { type: String, enum: ["Small", "Medium", "Large", "Extra-Large"] },
  neuteredSpayed: { type: Boolean },
  age: {
    type: Number,
    required: true,
    min: [0, "Must be at least 0 years old"],
    max: [20, "We prefer to find homes for dogs that are living"],
  },
  sex: { type: String, enum: ["Male", "Female"] },
  // photoURL: {type: String, required: true},
  adoptionFee: {
    type: Number,
    required: true,
    min: [0, "Please enter an amount above $0.00"],
    max: [
      10000,
      "While we're sure your dog is worth that much to you, we'd like to keep prices reasonable for our customers",
    ],
  },
  photoURL: { type: String },
});

DogSchema.virtual("url").get(function () {
  return "/catalog/dog/" + this._id;
});

module.exports = mongoose.model("Dog", DogSchema);
