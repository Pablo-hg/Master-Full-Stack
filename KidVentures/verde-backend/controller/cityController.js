const City = require("../model/city.model.js");

function createCity(req, res) {
  City.create(req.body)
    .then((citiesDocs) => {
      console.log(`User create worked well: ${citiesDocs}`);
      res.send(citiesDocs);
    })
    .catch((err) => {
      console.log(`Creating a new user went wrong! Try again 😞 ${err}`);
    });
}

function getCities(req, res) {
  City.find()
    .then((citiesDocs) => {
      res.send(citiesDocs);
      // console.log("Listado ciudades", citiesDocs);
      console.log("ciudades enviadas");
    })
    .catch((err) => console.log("Error getting users", err));
}

function getCity(req, res) {
  City.findById(req.params.id)
    .then((citiesDocs) => {
      if (citiesDocs === null) {
        res.send("No se ha encontrado ningún usuario con este ID");
      }
      console.log("Este usuario está cursando: ", citiesDocs);
      res.send("Este usuario está cursando: " + citiesDocs + " " + citiesDocs);
    })
    .catch((err) => console.log("Error while getting the students: ", err));
}

function updateCity(req, res) {
  City.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    {
      new: true, //You should set the new option to true to return the document after update was applied.
    }
  )
    .then((updatedCity) => {
      if (updatedCity === null) res.send("El usuario no existe");
      console.log("Updated users:", updatedCity);
      res.send(updatedCity);
    })
    .catch((err) => {
      console.log("Error while updating the users: ", err);
      res.send(err);
    });
}
function updateCities(req, res) {
  City.updateMany({ $set: req.body })
    .then((updatedCity) => {
      console.log("Los usuarios se han modificado", updatedCity);
      res.send(updatedCity);
    })
    .catch((err) => {
      console.log("Error", err);
      res.send(err);
    });
}
function deleteCities(req, res) {
  City.findByIdAndDelete(req.params.id) // .findByIdAndRemove() works the same as .findByIdAndDelete()
    .then((deleteCities) => {
      console.log(`Deleted application with id: ${deleteCities._id}`);
      res.send(deleteCities);
    })
    .catch((err) => {
      console.log("Error while deleting one user: ", err);
      res.send(err);
    });
}

function deleteCity(req, res) {
  City.deleteMany(req.body)
    .then((deleteCity) => {
      console.log("deleted: ", deleteCity);
      res.send(deleteCity);
    })
    .catch((err) => {
      console.log("Error while deleting one user: ", err);
      res.send(err);
    });
}

module.exports = {
  createCity,
  getCity,
  deleteCity,
  deleteCities,
  updateCities,
  updateCity,
  getCities,
};
