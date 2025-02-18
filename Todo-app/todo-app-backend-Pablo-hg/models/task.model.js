const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const taskSchema = new Schema({
  task_id: {
    type: Number,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: [true, "El Título es obligatorio"],
    minlength: [5, "El Título debe contener un mínimo de 5 caracteres"],
  },
  description: {
    type: String,
    required: [true, "La descripción es obligatoria"],
    minlength: [10, "La descripción debe contener un mínimo de 10 caracteres"],
  },
  status: {
    type: String,
    enum: ["TODO", "IN_PROGRESS", "DONE"],
    required: [true, "El estado es obligatorio"],
  },
  dueDate: {
    type: Date,
    required: [true, "La fecha de vencimiento es obligatoria"],
  },
  assigned: {
    type: String,
    enum: ["Pablo", "Pepe"],
    required: [true, "El usuario es obligatorio"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  modifiedAt: {
    type: Date,
    default: Date.now,
  },
  deletedAt: {
    type: Date,
  },
});

module.exports = mongoose.model("Tasks", taskSchema);
