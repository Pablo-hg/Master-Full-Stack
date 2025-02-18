const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema(
  {
    chat: {
      type: Schema.Types.ObjectId,
      ref: "Chat", // Relación con el chat
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User", // Usuario que envió el mensaje
      required: true,
    },
    content: {
      type: String,
      required: true, // El contenido del mensaje
    },
    readBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User", // Usuarios que han leído el mensaje
      },
    ],
  },
  { timestamps: true } // Para incluir createdAt y updatedAt
);

module.exports = mongoose.model("Message", messageSchema);