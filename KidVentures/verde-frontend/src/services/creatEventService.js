import api from './api';

// Subir fotos del evento
export async function uploadEventPhotos(formData) {
  try {
    const response = await api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.files.map((file) => file.url); // Devuelve solo las URLs
  } catch (error) {
    console.error('Error al subir fotos del evento:', error);
    throw new Error(error.response?.data?.message || 'Error al subir las fotos.');
  }
}

// Crear un nuevo evento
export const createEvent = async (eventData) => {
    try {
      const token = localStorage.getItem('token')
      const response = await api.post('/events', eventData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }); 
      return response.data;
    } catch (error) {
      console.error('Detalles del error:', error.response.data);
      if (error.response) {
        console.error('Errores de validación:', error.response.data.errors);
        console.error('Detalles del error:', error.response.data);
        throw new Error(error.response.data.message || 'Error al crear el evento.');
      
      
      } 
      if (eventData.participants) {
        console.log("Participantes registrados:", eventData.participants);
      
      } 
      
      else {
      
      throw new Error('Error: ' + error.message);
      } 
    }
  };


 
// Obtener categorías  
export const getCategories = async () => {
  console.log("Iniciando solicitud para obtener categorías");
  const token = localStorage.getItem('token');
  try {
    const response = await api.get('/categories', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Respuesta de la API:", response.data);
    // Validar que la respuesta sea un arreglo
    if (!Array.isArray(response.data)) {
      throw new Error("La respuesta de categorías no es un arreglo válido.");
    }

    return response;
  } catch (error) {
    console.error("Error al obtener categorías:", error.message);
    throw error;
  }
};



// Obtener ciudades
export const getCities = () => {
  const token = localStorage.getItem('token');
  return api.get('/cities', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  );
};

