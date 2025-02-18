import api from './api';

// Subir imágenes como temporales (antes de crear el evento)
export const uploadImages = async (formData, inputType, eventId) => {
  const token = localStorage.getItem("token");

  console.log("Token enviado:", token); // Debug del token
  console.log("FormData enviado:", formData); // Debug del FormData

  // Añadir idatos al FormData
  formData.append("inputType", inputType);
  if (eventId) {
    formData.append("eventId", eventId); 
  }
  
  
  for (const pair of formData.entries()) {
    console.log(`${pair[0]}: ${pair[1]}`);
  }
  
  
  try {
    const response = await api.post('/images/upload', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data', // Asegurarse de enviar como multipart/form-data
      },
    });

    if (!response.data || !response.data.results) {
      throw new Error("Error inesperado: respuesta del servidor inválida.");
    }
    
    const successImages = response.data.results.success.map((img) => img.filePath);
    const failedImages = response.data.results.failed;

    console.log("Respuesta del backend:", successImages); // Debug de la respuesta
    if (failedImages.length > 0) {
      console.warn("Errores al subir imágenes:", failedImages);
    }
   
    return successImages; // Lista de imágenes subidas
  } catch (error) {
    console.error("Error en uploadImages:", error.response || error.message); // Debug del error
    throw error; // Lanzar el error para manejarlo en el frontend
  }
};

// Asociar imágenes temporales a un evento
export const associateImagesToEvent = async (eventId, imageIds) => {
  const token = localStorage.getItem("token");

  console.log("Token enviado:", token); // Debug del token
  console.log("eventId:", eventId, "imageIds:", imageIds); // Debug de los datos enviados

  try {
    const response = await api.patch('/assign-event', {
      eventId,
      imageIds,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Respuesta del backend:", response.data); // Debug de la respuesta
    return response.data; // Lista de imágenes actualizadas
  } catch (error) {
    console.error("Error en associateImagesToEvent:", error.response || error.message); // Debug del error
    throw error; // Lanzar el error para manejarlo en el frontend
  }
};


export const deleteImage = async (imageId) => {
  const token = localStorage.getItem("token");

  try {
    const response = await api.delete(`/images/${imageId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Imagen eliminada:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error en deleteImage:", error.response || error.message);
    throw error;
  }
};

export const updateImage = async (imageId, formData) => {
  const token = localStorage.getItem("token");

  try {
    const response = await api.put(`/images/${imageId}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data", // Importante para enviar archivos
      },
    });

    console.log("Imagen actualizada con nueva subida:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error en updateImage (nueva imagen):", error.response || error.message);
    throw error;
  }
};



export const getUserImages = async (userId) => {
  const token = localStorage.getItem("token");

  try {
    const response = await api.get(`/images/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Imágenes del usuario obtenidas:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error en getUserImages:", error.response || error.message);
    throw error;
  }
};
