import { useEffect, useState } from "react";
import { AiOutlineEdit, AiOutlinePlus } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { getEventsPaginated } from "../../../../services/eventsService";
import { MainMenu } from "../../../molecule/MainMenu";


const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0); // Total de páginas
  const [loading, setLoading] = useState(false); // Estado para controlar la carga
  const [noMoreEvents, setNoMoreEvents] = useState(false); // Estado para saber si ya no hay más eventos
  const navigate = useNavigate();

  const loadEvents = async () => {
    // Si ya está cargando o si ya hemos llegado al final de las páginas, no hacer nada
    if (loading || (totalPages > 0 && page > totalPages)) {
      setNoMoreEvents(true);
      return;
    }

    setLoading(true);

    try {
      const response = await getEventsPaginated(page, 2); // Pide los eventos de la página actual
      const { events, totalPages: pages, currentPage } = response;

      if (events.length > 0) {
        setEvents((prev) => {
          const newEvents = events.filter(
            (event) =>
              !prev.some((existingEvent) => existingEvent._id === event._id)
          ); // Filtra los eventos duplicados
          return [...prev, ...newEvents]; // Agrega solo los nuevos eventos
        });
        setPage(currentPage + 1); // Incrementa el número de página
        setTotalPages(pages); // Actualiza el total de páginas
      }
    } catch (error) {
      console.error("Error al obtener eventos:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []); // Vuelve a ejecutar el efecto cuando la página cambia

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 1 >=
        document.documentElement.scrollHeight
      ) {
        loadEvents(); // Carga más datos al llegar al final
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll); // Limpia el evento al desmontar
    };
  }, [page, totalPages, loading]); // Dependencias

  const handleViewEvent = (eventId) => {
    navigate(`/events/${eventId}`); // Redirige al detalle del evento por ID
  };
  
  const handleComment = (eventId) => {
    // Redirige a la página de reseñas para el evento actual usando el ID del evento
    navigate(`/reviews/events/${eventId}`);
  };

  const handleCreateEvent = () => {
    navigate("/new"); // Redirige a la página de creación de eventos
  };

  return (
    <div className="events-page mt-8 pb-40 px-0">
      <h4 className="text-2xl font-bold mb-6 px-4">Descubre Eventos</h4>

      <div className="events-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.length === 0 ? (
          <p className="px-4">No hay eventos disponibles.</p>
        ) : (
          events.map((event) => (
            <div
              key={event._id}
              className="card bg-white cursor-pointer hover:shadow-lg transition-shadow duration-300"
              onClick={() => handleViewEvent(event._id)} // Redirige al detalle del evento
            >
              {/* Imagen del evento */}
              <img
                src={
                  event.photos && event.photos.length > 0
                    ? event.photos[0] // Usa la primera foto del array
                    : "https://via.placeholder.com/300x200?text=Evento" // Imagen predeterminada
                }
                alt={event.name}
                className="w-full h-64 object-cover"
              />

              {/* Contenido del evento */}
              <div className="p-4">
                {/* Título del evento */}
                <h5 className="font-bold text-lg mb-2">{event.name}</h5>

                {/* Descripción corta del evento */}
                <p className="text-sm text-gray-600 mb-2">
                  {event.description?.slice(0, 50)}...{" "}
                  {/* Limita la descripción a 50 caracteres */}
                </p>

                {/* Ubicación del evento */}
                <p className="text-sm text-gray-500 mb-4">{event.location}</p>

                {/* Sección puntuación y número de reseñas */}
                <div className="flex justify-between items-center">
                  {/* Puntuación promedio */}
                  <div className="text-gray-700 text-sm flex items-center">
                    <span className="font-bold">
                      {event.averageScore || "0/5"}
                    </span>
                  </div>

                {/* Número de reseñas */}
                <div
               className="text-gray-500 text-sm flex items-center cursor-pointer p-3 rounded-md hover:bg-gray-100"
               onClick={(e) => {
              e.stopPropagation(); // Evita que el clic se propague a otros manejadores
              handleComment(event._id); // Navega a la página de reseñas
              }}
                >
           < AiOutlineEdit className="text-gray-400 mr-2" size={20} />
            
            </div>

              </div>
            </div>
            </div> 
          ))
        )}
      </div>

      {/* Indicador de carga */}
      {loading && <p className="text-center">Cargando más eventos...</p>}

      {/* Mensaje cuando no hay más eventos */}
      {noMoreEvents && !loading && (
        <p className="text-center text-red-500">Ya no hay más eventos.</p>
      )}

      {/* Botón fijo de creación de evento */}
      <button
        onClick={handleCreateEvent}
        className="fixed top-4 right-4 bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 active:bg-blue-400 transition duration-50"
      >
        <AiOutlinePlus size={24} />
      </button>

      <MainMenu />
    </div>
  );
};

export default EventsPage;
