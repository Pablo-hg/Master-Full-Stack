const Application = require("../model/application.model.js");

const createApplication = async (req, res) => {
  try {
    const { id_event, id_user } = req.body;

    // Validación para evitar duplicados de invitación
    const existingApplication = await Application.findOne({
      id_event,
      id_user,
    });
    if (existingApplication) {
      return res
        .status(400)
        .json({ message: "El usuario ya ha sido invitado a este evento" });
    }

    // Crear una nueva solicitud/invitación
    const newApplication = new Application({
      id_solicitud: new mongoose.Types.ObjectId(), // Genera un ID único
      id_event,
      id_user,
      check: "FALSE", // Estado inicial de la invitación
    });

    // Guardar la solicitud en la base de datos
    await newApplication.save();

    // Enviar respuesta de éxito
    res
      .status(201)
      .json({
        message: "Invitación enviada con éxito",
        application: newApplication,
      });
  } catch (error) {
    console.error("Error al crear la solicitud:", error);
    res.status(500).json({ message: "Error al crear la solicitud" });
  }
};
function getApplications(req, res) {
  Application.find()
    .then((applicationDocs) => {
      res.send(applicationDocs);
      // console.log("Dentro de getUsers",applicationDocs);
    })
    .catch((err) => console.log("Error getting users", err));
}

function getApplication(req, res) {
  Application.findById(req.params.id)
    .then((applicationDocs) => {
      if (applicationDocs === null) {
        res.send("No se ha encontrado ningún usuario con este ID");
      }
      console.log("Este usuario está cursando: ", applicationDocs);
      res.send(
        "Este usuario está cursando: " + applicationDocs + " " + applicationDocs
      );
    })
    .catch((err) => console.log("Error while getting the students: ", err));
}

function updateApplication(req, res) {
  Application.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    {
      new: true, //You should set the new option to true to return the document after update was applied.
    }
  )
    .then((updatedApplication) => {
      if (updatedUser === null) res.send("El usuario no existe");
      console.log("Updated users:", updatedApplication);
      res.send(updatedApplication);
    })
    .catch((err) => {
      console.log("Error while updating the users: ", err);
      res.send(err);
    });
}
function updateApplications(req, res) {
  Application.updateMany({ $set: req.body })
    .then((updatedApplication) => {
      console.log("Los usuarios se han modificado", updatedApplication);
      res.send(updatedApplication);
    })
    .catch((err) => {
      console.log("Error", err);
      res.send(err);
    });
}
function deleteApplications(req, res) {
  Application.findByIdAndDelete(req.params.id) // .findByIdAndRemove() works the same as .findByIdAndDelete()
    .then((deletedApplication) => {
      console.log(`Deleted application with id: ${deletedApplication._id}`);
      res.send(deletedApplication);
    })
    .catch((err) => {
      console.log("Error while deleting one user: ", err);
      res.send(err);
    });
}

function deleteApplication(req, res) {
  Application.deleteMany(req.body)
    .then((deleteApplication) => {
      console.log("deleted: ", deleteApplication);
      res.send(deleteApplication);
    })
    .catch((err) => {
      console.log("Error while deleting one user: ", err);
      res.send(err);
    });
}

module.exports = {
  createApplication,
  getApplication,
  deleteApplication,
  deleteApplications,
  updateApplications,
  updateApplication,
  getApplications,
};
