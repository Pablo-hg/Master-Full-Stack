// applicationService.js
export async function createApplication(id_event, id_user) {
  try {
    const response = await fetch('/applications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id_event, id_user }),
    });

    // Verifica si la respuesta es válida y contiene contenido
    if (!response.ok) {
      try {
        // Intenta obtener un mensaje de error desde el servidor
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al enviar la invitación');
      } catch {
        throw new Error('Error al enviar la invitación y el servidor no devolvió detalles.');
      }
    }

    // Verifica si hay contenido antes de intentar parsear JSON
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};  // Verifica si `text` no está vacío
    console.log(`Invitación enviada con éxito:`, data);
    return data;
  } catch (error) {
    console.error('Error al enviar la invitación:', error.message);
    throw error;
  }
}
