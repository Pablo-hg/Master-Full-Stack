import api from './api'; 

// Función para obtener todos los eventos
export const getEvents = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.get('/events',{
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error del backend al obtener eventos:', error.response.data);
      throw new Error(error.response.data.msg || 'Error al cargar eventos desde el servidor');
    } else {
      console.error('Error de conexión:', error.message);
      throw new Error('No se pudo conectar con el servidor');
    }
  }
};

// Función para obtener un evento por su ID
export const getEventById = async (eventId) => {

  const token = localStorage.getItem("token"); // Obtén el token del almacenamiento local
  
  if (!token) {
    console.warn("Token no encontrado en localStorage.");
    throw new Error("Usuario no autenticado");
  }
  
  
  if (!eventId) throw new Error("Se requiere el ID del evento");
   

  try {
    console.log("Realizando solicitud a la API con ID:", eventId);
    const response = await api.get(`/events/${eventId}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Incluye el token en el encabezado
      },
    });
    
    console.log("Respuesta completa del servidor:", response);
    console.log("Datos esperados del evento:", response.data);

    return response.data;
  } catch (error) {
    console.error("Error al obtener el evento:", error.response?.data || error.message);
    throw new Error(error.response?.data || "Error desconocido");
  }
};

// Función para crear un nuevo evento
export const createEvent = async (eventData) => {
  try {
    const response = await api.post('/events', eventData);
    return response.data;
  } catch (error) {
    console.error('Detalles del error:', error.response?.data);
    if (error.response) {
      throw new Error(error.response.data.message || 'Error al crear el evento.');
    } else {
      throw new Error('Error: ' + error.message);
    }
  }
};

// Función para actualizar un evento existente
export const updateEvent = async (id, eventData) => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.warn("Token no encontrado en localStorage.");
    throw new Error("Usuario no autenticado");
  }

  try {
    const response = await api.put(`/events/${id}`, eventData,
    {
      headers: {
        Authorization: `Bearer ${token}`, // Incluye el token en los headers
        "Content-Type": "application/json", // Opcional: asegura que el contenido sea JSON
      },
    }
    );


    return response.data;
  } catch (error) {
    console.error('Error al actualizar el evento:', error);
    throw new Error('No se pudo actualizar el evento');
  }
};

// Función para eliminar un evento
export const deleteEvent = async (id) => {
  const token = localStorage.getItem("token"); // Obtén el token del almacenamiento local

  if (!token) {
    console.warn("Token no encontrado en localStorage.");
    throw new Error("Usuario no autenticado");
  }

  if (!id) throw new Error("Se requiere el ID del evento");

  try {
    const response = await api.delete(`/events/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Incluye el token en los headers
      },
    });

    console.log("Evento eliminado con éxito:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar el evento:", error.response?.data || error.message);
    throw new Error(error.response?.data || "Error desconocido");
  }
};

// Función para obtener todos los eventos
export const getEventsPaginated = async (page = 1, limit = 20) => {
  try {
    const token = localStorage.getItem('token');
    //const response = await api.get('/events',{
    const response = await api.get(`/events/eventosPages?page=${page}&limit=${limit}`,{
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error del backend al obtener eventos:', error.response.data);
      throw new Error(error.response.data.msg || 'Error al cargar eventos desde el servidor');
    } else {
      console.error('Error de conexión:', error.message);
      throw new Error('No se pudo conectar con el servidor');
    }
  }
};
