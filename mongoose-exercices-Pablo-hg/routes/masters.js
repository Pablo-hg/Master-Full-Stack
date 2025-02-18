const express = require("express");
const router = express.Router();

const masterController = require("../controllers/master");

router.get("/", masterController.getMasters);
router.post("/", masterController.createMasters);

module.exports = router;
