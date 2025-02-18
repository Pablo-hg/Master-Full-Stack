const express = require("express");
const {
  loginForm,
  checkEmail,
  getNamesCitiesAndCategories,
  createUser,
} = require("../controller/loginController");

const router = express.Router();

//Rutas
router.post("/check-form", loginForm);
router.post("/check-email", checkEmail);
router.get("/", getNamesCitiesAndCategories);
router.post("/create-user", createUser);

module.exports = router;
