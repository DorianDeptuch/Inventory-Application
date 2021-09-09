var mongoose = require("mongoose");

const { DateTime } = require("luxon");

var Schema = mongoose.Schema;

var BreederSchema = new Schema({
  name: { type: String, required: true, minLength: 1, maxLength: 50 },
  established: { type: Date },
  // dogsTrained: {type: Schema.Types.ObjectId, ref: "Dogs"},
  location: { type: Schema.Types.ObjectId, ref: "Location", required: true },
  specialty: {
    type: String,
    enum: ["Service", "Hunting", "Protection", "Showdog", "Pet", "Rescue"],
  },
  description: { type: String, required: true, minLength: 1, maxLength: 300 },
  photoURL: { type: String },
});

BreederSchema.virtual("url").get(function () {
  return "/catalog/breeder/" + this._id;
});

BreederSchema.virtual("established_formatted").get(function () {
  return DateTime.fromJSDate(this.established).toLocaleString(
    DateTime.DATE_MED
  );
});

module.exports = mongoose.model("Breeder", BreederSchema);
