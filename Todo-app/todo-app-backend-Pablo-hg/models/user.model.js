const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  user_id: {
    type: Number,
    required: true,
    unique: true,
  },
  firstname: {
    type: String,
    required: [true, "El firstname es obligatorio"],
    minlength: [5, "El firstname debe contener un mínimo de 5 caracteres"],
  },
  lastname: {
    type: String,
    required: [true, "La lastname es obligatoria"],
    minlength: [5, "La lastname debe contener un mínimo de 10 caracteres"],
  },
  email: {
    type: String,
    required: [true, "La email es obligatoria"],
    minlength: [5, "La email debe contener un mínimo de 10 caracteres"],
  },
  password: {
    type: String,
    required: [true, "La password es obligatoria"],
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

module.exports = mongoose.model("Users", userSchema);
