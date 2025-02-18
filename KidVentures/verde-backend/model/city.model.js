const mongoose = require("mongoose");

// here we are getting access to Schema class from mongoose
const Schema = mongoose.Schema;

// Schema defines the STRUCTURE of documents in the collection
// this is the BLUEPRINT for all instances
const citiesSchema = new Schema({
  id_pk: String,
  name: { type: String, required: [true, "Name is required"] },
  state: { type: String, required: [true, "State is required"] },
  country: String,
  population: Number,
});

// Student is our mongoose model class
// all students in students collection will share these properties
// Mongoose turns models name to a collection name (Student --> students)
module.exports = mongoose.model("City", citiesSchema);
