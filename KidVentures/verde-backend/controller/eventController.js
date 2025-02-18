const mongoose = require("mongoose");
const Event = require("../model/event.model");
const User = require("../model/user.model");
const Category = require("../model/category.model");
const Review = require("../model/review.model");
const chatModel = require("../model/chat.model");

// Crear un evento (POST)
async function createEvent(req, res) {
  try {
    const userId = req.user.id;

    const {
      name,
      description,
      category,
      is_unique_date,
      dates,
      recurrence,
      startTime,
      endTime,
      city,
      coordinates,
      ubication,
      managers = [],
      participants = [],
      event_type,
      participants_limit,
      age_range,
      price,
      applications,
      photos,
    } = req.body;

    // Validaciones iniciales
    if (!name || !dates || !dates.length) {
      return res
        .status(400)
        .json({ msg: "El nombre y al menos una fecha son obligatorios." });
    }

    // Combinar managers y añadir al creador
    const eventManagers = [...new Set([userId, ...(managers || [])])];

    // Validar y filtrar participantes
    const validParticipants = await User.find({
      _id: { $in: participants },
    });

    if (validParticipants.length !== participants.length) {
      return res
        .status(400)
        .json({ msg: "Algunos participantes no son válidos." });
    }

    // Convertir y validar parsedParticipantsLimit y parsedPrice
    const parsedParticipantsLimit = parseInt(participants_limit, 10);
    const parsedPrice = parseFloat(price);

    if (isNaN(parsedParticipantsLimit) || parsedParticipantsLimit < 0) {
      return res
        .status(400)
        .json({ msg: "El límite de participantes debe ser un número válido." });
    }

    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return res
        .status(400)
        .json({ msg: "El precio debe ser un número válido." });
    }

    // Manejar recurrencia (opcional)
    const recurrenceDetails = recurrence
      ? {
          frequency: recurrence.frequency,
          interval: recurrence.interval || 1,
          endDate: recurrence.endDate || null,
        }
      : null;

    console.log("Cuerpo del evento:", req.body);
    // Crear el evento
    const newEvent = new Event({
      name,
      description,
      category,
      dates,
      recurrence: recurrenceDetails,
      startTime,
      endTime,
      city,
      coordinates,
      ubication,
      managers: eventManagers,
      participants: validParticipants.map((user) => user._id),
      event_type,
      participants_limit: parsedParticipantsLimit,
      age_range,
      price: parsedPrice,
      applications,
      photos,
    });

    const savedEvent = await newEvent.save();

    // Crear el chat asociado al evento
    const newChat = new chatModel({
      event: savedEvent._id, // Asocia el ID del evento recién creado
      participants: validParticipants.map((user) => user._id), // Participantes del evento
    });

    // Guarda el chat en la base de datos
    await newChat.save();

    return res.status(201).json(newEvent);
  } catch (error) {
    if (error.name === "ValidationError") {
      // Mensajes de error de validación
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ msg: "Validation error", errors });
    }
    return res.status(500).json({ msg: error.message });
  }
}

