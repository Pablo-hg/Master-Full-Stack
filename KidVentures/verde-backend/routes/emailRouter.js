const express = require("express");
const { confirmUser, sendEmailAlta } = require("../controller/emailController");
const router = express.Router();

router.post("/confirm-user", confirmUser);
router.post("/alta", sendEmailAlta);

module.exports = router;
