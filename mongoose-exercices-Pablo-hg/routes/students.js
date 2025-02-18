const express = require("express");
const router = express.Router();

const studentController = require("../controllers/student");

router.post("/", studentController.createStudent);
// router.post("/postman", studentController.createStudentByPostman);
router.post("/postman", studentController.createStudentByPostmanAndValidate);
router.post("/varios", studentController.createVariosStudents);
router.get("/", studentController.getStundets);
router.get("/birth", studentController.getStundetsBybirth);
router.get("/:id", studentController.getStundet);
// router.get("/count", studentController.getcountStudents);
// router.get("/:id", studentController.getStudentByIdAndUpdate);
// router.get("/updates", studentController.getStudentsByNameAndUpdate);
// router.get("/find", studentController.getStudentAndUpdate);
// router.delete("/:id", studentController.deleteStudentByIdAndDelete);
router.delete("/borrar", studentController.deleteStudents);
router.get("/cerrar", studentController.closeConcection);

module.exports = router;
