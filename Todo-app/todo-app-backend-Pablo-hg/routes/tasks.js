const express = require("express");
const router = express.Router();

const taskController = require("../controllers/taskController");

router.post("/", taskController.createTask);
router.get("/", taskController.listTask);
router.put("/:id", taskController.UpdateTask);

module.exports = router;
