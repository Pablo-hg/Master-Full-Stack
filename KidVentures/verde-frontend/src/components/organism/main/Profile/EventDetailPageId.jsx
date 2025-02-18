import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserEvents } from "../../../../services/usersService";

const EventDetailPageId = () => {
  const { eventId } = useParams();
  const [eventDetails, setEventDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await getUserEvents(); 
        const event = response.data.find((event) => event._id === eventId); 
        if (event) {
          setEventDetails(event);
        } else {
          setError("Evento no encontrado.");
        }
        setLoading(false);
      } catch (error) {
        setError("Error al obtener los detalles del evento.");
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  if (loading) {
    return <p>Cargando detalles del evento...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!eventDetails) {
    return <p>No se encontraron detalles para este evento.</p>;
  }

  return (
    <div className="p-4">
      <h2>Detalles del Evento</h2>
      <p>ID del Evento: {eventDetails._id}</p>
      <p>Nombre del Evento: {eventDetails.name}</p>
      <p>Descripción: {eventDetails.description}</p>
      <p>Categoría: {eventDetails.category}</p>
      <p>Ubicación: {eventDetails.ubication}</p>
      <p>Fecha de Inicio: {new Date(eventDetails.startTime).toLocaleString()}</p>
      <p>Fecha de Fin: {new Date(eventDetails.endTime).toLocaleString()}</p>
      <p>Precio: {eventDetails.price}</p>
      <p>Rango de Edad: {eventDetails.age_range}</p>
      <p>Limitación de Participantes: {eventDetails.participants_limit}</p>

      {/* Aquí puedes agregar más campos según sea necesario */}
    </div>
  );
};

export default EventDetailPageId;
