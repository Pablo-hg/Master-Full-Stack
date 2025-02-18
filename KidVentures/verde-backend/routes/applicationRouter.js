const express = require("express");
const {createApplication,getApplications,deleteApplications,updateApplication,deleteApplication,getApplication} = require ("../controller/applicationController");
const router = express.Router();

//Rutas
//User
router.post("/",createApplication);
router.delete("/",deleteApplications);
router.put("/application/:id",updateApplication);
router.delete("/application/:id",deleteApplication);
router.get("/",getApplications);
router.get("/application/:id",getApplication);



module.exports = router;