const express = require("express");
const router = express.Router();
const reviewController = require("../controller/reviewController");

// Crear una nueva review
router.post("/events/:eventId", (req, res, next) => {
  console.log("Solicitud recibida en /reviews/events/:eventId");
  next(); // Esto asegura que pase al controlador real.
}, reviewController.createReview);

// Obtener reviews de un evento
router.get('/events/:eventId', reviewController.getEventReviews); 

// Obtener reviews del usuario
router.get("/:userId", reviewController.getUserReviews); 

// Actualizar una review
router.put("/:reviewId", reviewController.updateReview); 

// Obtener una reseña por ID
router.get("/:reviewId", reviewController.getReviewById);

// Eliminar (soft delete) una review
router.delete("/:reviewId", reviewController.deleteReview); 

module.exports = router;
