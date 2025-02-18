const express = require("express");
const {
  createCity,
  getCities,
  getCity,
  deleteCities,
  updateCity,
  deleteCity,
 
} = require("../controller/cityController");
const router = express.Router();

//Rutas
//User
router.post("/", createCity);
router.delete("/", deleteCities);
router.put("/city/:id", updateCity);
router.delete("/city/:id", deleteCity);
router.get("/", getCities);
router.get("/city/:id", getCity);



module.exports = router;
