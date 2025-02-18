const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const masterSchema = new Schema({
  title: String,
  subjects: Array,
  description: String,
  promotion: Number,
});

module.exports = mongoose.model("Master", masterSchema);
