// importamos el modelo
const Student = require("../models/students.model");
const mongoose = require("mongoose");

// ### Iteración #1
function createStudent(req, res) {
  // creamos un nuevo "Stundet" con x valores
  // po defecto, mongoose, añade a la estructura el "id" con un valor
  Student.create({ first_name: "Pepe", last_name: "López", birthyear: 1978 })
    // si ha salido BiquadFilterNode, informamos
    .then((studentDoc) => {
      console.log(`Student create worked well: ${studentDoc}`);
      res.send(studentDoc);
    })
    // si ha habido algun error, informamos
    .catch((error) =>
      console.log(`Creating a new student went wrong! Try again 😞 ${err}`)
    );
}
// ### Iteración #2
function createStudentByPostman(req, res) {
  console.log("REQ.BODY: ", req.body);
  Student.create(req.body)
    .then((studentDoc) => {
      console.log(`Student create worked well: ${studentDoc}`);
      res.send(studentDoc);
    })
    .catch((err) =>
      console.log(`Creating a new student went wrong! Try again 😞 ${err}`)
    );
}
// ### Iteración #3
function createVariosStudents(req, res) {
  Student.create([
    { first_name: "Pepe", last_name: "López", birthyear: 1978 },
    { first_name: "Marta", last_name: "Fernández", birthyear: 1982 },
  ])
    .then((studentDocs) => {
      console.log(`Multiple students created: ${studentDocs}`);
      res.send(studentDocs);
    })
    .catch((error) =>
      console.log(`Creating a new student went wrong! Try again 😞 ${err}`)
    );
}
// ### Iteración #4
function getStundets(req, res) {
  // modelo.find()--> buscamos aquel/aquellos "estudiantes" que cumplan la condicion dentro de los "()",
  // al estar los () vacio, devolvemos todos
  Student.find()
    .then((studentDocs) => {
      console.log("Found this: ", studentDocs);
      res.send(studentDocs);
    })
    .catch((err) => console.log("Error while getting the students: ", err));
}
// ### Iteración #5
function getStundetsBybirth(req, res) {
  // buscamos aquellos que su "birthyear" sea mayor a 1980
  // $gt --> operador que significa mayor
  Student.find({ birthyear: { $gt: 1980 } })
    .then((studentDocs) => {
      console.log("Found this 🐈: ", studentDocs);
      res.send(studentDocs);
    })
    .catch((err) => console.log("Error while getting the students: ", err));
}
// ### Iteración #6 -->  //buscamos aquel que tenga el "id" especifico (el id se pondrá en la ruta)
function getStundet(req, res) {
  Student.findById(req.params.id)
    .then((studentDoc) => {
      if (studentDoc === null) {
        console.log("Usuario no encontrado");
        res.send("Usuario no encontrado");
      } else {
        console.log("Found this student by their ID: ", studentDoc);
        res.send(studentDoc);
      }
    })
    .catch((err) => {
      console.log("Error while getting the student: ", err);
      res.send("ERROR", err);
    });
}
//### Iteración #7 --> obtenemos el numero total de estudiantes que tienen como "first_name" el valor de"Pepe"
function getcountStudents(req, res) {
  console.log("Request received to count students named Pepe");

  Student.countDocuments({ first_name: "Pepe" })
    .then((total) => {
      console.log("Total number of students with name Pepe: ", total);
      res.status(200).send(`Total number of students with name Pepe: ${total}`);
    })
    .catch((err) => {
      console.error("Error while counting students: ", err);
      res.status(500).send("Error while counting students");
    });
}
// ### Iteración #8 --> buscamos por id y actualizamos el usuario
function getStudentByIdAndUpdate(req, res) {
  const updateData = {
    $set: { first_name: "Pablo", birthyear: 1986 },
  };
  // { new: true } --> Devuelve el documento actualizado
  Student.findByIdAndUpdate(req.params.id, updateData, { new: true })
    .then((updatedStudent) => {
      if (updatedStudent === null) {
        console.log("Usuario no encontrado");
        res.status(404).send("Usuario no encontrado");
      } else {
        console.log("Updated student: ", updatedStudent);
        res.status(200).send(updatedStudent);
      }
    })
    .catch((err) => {
      console.log("Error while updating the student: ", err);
      res.status(500).send("Error while updating the student");
    });
}
// ### Iteración #9 --> buscamos por nombre y aumentos en uno el año a varios
function getStudentsByNameAndUpdate(req, res) {
  // Actualiza los documentos que coincidan
  Student.updateMany({ first_name: "Pepe" }, { $inc: { birthyear: 1 } })
    .then((updateResult) => {
      if (updateResult.matchedCount === 0) {
        console.log("No hay usuarios con ese nombre");
        return res.status(404).send("No hay usuarios con ese nombre");
      } else {
        console.log(
          `${updateResult.modifiedCount} estudiantes han sido actualizados.`
        );
        // Después de actualizar, busca los documentos actualizados
        return Student.find({ first_name: "Pepe" })
          .then((updatedStudents) => {
            const studentsInfo = updatedStudents.map((student) => ({
              id: student._id,
              first_name: student.first_name,
              birthyear: student.birthyear,
            }));

            console.log(
              "Información de los estudiantes actualizados:",
              studentsInfo
            );
            res.status(200).send({
              message: `${updateResult.modifiedCount} estudiantes han sido actualizados.`,
              students: studentsInfo,
            });
          })
          .catch((err) => {
            console.log("Error al obtener los estudiantes actualizados: ", err);
            res
              .status(500)
              .send("Error al obtener los estudiantes actualizados");
          });
      }
    })
    .catch((err) => {
      console.log("Error while updating the students: ", err);
      res.status(500).send("Error while updating the students");
    });
}
// ### Iteración #10 --> busca el 1º, si encuentra, actualiza, sino, crea uno
function getStudentAndUpdate(req, res) {
  const filter = { first_name: "Juan" };
  const updateData = {
    first_name: "Pepe",
    last_name: "Mongolo",
    birthday: 2000,
  };

  // Buscar y actualizar o crear un nuevo documento
  Student.findOneAndUpdate(filter, updateData, {
    new: true, // Retornar el documento actualizado
    upsert: true, // Crear un nuevo documento si no se encuentra ninguno
  })
    .then((updateResult) => {
      if (updateResult) {
        // Se encontró y actualizó un documento
        console.log(`Se actualizó el estudiante: ${updateResult._id}`);
      } else {
        // Se creó un nuevo documento
        console.log("No se encontró un usuario, se ha creado uno nuevo.");
      }
      res.status(200).send(updateResult); // Enviar el resultado actualizado o el nuevo documento
    })
    .catch((err) => {
      console.log("Error while updating the students: ", err);
      res.status(500).send("Error while updating the students");
    });
}
// ### Iteración #11 -->  buscamos por id y eliminamos
function deleteStudentByIdAndDelete(req, res) {
  Student.findByIdAndDelete(req.params.id)
    .then((studentDoc) => {
      if (studentDoc === null) {
        console.log("Usuario no encontrado");
        res.send("Usuario no encontrado");
      } else {
        console.log(`Deleted student with id: ${studentDoc._id}`);
        res.send(studentDoc);
      }
    })
    .catch((err) => {
      console.log("Error while deleting one student: ", err);
      res.send("ERROR", err);
    });
}
// ### Iteración #12 --> buscamos por nombre y eliminamos
function deleteStudents(req, res) {
  Student.deleteMany({ first_name: "Pepe" })
    .then((deletedStudents) => {
      if (deletedStudents.matchedCount === 0) {
        console.log("No hay usuarios con ese nombre");
        return res.status(404).send("No hay usuarios con ese nombre");
      } else {
        console.log(
          `${deletedStudents.matchedCount} estudiantes han sido eliminados.`
        );
      }
    })
    .catch((err) => {
      console.log("Error while updating the students: ", err);
      res.status(500).send("Error while updating the students");
    });
}
// ### Iteración #13 --> Definir validación de datos en el modelo (actualizamos el modelo con validaciones)
function createStudentByPostmanAndValidate(req, res) {
  console.log("REQ.BODY: ", req.body);
  Student.create(req.body)
    .then((studentDoc) => {
      console.log(`Student create worked well: ${studentDoc}`);
      res.send(studentDoc);
    })
    .catch((err) => {
      console.log(`Error creating a new student: ${err.message}`);
      // Envía los detalles del error al cliente
      res.status(400).send({
        message: "Error creating student",
        error: err.message, // Muestra los mensajes de validación de Mongoose
      });
    });
}
// ### Iteración #14 --> Cerrar conexión con base de datos
function closeConcection() {
  mongoose.connection
    .close()
    .then(() => {
      console.log("Connection to the database has been closed successfully.");
    })
    .catch((err) => {
      console.log(`Error closing the connection: ${err.message}`);
    });
}

// Relacionar entidad "student" con "master"
function getStundet(req, res) {
  Student.findById(req.params.id)
    // con .populate("nombreRef") relacionamos el atributo de la entidad, con el "_id" de la otra entidad,
    // lo que provoca que se añade como valor del atributo, el contenido del objeto de la otra entidad
    .populate("masterid")
    .then((studentDoc) => {
      if (studentDoc === null) {
        console.log("Usuario no encontrado");
        res.send("Usuario no encontrado");
      } else {
        console.log(
          `Este usuario está cursando ${studentDoc.masterid.title} de la pomoción ${studentDoc.masterid.promotion}`
        );
        res.send(studentDoc);
      }
    })
    .catch((err) => {
      console.log("Error while getting the student: ", err);
      res.send("ERROR", err);
    });
}

module.exports = {
  createStudent,
  createStudentByPostman,
  createVariosStudents,
  getStundets,
  getStundetsBybirth,
  getStundet,
  getcountStudents,
  getStudentByIdAndUpdate,
  getStudentsByNameAndUpdate,
  getStudentAndUpdate,
  deleteStudentByIdAndDelete,
  deleteStudents,
  createStudentByPostmanAndValidate,
  closeConcection,
};
