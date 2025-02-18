const express = require("express");
const router = express.Router();
const ChatController = require("../controller/chatController");

// Ruta para obtener la lista de eventos y chats (GET)
router.get("/", ChatController.getChats);

// Ruta obtener lista de los mensajes por idchat
router.get("/messages/:chatId", ChatController.getMessagesByChat);


module.exports = router;