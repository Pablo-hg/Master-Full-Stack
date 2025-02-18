// importamos el modelo
const Master = require("../models/master.model");

function getMasters(req, res) {
  Master.find()
    .then((masterDocs) => {
      console.log("Listado de masters: ", masterDocs);
      res.send(masterDocs);
    })
    .catch((err) => console.log("Error: ", err));
}

function createMasters(req, res) {
  console.log("REQ.BODY: ", req.body);
  Master.create(req.body)
    .then((masterDoc) => {
      console.log(`Master creado : ${masterDoc}`);
      res.send(masterDoc);
    })
    .catch((err) => console.log(`Error al crear el Master:  ${err}`));
}

module.exports = { getMasters, createMasters };