// Obtener la lista de eventos (GET)
async function getEvents(req, res) {
  try {
    console.log("Iniciando la búsqueda de eventos no eliminados...");
    // Busca eventos no eliminados
    const events = await Event.find({ deletedAt: null }).lean();
    console.log(`Eventos encontrados: ${events.length} evento(s)`);
    // Verifica si hay eventos
    if (!events || events.length === 0) {
      console.warn("No se encontraron eventos en la base de datos.");
      return res.status(200).json([]);
    }

    // Preparar los IDs únicos de managers y participantes para una consulta eficiente
    const managerIds = new Set();
    const participantIds = new Set();

    events.forEach((event) => {
      // Validar y añadir managers
      event.managers.forEach((id) => {
        if (id) managerIds.add(id.toString());
      });

      // Validar y añadir participantes
      event.participants?.forEach((participant) => {
        if (participant?.userId) {
          participantIds.add(participant.userId.toString());
        }
      });
    });

    // Consultar los usuarios asociados (managers y participantes)
    const userIds = Array.from(new Set([...managerIds, ...participantIds]));
    const users = await User.find({ _id: { $in: userIds } })
      .select("name email role")
      .lean();

    // Crear un mapa de usuarios para un acceso rápido
    const userMap = new Map(users.map((user) => [user._id.toString(), user]));

    // Obtener todas las reseñas agrupadas por evento
    const reviews = await Review.aggregate([
      { $match: { deletedAt: null } },
      {
        $group: {
          _id: "$eventId",
          averageScore: { $avg: "$score" },
        },
      },
    ]);

    // Crear un map para las medias de puntuación 
    const reviewMap = new Map(
      reviews.map((review) => [
        review._id.toString(),
        {
          averageScore: review.averageScore || 0,
        
        },
      ])
    );

    // Mapea y procesa cada evento
    const formattedEvents = events.map((event) => {
      const managers = event.managers
        ?.map((id) => userMap.get(id.toString()))
        .filter(Boolean); // Filtrar managers válidos

      const participants = event.participants
        ?.map((participant) => {
          if (!participant?.userId) {
            // console.warn(
            //   `Participante inválido en evento ${event._id}:`,
            //   participant
            // );
            return null; // Ignorar participantes inválidos
          }

          const user = userMap.get(participant.userId.toString());
          return user
            ? { name: user.name, email: user.email, role: user.role }
            : { id: participant.userId, error: "Usuario no encontrado" };
        })
        .filter(Boolean); // Filtrar participantes válidos

      const reviewData = reviewMap.get(event._id.toString()) || {
        averageScore: 0,
        reviewCount: 0,
      };

      // Retornar el evento formateado
      return {
        _id: event._id,
        name: event.name,
        description: event.description,
        category: event.category,
        is_unique_date: event.is_unique_date,
        dates: event.dates,
        recurrence: event.recurrence,
        startTime: event.startTime,
        endTime: event.endTime,
        city: event.city,
        coordinates: event.coordinates,
        ubication: event.ubication,
        managers: managers || [],
        participants: participants || [],
        event_type: event.event_type,
        participants_limit: event.participants_limit,
        age_range: event.age_range,
        price: event.price,
        applications: event.applications,
        photos: event.photos || [],
        createdAt: event.createdAt,
        updatedAt: event.updatedAt,
        averageScore:  `${reviewData.averageScore.toFixed(1)}/5`, 
       
      };
    });

    console.log("Todos los eventos procesados correctamente.");
    return res.status(200).json(formattedEvents);
  } catch (error) {
    console.error("Error en el servidor al obtener eventos:", error.message);
    return res.status(500).json({
      msg: "Error interno al obtener eventos",
      details: error.message,
    });
  }
}

// Editar un evento (UPDATE)
async function updateEvent(req, res) {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ msg: "Body cannot be empty" });
    }

    const cleanBody = { ...req.body };

    if (Array.isArray(req.body.managers)) {
      cleanBody.managers = req.body.managers.map((manager) => manager.id);
    }

    // Verificar que recurrence esté presente y sea un objeto
    if (cleanBody.recurrence && typeof cleanBody.recurrence !== "object") {
      if (
        cleanBody.recurrence.frequency &&
        !["weekly", "monthly", "yearly"].includes(
          cleanBody.recurrence.frequency
        )
      ) {
        return res.status(400).json({
          msg: "El valor de 'frequency' no es válido. Debe ser 'weekly', 'monthly', o 'yearly'",
        });
      }

      return res
        .status(400)
        .json({ msg: "El campo 'recurrence' debe ser un objeto válido." });
    }

    // 2. Participants: Extraer solo el userId y asignar status por defecto si no existe
    if (Array.isArray(req.body.participants)) {
      cleanBody.participants = req.body.participants.map(
        (participant) => participant.id
      );
    }

    // 3. Eliminar campos no actualizables
    delete cleanBody._id;
    delete cleanBody.createdAt;
    delete cleanBody.updatedAt;
    delete cleanBody.__v;

    // 4. Validación de category
    if (!cleanBody.category) {
      return res.status(400).json({ msg: "Category is required" });
    }

   

    console.log("Request Body:", cleanBody);
    


    const event = await Event.findOne({ _id: req.params.id, deletedAt: null });
    if (!event) return res.status(404).json({ msg: "Event not found" });
    
    

    // Actualizar el evento con otros campos
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: cleanBody, modifiedAt: new Date() },
      { new: true, runValidators: false }
    );

    if (!updatedEvent) {
      return res.status(404).json({ msg: "Event not found" });
    }

    return res.status(200).json(updatedEvent);
  } catch (error) {
    if (error.name === "ValidationError") {
      // Mensajes de error de validación
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ msg: "Validation error", errors });
    }
    return res.status(500).json({ msg: error.message });
  }
}

