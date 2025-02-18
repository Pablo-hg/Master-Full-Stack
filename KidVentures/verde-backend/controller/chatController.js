const mongoose = require("mongoose");
const chatModel = require("../model/chat.model");
const User = require("../model/user.model");
const messageModel = require("../model/message.model");

async function getChats(req, res) {
    try {
        // Si el usuario autenticado está disponible
        const userId = req.user?.id;
        console.log('usuario',userId);
        if (!userId) {
          return res.status(401).json({ message: "Usuario no autenticado" });
        }
        
        if (!userId) {
          return res.status(401).json({ message: "Usuario no autenticado" });
        }
  
        // Buscar chats en los que el usuario sea participante
        const chats = await chatModel.find({ "participants": userId })
        .populate("event", "name") // Obtén información del evento relacionado
        .exec();
        console.log(chatModel.populate)

        if (!chats.length) {
            return res.status(404).json({ message: "No se encontraron chats" });
        }

        // Extraer todos los IDs de los participantes en los chats
        const participantIds = [...new Set(chats.flatMap((chat) => chat.participants))];

        // Obtener los detalles de los participantes
        const participantsDocs = await User.find({ _id: { $in: participantIds } });

         // Mapear los detalles de los participantes (ID y nombre)
        const participantDetails = participantsDocs.map((user) => ({
            id: user._id,
            name: user.name,
        }));


        const chatsWithDetails = chats.map((chat) => ({
            _id: chat._id,
            event: chat.event ? chat.event.name : null,
            participants: chat.participants.map((participantId) =>
              participantDetails.find((p) => p.id.equals(participantId))
            ),
        }));
    
        return res.status(200).json({ chatsWithDetails });

      } catch (error) {
        console.error("Error al obtener los chats:", error);
        return res.status(500).json({ message: "Error del servidor", error });
      }
}

async function SaveChats(data) {
  try {
     // Validar datos
     if (!data.chatId || !data.sender || !data.content) {
      throw new Error("Faltan datos necesarios para guardar el mensaje.");
    }

    // Log inicial para saber qué datos llegan a la función
    console.log("Datos recibidos en SaveChats:", data);

    // Crear y guardar el mensaje en la base de datos
    const newMessage = new messageModel({
      chat: data.chatId,
      sender: data.sender,
      content: data.content,
    });

    // Log del mensaje antes de guardarlo
    console.log("Mensaje a guardar:", newMessage);

    await newMessage.save();

    // Log para confirmar que el mensaje se ha guardado
    console.log("Mensaje guardado en la base de datos:", newMessage);

    // Buscar información del usuario
    const userdata = await User.findOne({ _id: data.sender });

    // Log del resultado de la búsqueda del usuario
    console.log("Usuario encontrado:", userdata);

    // Si el usuario no existe, añade un log
    if (!userdata) {
      console.error(`Usuario con ID ${data.sender} no encontrado.`);
      throw new Error(`Usuario con ID ${data.sender} no encontrado.`);
    }

    // Actualizar el sender con el nombre del usuario
    data.sender = userdata.name;

    // Log final con los datos procesados
    console.log("Datos finales para devolver:", data);

    return { ...data, _id: "fake_id", createdAt: new Date() };
  } catch (error) {
    // Log de cualquier error que ocurra
    console.error("Error en SaveChats:", error.message);
    throw error; // Re-lanzar el error para manejarlo en la capa superior
  }
}


async function getMessagesByChat (req, res) {
  const chatId = req.params.chatId;
    console.log('entro a getMessagesByChat');
    
    try {
        
        console.log('Chat ID recibido:', chatId); 

        const messages = await messageModel.find({ 'chat': chatId }).exec();
        console.log('Mensajes encontrados:', messages); 

        if (!messages || messages.length === 0) {
          return res.status(404).json({ message: "No se encontraron mensajes" });
        }

        const senderIds = [...new Set(messages.flatMap((message) => message.sender))];
        console.log('IDs de los remitentes:', senderIds); 

        // Obtener los detalles de los participantes
        const usersDocs = await User.find({ _id: { $in: senderIds } });
        console.log('Detalles de los usuarios:', usersDocs);
        

        // Mapear los detalles de los participantes (ID y nombre)
        const usersDetails = usersDocs.map((user) => ({
            id: user._id.toString(),
            name: user.name,
        }));

        const messagesWithDetails = messages.map((message) => {
            const senderDetail = usersDetails.find(
              (user) => user.id === message.sender.toString()
            );
            return {
              _id: message._id,
              chat: message.chat,
              sender: senderDetail ? senderDetail.name : "Desconocido",
              content: message.content,
              createdAt: message.createdAt,
            };
          });
          console.log('Mensajes con detalles:', messagesWithDetails);
      return res.status(200).json({ data:messagesWithDetails });
    } catch (error) {
      console.error("Error al obtener mensajes:", error);
      return res.status(500).json({ message: "Error al obtener mensajes", error });
    }
};


module.exports = {
    getChats,
    SaveChats,
    getMessagesByChat,
  };