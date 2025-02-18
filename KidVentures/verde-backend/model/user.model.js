const mongoose = require("mongoose");

// Aquí estamos obteniendo acceso a la clase Schema de mongoose
const Schema = mongoose.Schema;

// El esquema define la ESTRUCTURA de los documentos en la colección
// esta es la PLANTILLA para todas las instancias
const userSchema = new Schema(
  {
    id_pk: String, // Clave primaria del usuario
    name: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      minlength: [2, "El nombre debe tener al menos 2 caracteres"],
    },
    email: {
      type: String,
      required: [true, "El correo electrónico es obligatorio"],
      minlength: [2, "El correo electrónico debe tener al menos 2 caracteres"],
    },
    password: {
      type: String,
      required: [true, "La contraseña es obligatoria"],
      minlength: [2, "La contraseña debe tener al menos 2 caracteres"],
    },
    interests: {
      type: [String],
      required: [true, "Debes escribir al menos un interés"],
    },
    city: {
      type: String,
      required: [true, "La ciudad es obligatoria"],
      minlength: [2, "La ciudad debe tener al menos 2 caracteres"],
    },
    direction: {
      type: String,
      required: [true, "La dirección es obligatoria"],
      minlength: [2, "La dirección debe tener al menos 2 caracteres"],
    },
    added_events: {
      type: [Object],
      required: [true, "Debes escribir al menos un interés"],
    },
    created_events: {
      type: Array,
      default: [],
    },
    manager_events: {
      type: Array,
      default: [],
    },
    images: {
      type: Array,
      default: [],
    },
    avatar_image: {
      type: String,
      default: null,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    role: {
      type: String,
      enum: ["usuario", "admin", "moderador"], // Enumeración de roles de usuario
      default: "usuario", // Valor predeterminado del rol
    },
    followers: {
      type: [String],
      required: [true, "Debes escribir al menos un interés"],
    },

    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review", 
      },
    ],

    following: {
      type: [String],
      required: [true, "Debes escribir al menos un interés"],
      enum: ["estandar", "admin", "gestor"],
      default: "estandar",
    },
    // password_changed: {
    //   type: Date,
    //   default: null,
    // },
    // change_password_token: {
    //   type: String,
    //   default: null,
    // },
    is_active: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true } // Añade automáticamente campos de createdAt y updatedAt
);

// Exportar la clase del modelo de mongoose
// Mongoose convierte el nombre del modelo en el nombre de la colección (User --> users)
module.exports = mongoose.model("users", userSchema);
