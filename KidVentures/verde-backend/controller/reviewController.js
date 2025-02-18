const mongoose = require("mongoose");
const Review = require("../model/review.model");
const User = require("../model/user.model");
const Event = require("../model/event.model");

// Crear una review
async function createReview(req, res) {
  try {
    console.log("Creando review para el evento:", req.params.eventId);

    const userId = req.user.id; // Extraído del middleware
    const eventId = req.params.eventId; // Extraído de la URL

    // Validar que el evento exista
    const eventDocument = await Event.findById(eventId);
    if (!eventDocument) {
      console.error("Evento no encontrado.");
      return res.status(404).json({ msg: "Evento no encontrado." });
    }

    // Validar que el usuario exista
    const user = await User.findById(userId);
    if (!user) {
      console.error("Usuario no encontrado.");
      return res.status(404).json({ msg: "Usuario no encontrado." });
    }

    const { description, score } = req.body;

    // Crear la nueva review
    const newReview = new Review({
      description,
      score,
      userId,
      eventId,
    });

    await newReview.save();

    // Agregar la referencia de la reseña al evento
    eventDocument.reviews.push(newReview._id);

    // Actualizar el promedio de puntuaciones del evento
    const reviews = await Review.find({ eventId, deletedAt: null }); // Filtrar reseñas no eliminadas
    const averageScore =
      reviews.reduce((sum, review) => sum + review.score, 0) / reviews.length;

    eventDocument.averageScore = averageScore;
    
    
     // Actualizar el contador de reseñas en el evento
     eventDocument.reviewCount += 1; // Incrementar el contador de reseñas
    await eventDocument.save();

    // Agregar la referencia de la reseña al usuario
    user.reviews.push(newReview._id);
    await user.save();

    // Respuesta al cliente
    console.log("Respuesta enviada al cliente:", {
      message: "Review created successfully",
      review: newReview,
      averageScore,
    });

    res.status(201).json({
      message: "Review created successfully",
      review: newReview,
      averageScore,
      reviewCount: eventDocument.reviewCount, 
    });
  } catch (error) {
    console.error("Error al crear la reseña:", error);
    return res.status(500).json({ msg: "Error al crear la reseña." });
  }
}

// Obtener todas las reviews de un usuario específico
async function getUserReviews(req, res) {
  try {
    const { userId } = req.params;
    console.log("ID del usuario recibido:", userId);

    // Asegúrate de que el usuario exista
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    // Obtener las reseñas
    const reviews = await Review.find({ userId, deletedAt: null });
    console.log("Reseñas encontradas:", reviews);

    if (reviews.length === 0) {
      console.warn(
        `No se encontraron reseñas para el usuario con ID: ${userId}`
      );
      return res.status(200).json([]);
    }

    return res.status(200).json({ reviews });
  } catch (error) {
    console.error("Error al obtener las reviews del usuario:", error.message);
    return res.status(500).json({ msg: error.message });
  }
}

// Obtener todas las reviews de un evento específico
async function getEventReviews(req, res) {
  try {
    console.log(
      "Iniciando la consulta de reseñas para el evento:",
      req.params.eventId
    );

    console.log("### Iniciando función getEventReviews ###");
    const { eventId } = req.params;
    console.log("Valor de eventId recibido:", req.params.eventId);
  

    // Verificar si eventId es válido
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      console.warn("ID de evento no válido:", eventId);
      return res.status(400).json({ message: "ID de evento no válido." });
    }

    // Convertir eventId a ObjectId
    const eventIdObject = new mongoose.Types.ObjectId(eventId);

    // Buscar el evento para confirmar que existe
    const event = await Event.findById(eventIdObject);
    if (!event) {
      console.warn("Evento no encontrado para el ID:", eventId);
      return res.status(404).json({ message: "Evento no encontrado." });
    }

    // Validar si event.participants es necesario y no es null
    if (!event.participants) {
      console.warn("El evento no tiene participantes definidos.");
    }

    // Buscar reviews del evento
    const reviews = await Review.find({
      eventId: eventIdObject,
      deletedAt: null,
    });
    console.log(
      "Consulta de reviews completada. Resultados obtenidos:",
      reviews.length
    );

    if (reviews.length === 0) {
      console.warn("No se encontraron reviews para el evento con ID:", eventId);
      return res
        .status(200)
        .json({ message: "Aún no hay reviews para este evento." });
    }

    // Enviar las reviews encontradas
    console.log("Reviews encontradas, enviando respuesta...");
    return res.status(200).json(reviews);
  } catch (error) {
    console.error("Error al obtener reviews del evento:", error.message);
    console.error("Detalles completos del error:", error);
    return res.status(500).json({ message: "Error del servidor." });
  }
}

// Editar una review
async function updateReview(req, res) {
  try {
    const { reviewId } = req.params;
    const { description, score } = req.body;

    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      { description, score, modifiedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!updatedReview) {
      return res.status(404).json({ message: "Review no encontrada." });
    }

    return res.status(200).json({
      message: "Review actualizada exitosamente",
      updatedReview,
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
}

// Eliminar una review (soft delete)
const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    // Buscar la reseña antes de eliminarla
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Reseña no encontrada." });
    }

    // Eliminar la reseña
    await Review.findByIdAndDelete(reviewId);

    // Eliminar la referencia de la reseña del usuario
    await User.findByIdAndUpdate(
      review.userId,
      { $pull: { reviews: reviewId } },
      { new: true }
    );

    res.status(200).json({ message: "Reseña eliminada exitosamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getReviewById = async (req, res) => {
  try {
    console.log("Headers:", req.headers); // Verifica si hay un token de autorización en los headers
    console.log("Params:", req.params);  // Verifica si se pasa correctamente el reviewId

    const { reviewId } = req.params;

    // Buscar la reseña por su ID
    const review = await Review.findById(reviewId);
    console.log("Review encontrada:", review); // Log para depuración

    if (!review) {
      console.error("Reseña no encontrada");
      return res.status(404).json({ message: "Reseña no encontrada." });
    }

    return res.status(200).json(review);
  } catch (error) {
    console.error("Error interno:", error.message); // Log del error
    return res.status(500).json({ message: error.message });
  }
};


module.exports = {
  createReview,
  getUserReviews,
  updateReview,
  deleteReview,
  getEventReviews,
  getReviewById,
};
