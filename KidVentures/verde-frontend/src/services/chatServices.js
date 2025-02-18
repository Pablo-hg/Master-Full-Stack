import api from './api'; 

export const getChats = async () => {
    const token = localStorage.getItem("token");
  
    try {
      const response = await api.get(`/chats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      console.log("Respuesta del backend:", response.data); // Debug de la respuesta
      return response.data;
    } catch (error) {
      console.error("Error en getEventReviews:", error.response || error.message); // Debug del error
      throw error; // Volver a lanzar el error para manejarlo en el frontend
    }
};


export const getMessagesByChat = async (chat_id) => {
  const token = localStorage.getItem("token");

  try {
    const response = await api.get(`/chats/messages/${chat_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data && response.data.length === 0) {
      // No hay mensajes, pero no arrojar error, solo informar.
      console.log("No hay mensajes en este chat.");
      return []; // Puedes devolver un array vacío o un mensaje específico si prefieres
    }

    console.log("Respuesta del backend:", response.data); // Debug de la respuesta
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      
      console.error("No se encontraron mensajes para este chat.");
      return []; // Devolver un array vacío en lugar de propagar el error 404
    }

    console.error("Error en getMessagesByChat:", error.response || error.message); // Debug del error
    throw error; // Re-lanzar el error para manejarlo en el frontend
  }
};
