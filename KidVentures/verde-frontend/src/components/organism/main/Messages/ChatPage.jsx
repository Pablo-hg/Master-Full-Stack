import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { getChats, getMessagesByChat } from "../../../../services/chatServices";
import { MainMenu } from "../../../molecule/MainMenu";

// Conecta con el backend
const socket = io("http://127.0.0.1:300", {
  transports: ["websocket"], // Forzar el uso de WebSockets
});

const ChatPage = () => {
  const [selectedChat, setSelectedChat] = useState(null); // Chat seleccionado
  const [message, setMessage] = useState(""); // Nuevo mensaje
  const [messages, setMessages] = useState([]); // Mensajes en el chat actual
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await getChats();
        setChats(response.chatsWithDetails || []);
      } catch (error) {
        console.error("Error al cargar chats:", error.message);
        setChats([]);
      }
    };

    fetchChats();

    // Escuchar mensajes del servidor
    socket.on("message", (newMessage) => {
      if (newMessage.chatId === selectedChat?._id) {
        setMessages((prev) => [...prev, newMessage]);
        console.log(newMessage.chatId);
      }
    });

    return () => {
      socket.off("message"); // Desconectar el listener
    };
  }, [selectedChat]);

  useEffect(() => {
    
    const fetchMessages = async () => {
      if (!selectedChat) {
        setMessages([]); // Limpiar mensajes si no hay chat seleccionado
        return;
      }

      try {
        const response = await getMessagesByChat(selectedChat._id); // Obtener mensajes del chat actual
        setMessages(response.data || []);
      } catch (error) {
        console.error("Error al cargar mensajes:", error.message);
        setMessages([]);
      }
    };

    fetchMessages();
  }, [selectedChat]);

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.error("El usuario no está autenticado.");
        return;
      }
  
      // Crea un nuevo mensaje con los datos requeridos
      const newMessage = { sender: userId, 
        content: message, chatId: selectedChat?._id };
        console.log("Mensaje que se enviará al servidor:", newMessage); 
      // Emitir el mensaje al servidor
      socket.emit("message", newMessage); 

       // Limpiar el campo del mensaje
      setMessage(""); // Limpiar el input
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen p-4 pb-20 bg-gray-100">
      <h1 className="text-2xl font-bold text-gray-800 mb-10">Chats</h1>
  
      {selectedChat ? (
        <div className="flex flex-col flex-grow">
          <button
            onClick={() => setSelectedChat(null)}
            className="btn btn-back bg-blue-500 text-white px-4 py-2 rounded-2xl shadow-md hover:bg-blue-600 self-start"
          >
            Volver a lista de chats
          </button>
          <div className="mt-4">
            <h2 className="text-xl font-semibold text-gray-700">{selectedChat.name}</h2>
            <p className="text-sm text-gray-500">
              Participantes: {selectedChat.participants.map((p) => p.name).join(", ")}
            </p>
          </div>
  
          {/* Mensajes */}
          <div className="flex-grow mt-4 border p-4 overflow-y-scroll bg-white rounded-2xl shadow-md">
            {messages.map((msg, index) => (
              <div key={index} className="mb-2">
                <strong className="text-blue-600">{msg.sender}:</strong>{" "}
                <span className="text-gray-700">{msg.content}</span>
              </div>
            ))}
          </div>
  
          {/* Enviar mensaje */}
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Escribe tu mensaje..."
              className="flex-grow border rounded-2xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-500 text-white px-4 py-2 rounded-2xl shadow-md hover:bg-blue-600"
            >
              Enviar
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col flex-grow gap-4 overflow-y-auto">
          {chats.map((chat) => (
            <div
              key={chat._id}
              className="p-4 border bg-white rounded-2xl shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-300"
              onClick={() => setSelectedChat(chat)}
            >
              <p className="text-lg font-semibold text-gray-800">{chat.event}</p>
            </div>
          ))}
        </div>
      )}
  
      <MainMenu />
    </div>
  );
  
};

export default ChatPage;