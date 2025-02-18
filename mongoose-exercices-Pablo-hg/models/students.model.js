const mongoose = require("mongoose");

// creamos una constante que corrsponderá al "esquema"(Schema) de los datos del modelo
const Schema = mongoose.Schema;

// El "Schema" define la estructura de los documentos de la coleccion
// Si en el body no introducimos los mismo atributos que el modelo, el atributo que no esté, no se añadirá
const studentSchema = new Schema({
  first_name: {
    type: String,
    required: [true, "First name is required"],
    minlength: [2, "First name must be at least 2 characters long"],
  },
  last_name: {
    type: String,
    required: [true, "Last name is required"],
    minlength: [2, "Last name must be at least 2 characters long"],
  },
  birthyear: {
    type: Number,
    required: [true, "Birthyear is required"],
    min: [1900, "Birthyear must be at least 1900"],
    max: [2020, "Birthyear must be at most 2020"],
  },
  dni: {
    type: String,
    match: /^[X-Z]?[0-9]{7,8}[A-Z]$/,
  },
  masterid: {
    type: Schema.Types.ObjectId,
    ref: "Master", // --> nombre del objeto que contiene el modelo
  },
});

// "Student" es la clase modelo de mongoose,
// Todos los "estudiantes" en la colecion, compratiran las propiedades

// exporta un modelo de Mongoose llamado Student,
//  que está basado en el esquema studentSchema
module.exports = mongoose.model("Student", studentSchema);
