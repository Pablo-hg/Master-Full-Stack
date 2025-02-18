const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const applicationSchema = new Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "event", // Referencia al evento
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Referencia al usuario
    required: true,
  },
  check: {
    type: String,
    enum: ["pending", "accepted", "declined", "banned"],
    default: "pending",
  },
});

module.exports = mongoose.model("Application", applicationSchema);
