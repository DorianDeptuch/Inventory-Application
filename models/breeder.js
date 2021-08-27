var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var BreederSchema = new Schema({
  name: { type: String, required: true, minLength: 1, maxLength: 50 },
  established: { type: Date },
  location: { type: Schema.Types.ObjectId, ref: "Location", required: true },
  specialty: {
    type: String,
    enum: ["Service", "Hunting", "Protection", "Showdog", "Pet"],
  },
  description: { type: String, required: true, minLength: 1, maxLength: 300 },
});

BreederSchema.virtual("url").get(function () {
  return "/catalog/breeder" + this._id;
});

module.exports = mongoose.model("Breeder", BreederSchema);
