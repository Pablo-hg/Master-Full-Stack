import api from './api'; 

export const getEventReviews = async (eventId) => {
  const token = localStorage.getItem("token");
  

  // Validar que el token existe
  if (!token) {
    console.error("Token no encontrado. Asegúrate de que el usuario está autenticado.");
    throw new Error("No se puede autenticar la solicitud. Token no encontrado.");
  }

   // Validar que el eventId es válido
   if (!eventId || typeof eventId !== "string") {
    console.error("El eventId no es válido:", eventId);
    throw new Error("El ID del evento no es válido.");
  }

  console.log("Token enviado:", token); // Debug del token
  console.log("URL construida:", `/reviews/events/${eventId}`); // Debug de la URL

  try {
    const response = await api.get(`/reviews/events/${eventId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Respuesta del backend:", response.data); // Debug de la respuesta
    return response.data; // Retornar los datos
  } catch (error) {
    if (error.response) {
      // Errores específicos del backend
      console.error("Error del backend:", error.response.data.message || error.response.statusText);

      if (error.response.status === 401) {
        console.error("Token no autorizado o vencido.");
      }
    } else if (error.request) {
      // Problemas con la solicitud, pero sin respuesta del backend
      console.error("No se recibió respuesta del backend:", error.request);
    } else {
      // Otros errores (como errores de configuración)
      console.error("Error en la configuración de la solicitud:", error.message);
    }

    // Re-lanzar el error para manejarlo donde sea necesario
    throw error;
  }
};



  export const postReview = async (reviewData, eventId) => {
    const token = localStorage.getItem("token"); // Recuperar el token almacenado
    if (!token) {
      throw new Error("No hay token disponible. El usuario no está autenticado.");
    }
    console.log("esta es la url:",`URL: /reviews/events/${eventId}`);
    console.log("eventId recibido en el servicio postReview:", eventId);
 
    console.log("Datos enviados al servidor:", reviewData);

    const { data } = await api.post(`/reviews/events/${eventId}`, reviewData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  };
  
  
  export const getUserReviews = async (userId) => {
    if (!userId) throw new Error("Se requiere el ID del usuario");
    

    const token = localStorage.getItem("token");
    console.log("Token en la cabecera:", token); 
    console.log("ID del usuario autenticado:", userId);
  
    try {
      
      const response = await api.get(`/reviews/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token si la API lo requiere
        },
      });
       
      // Devuelve directamente el array de reviews, aunque esté vacío
      return Array.isArray(response.data.reviews) ? response.data.reviews : [];
    } catch (error) {
      console.error("Error al obtener las reviews del usuario:", error.message);
  
      // Si es un error distinto de 404, lánzalo
      if (error.response?.status !== 404) {
        throw new Error("No se pudieron cargar las reviews del usuario");
      }
  
      // Devuelve un array vacío si no hay reviews
      return [];
    }
};


export const updateReview = async (reviewId, updatedReview) => {
  const response = await api.put(`/reviews/${reviewId}`, updatedReview);
  return response.data;
};


export const deleteReview = async (reviewId) => {
  const response = await api.delete(`/reviews/${reviewId}`);
  return response.data;
};


export const getReviewById = async (reviewId) => {
  const token = localStorage.getItem("authToken"); // Obtener el token del almacenamiento local
  const response = await api.get(`/reviews/${reviewId}`, {
    headers: {
      Authorization: `Bearer ${token}`, // Enviar el token en los headers
    },
  });
  return response.data;
};
