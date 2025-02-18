const express = require("express");
const router = express.Router();
const EventController = require("../controller/eventController");

// Ruta para crear un evento (POST)
router.post("/", EventController.createEvent);

// Ruta para obtener la lista de eventos (GET)
router.get("/", EventController.getEvents);

// Ruta para obtener la lista paginada de eventos (GET)
router.get("/eventosPages", EventController.eventosPages);


// Ruta para editar un evento (PUT)
router.put("/:id", EventController.updateEvent);

// Ruta para eliminar un evento (DELETE)
router.delete("/:id", EventController.deleteEvent);

// Ruta para obtener un evento por su Id (GET)
router.get('/:eventId', EventController.getEventById);

//Ruta para obtener eventos de un usuario(GET)
router.get('/user/:userId', EventController.getUserEvents);



module.exports = router;
