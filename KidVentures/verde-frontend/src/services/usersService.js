import api from './api'; 

// Función para obtener todos los usuarios
export const getUsers = async () => {
    try {
      const token = localStorage.getItem('token'); 
      const response = await api.get('/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }

      );
      
      console.log('Response:', response);
      return response.data; 
    } catch (error) {
      console.error('Error al obtener los usuarios:', error.response ? error.response.data : error.message);
      throw new Error('No se pudieron cargar los usuarios');
    }
  };
  

// Función para obtener un usuario por su ID
export const getUserById = async (id) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No se encontró el token de autenticación");
    }

    const response = await api.get(`/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Usuario obtenido:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al obtener el usuario:', error);
    throw new Error('No se pudo cargar el usuario');
  }
};

// Función para obtener los eventos de un ususario 
export const getUserEvents = async (userId) => {
  if (!userId) throw new Error("Se requiere el ID del usuario");

  const token = localStorage.getItem("token");
  console.log("ID del usuario autenticado:", userId);
  try {
    const response = await api.get(`/events/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Incluye el token si la API lo requiere
      },
    });


  // Retorna los eventos encontrados
    return response.data ;
  } catch (error) {
    console.error("Error al obtener los eventos del usuario:", error.message);
    throw new Error("No se pudieron cargar los eventos del usuario");
  }
};
