const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatSchema = new Schema(
  {
    event: {
      type: Schema.Types.ObjectId,
      ref: "event", // Referencia al evento
      required: true,
    },
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User", // Referencia a los usuarios
      },
    ],
  },
  { timestamps: true } // Para incluir createdAt y updatedAt
);

module.exports = mongoose.model("chat", chatSchema);