// Eliminar un evento (DELETE)
async function deleteEvent(req, res) {
  try {
    const event = await Event.findOne({ _id: req.params.id, deletedAt: null });
    if (!event) return res.status(404).json({ msg: "Event not found" });

    // Buscar los chats asociados al evento
    const chats = await chatModel.find({ event: req.params.id });

    // Recopilar los IDs de los chats
    const chatIds = chats.map((chat) => chat._id);

    // Eliminar los mensajes asociados a los chats
    await messageModel.deleteMany({ chat: { $in: chatIds } });

    // Eliminar los chats asociados al evento
    await chatModel.deleteMany({ event: req.params.id });

    await Event.findByIdAndUpdate(
      req.params.id,
      { $set: { deletedAt: new Date() } }, // Marcar como eliminado actualizando el campo deletedAt
      { new: true }
    );

    return res.status(200).json({ msg: "Event successfully deleted" });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
}

// Obtener eventos creados o asociados a un usuario
async function getUserEvents(req, res) {
  try {
    const userId = req.params.userId; // ID del usuario desde los parámetros de la URL
    if (!userId) {
      console.warn("userId no proporcionado");
      return res.status(400).json({ msg: "El ID de usuario es requerido." });
    }
    console.log(`Buscando eventos asociados al usuario con ID: ${userId}...`);

    // Buscar eventos donde el usuario es manager o participante
    const events = await Event.find({
      $or: [
        { managers: userId }, // Eventos donde el usuario es manager
        { participants: userId }, // Eventos donde el usuario es participante
      ],
      deletedAt: null, // Excluir eventos eliminados
    });

    console.log("Consulta enviada a MongoDB:", {
      $or: [{ managers: userId }, { "participants.userId": userId }],
      deletedAt: null,
    });

    // Verificar si se encontraron eventos
    if (!events || events.length === 0) {
      console.warn(
        `No se encontraron eventos asociados al usuario con ID: ${userId}`
      );
      return res.status(200).json([]);
    }

    console.log(`Eventos encontrados: ${events.length} evento(s)`);

    // Procesar y formatear eventos
    const formattedEvents = [];
    for (const event of events) {
      try {
        console.log(`Procesando evento: ${event.name} (ID: ${event._id})`);

        // Obtener detalles de managers
        const managers = [];
        for (const managerId of event.managers) {
          const manager = await User.findById(managerId).select("name email");
          if (manager) {
            managers.push({ name: manager.name, email: manager.email });
          }
        }

        // Obtener detalles de participantes
        const participants = [];
        for (const participant of event.participants) {
          const user = await User.findById(participant.userId).select(
            "name email"
          );
          if (user) {
            participants.push({
              name: user.name,
              email: user.email,
              role: participant.role,
            });
          }
        }

        // Formatear evento
        formattedEvents.push({
          _id: event._id,
          name: event.name,
          description: event.description,
          category: event.category,
          is_unique_date: event.is_unique_date,
          dates: event.dates,
          recurrence: event.recurrence,
          startTime: event.startTime,
          endTime: event.endTime,
          city: event.city,
          coordinates: event.coordinates,
          ubication: event.ubication,
          managers,
          participants,
          event_type: event.event_type,
          participants_limit: event.participants_limit,
          age_range: event.age_range,
          price: event.price,
          applications: event.applications,
          photos: event.photos || [], // Siempre incluye un array de fotos
          createdAt: event.createdAt,
          updatedAt: event.updatedAt,
        });
      } catch (innerError) {
        console.error(
          `Error al procesar el evento ${event.name} (ID: ${event._id}):`,
          innerError.message
        );
        continue; // Ignorar errores en eventos individuales
      }
    }

    console.log("Todos los eventos procesados correctamente.");
    res.status(200).json(formattedEvents);
  } catch (error) {
    console.error(
      "Error al obtener eventos creados por el usuario:",
      error.message
    );
    res.status(500).json({ msg: "Error al obtener eventos del usuario" });
  }
}

// Obtener un evento por el ID del evento(GET)
function getEventById(req, res) {
  const { eventId } = req.params;
  Event.findById(eventId)
    .then((eventDoc) => {
      if (eventDoc === null) {
        return res
          .status(404)
          .send("No se ha encontrado ningún evento con este ID");
      }
      console.log("evento encontrado");

      //const participantIds = eventDoc.participants.map((p) => p.userId);
      const participantIds = eventDoc.participants;
      const managerIds = eventDoc.managers;
      const categoryName = eventDoc.category;

      //$in: Es un operador de MongoDB que significa "está en".
      Promise.all([
        User.find({ _id: { $in: participantIds } }),
        User.find({ _id: { $in: managerIds } }),
        Category.findOne({ name: categoryName }),
      ])
        .then(([participantsDocs, managersDocs, categoryDoc]) => {
          // Mapear los participantes (ID y nombre)
          const participantDetails = participantsDocs.map((user) => ({
            id: user._id,
            name: user.name,
          }));
          // Mapear los managers (ID y nombre)
          const managerDetails = managersDocs.map((user) => ({
            id: user._id,
            name: user.name,
          }));
          // Crear la respuesta con los datos actualizados
          const eventWithDetails = {
            ...eventDoc.toObject(),
            participants: participantDetails,
            managers: managerDetails,
            category: categoryDoc
              ? { id: categoryDoc._id, name: categoryDoc.name }
              : null,
          };
          res.json(eventWithDetails);
        })
        .catch((err) => {
          console.error("Error al obtener participantes y managers: ", err);
          res
            .status(500)
            .send("Error al obtener detalles de participantes y managers.");
        });
    })
    .catch((err) =>
      console.log("Error al obtener los datos del evento: ", err)
    );
}












// Obtener la lista de eventos para scroll infinito (GET)
async function eventosPages(req, res) {
  try {
    console.log("Iniciando la búsqueda de eventos con paginacion...");

    // Recuperar los parámetros de paginación
    const page = parseInt(req.query.page) || 1; // Página actual, por defecto 1
    const limit = parseInt(req.query.limit) || 20; // Número de eventos por página, por defecto 20

    // Calcular el número de saltos a aplicar a la consulta (skip)
    const skip = (page - 1) * limit;

    // Busca eventos no eliminados
    const events = await Event.find({ deletedAt: null })
      .skip(skip)
      .limit(limit)
      .lean();

    console.log(`Eventos encontrados: ${events.length} evento(s)`);

    // Verifica si hay eventos
    if (!events || events.length === 0) {
      console.warn("No se encontraron eventos en la base de datos.");
      return res
        .status(404)
        .json({ msg: "No se encontraron eventos disponibles" });
    }

    // Contar el total de eventos disponibles (para saber cuántos hay en total)
    const totalEvents = await Event.countDocuments({ deletedAt: null });

    // Preparar los IDs únicos de managers y participantes para una consulta eficiente
    const managerIds = new Set();
    const participantIds = new Set();

    events.forEach((event) => {
      // Validar y añadir managers
      event.managers.forEach((id) => {
        if (id) managerIds.add(id.toString());
      });

      // Validar y añadir participantes
      event.participants?.forEach((participant) => {
        if (participant?.userId) {
          participantIds.add(participant.userId.toString());
        }
      });
    });

    // Consultar los usuarios asociados (managers y participantes)
    const userIds = Array.from(new Set([...managerIds, ...participantIds]));
    const users = await User.find({ _id: { $in: userIds } })
      .select("name email role")
      .lean();

    // Crear un mapa de usuarios para un acceso rápido
    const userMap = new Map(users.map((user) => [user._id.toString(), user]));

    // Obtener todas las reseñas agrupadas por evento
    const reviews = await Review.aggregate([
      { $match: { deletedAt: null } },
      {
        $group: {
          _id: "$eventId",
          averageScore: { $avg: "$score" },
        },
      },
    ]);

    // Crear un mapa para las medias de puntuación
    const reviewMap = new Map(
      reviews.map((review) => [review._id.toString(), review.averageScore])
    );

    // Mapea y procesa cada evento
    const formattedEvents = events.map((event) => {
      const managers = event.managers
        ?.map((id) => userMap.get(id.toString()))
        .filter(Boolean); // Filtrar managers válidos

      const participants = event.participants
        ?.map((participant) => {
          if (!participant?.userId) {
            // console.warn(
            //   `Participante inválido en evento ${event._id}:`,
            //   participant
            // );
            return null; // Ignorar participantes inválidos
          }

          const user = userMap.get(participant.userId.toString());
          return user
            ? { name: user.name, email: user.email, role: user.role }
            : { id: participant.userId, error: "Usuario no encontrado" };
        })
        .filter(Boolean); // Filtrar participantes válidos

      const averageScore = reviewMap.get(event._id.toString()) || 0;

      // Retornar el evento formateado
      return {
        _id: event._id,
        name: event.name,
        description: event.description,
        category: event.category,
        is_unique_date: event.is_unique_date,
        dates: event.dates,
        recurrence: event.recurrence,
        startTime: event.startTime,
        endTime: event.endTime,
        city: event.city,
        coordinates: event.coordinates,
        ubication: event.ubication,
        managers: managers || [],
        participants: participants || [],
        event_type: event.event_type,
        participants_limit: event.participants_limit,
        age_range: event.age_range,
        price: event.price,
        applications: event.applications,
        photos: event.photos || [],
        createdAt: event.createdAt,
        updatedAt: event.updatedAt,
        averageScore: `${averageScore.toFixed(1)}/5`,
      };
    });

    console.log("Todos los eventos procesados correctamente.");
    return res.status(200).json({
      events: formattedEvents, // Los eventos de la página solicitada
      totalEvents, // El total de eventos disponibles
      totalPages: Math.ceil(totalEvents / limit), // Total de páginas disponibles
      currentPage: page, // Página actual
    });
  } catch (error) {
    console.error("Error en el servidor al obtener eventos:", error.message);
    return res.status(500).json({
      msg: "Error interno al obtener eventos",
      details: error.message,
    });
  }
}

module.exports = {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent,
  getUserEvents,
  getEventById,
  eventosPages,
};
