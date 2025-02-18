const express = require("express");

const {
  getTasksList,
  getTasksInfo,
  putTaskUpdate,
  deleteTask,
  postTask,
  patchTaskMark,
} = require("../controllers/taskController");

const { getUserInfo, postUserLogin } = require("../controllers/userController");

const router = express.Router();

//RUTAS
router.get("/tasks", getTasksList);
// router.get("/tasks/:id", getTasksInfo);
// router.put("/tasks/:id", putTaskUpdate);
// router.delete("/tasks/:id", deleteTask);
// router.post("/tasks/", postTask);
// router.patch("/tasks/:id?", patchTaskMark);

// router.get("/user", getUserInfo);
// router.post("/user/login", postUserLogin);

module.exports = router;
