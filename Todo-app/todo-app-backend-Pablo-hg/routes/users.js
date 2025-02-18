const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

router.get("/", userController.getUser);
router.post("/login", userController.postUser);

module.exports = router;
