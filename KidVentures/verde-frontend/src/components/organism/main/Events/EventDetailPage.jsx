import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef, useState } from "react";
import { AiOutlineComment } from "react-icons/ai";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getEventById } from "../../../../services/eventsService";
import { getEventReviews } from "../../../../services/reviewService";
import { getUserById } from "../../../../services/usersService/";
import { MainMenu } from "../../../molecule/MainMenu";

const EventDetailsPage = () => {
  const { eventId } = useParams(); // Obtiene el ID del evento desde la URL
  console.log("eventId obtenido desde useParams:", eventId);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const navigate = useNavigate();

  const tokenMapBox = import.meta.env.VITE_TOKEN_MAPBOX;
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);

  const initializeMap = () => {
    if (event.coordinates && mapContainerRef.current) {
      mapboxgl.accessToken = tokenMapBox;
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        center: event.coordinates, // Coordenadas iniciales
        zoom: 15,
      });

      // Crear marcador rojo para la dirección principal
      const mainMarker = new mapboxgl.Marker({ color: "red" })
        .setLngLat(event.coordinates)
        .addTo(mapRef.current);

      mapRef.current.addControl(new mapboxgl.FullscreenControl());

      mainMarker.getElement().addEventListener("click", () => {
        mapRef.current.flyTo({
          center: event.coordinates,
          zoom: 15,
          speed: 1.5,
          curve: 1,
          essential: true,
        });
      });
    } else {
      console.error("El contenedor del mapa no está disponible.");
    }
  };

  // Cargar los detalles del evento
  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventData = await getEventById(eventId);
        console.log("Datos del evento recibidos:", eventData); // Log para verificar los datos
        // console.log("Fotos del evento obtenidas:", eventData.photos);
        if (!eventData) {
          console.warn("No se encontraron datos para el evento.");
          return;
        }
        setEvent(eventData); // Se establece el estado solo si hay datos válidos
      } catch (error) {
        console.error("Error al cargar datos del evento:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [eventId]);

  // Inicializar el mapa solo cuando el contenedor esté disponible y haya datos del evento
  useEffect(() => {
    if (event && mapContainerRef.current) {
      initializeMap();
    }
  }, [event]);

  // Cargar las reseñas del evento y nombre de usuario
  useEffect(() => {
    console.log("Cargando reseñas para eventId:", eventId);

    const fetchReviews = async () => {
      try {
        const response = await getEventReviews(eventId);
        console.log("Respuesta obtenida del servicio de reseñas:", response);
        if (!eventId) {
          console.error("El ID del evento es inválido o no está presente.");
          return; // Detener la ejecución si no se encuentra el ID
        }

        // Asegúrate de que reviewsData sea un array
        const reviewsData = Array.isArray(response) ? response : [];
        console.log("Reviews:", reviewsData);

        // Mapea las reseñas con los nombres de usuarios
        const reviewsWithUsernames = await Promise.all(
          reviewsData.map(async (review) => {
            try {
              const user = await getUserById(review.userId);
              console.log("Usuario obtenido:", user);
              return { ...review, userName: user?.name };
            } catch (error) {
              console.error(
                `Error al obtener usuario con ID ${review.userId}:`,
                error
              );
              return { ...review, userName: "Usuario desconocido" }; // Valor por defecto si falla
            }
          })
        );

        setReviews(reviewsWithUsernames);
      } catch (error) {
        console.error("Error al cargar reseñas:", error.message);
        setReviews([]);
      } finally {
        setLoadingReviews(false);
      }
    };
    fetchReviews();
  }, [eventId,]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  const handleComment = () => {
    // Redirige a la página de reseñas para el evento actual
    navigate(`/reviews/events/${eventId}`);
  };

  if (!event) {
    // console.error("Evento no encontrado o datos inválidos.");
    return <p>Evento no encontrado</p>;
  }

  // console.log("Renderizando detalles del evento:", event);

  return (
    <div className="event-details-page bg-gray-100 p-0 h-screen overflow-y-auto">
      <div className="max-w-full mx-auto mb-0">
        {/* Contenido del Evento */}
        <div
          className="event-card bg-white rounded-none overflow-hidden"
          style={{
            boxShadow: "none",
            minHeight: "100vh",
          }}
        >
          {/* Fotos del evento */}
          <div className="carousel w-full h-64">
            {event.photos && event.photos.length > 0 ? (
              event.photos.length > 1 ? (
                event.photos.map((photo, index) => (
                  <div
                    id={`slide-${index}`}
                    key={index}
                    className="carousel-item relative w-full"
                  >
                    <img
                      src={photo}
                      alt={`Foto ${index + 1}`}
                      className="w-full h-64 object-cover"
                    />
                    {/* Botón anterior */}
                    <a
                      href={`#slide-${
                        index === 0 ? event.photos.length - 1 : index - 1
                      }`}
                      className="absolute left-0 top-1/2 transform -translate-y-1/2 btn btn-circle"
                    >
                      ❮
                    </a>
                    {/* Botón siguiente */}
                    <a
                      href={`#slide-${
                        index === event.photos.length - 1 ? 0 : index + 1
                      }`}
                      className="absolute right-0 top-1/2 transform -translate-y-1/2 btn btn-circle"
                    >
                      ❯
                    </a>
                  </div>
                ))
              ) : (
                <img
                  src={event.photos[0]}
                  alt="Foto del evento"
                  className="w-full h-64 object-cover"
                />
              )
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-200">
                <p>Sin imagen disponible</p>
              </div>
            )}
          </div>

          {/* Nombre y descripción del evento */}
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">{event.name}</h1>
            <p className="text-gray-700 text-lg mb-6">{event.description}</p>

            {/* Información adicional */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-gray-800">
              <div>
                <h4>
                  <strong>Categoría:</strong>
                </h4>
                <p>{event.category?.name || "Sin categoría"}</p>
              </div>
              <p>
                <strong>Ubicación:</strong> {event.ubication}, {event.city}
              </p>
              <p>
                <strong>Fecha:</strong> {event.dates[0].substring(0, 10)}
              </p>
              <p>
                <strong>Horario:</strong> {event.startTime} - {event.endTime}
              </p>
              <p>
                <strong>Precio:</strong> ${event.price}
              </p>
              <p>
                <strong>Participantes:</strong>{" "}
                {event.participants ? event.participants.length : 0}
              </p>
              <p>
                <strong>Límite de Participantes:</strong>{" "}
                {event.participants_limit}
              </p>
              {/* Administradores */}
              <div>
                <h4>
                  <strong>Administradores:</strong>
                </h4>
                {event.managers && event.managers.length > 0 ? (
                  <ul>
                    {event.managers.map((manager) => (
                      <li key={manager.id}>
                        <Link
                          to={`/profile/${manager.id}`}
                          className="text-blue-500 hover:underline"
                        >
                          {manager.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No asignado</p>
                )}
              </div>

              {/* Participantes */}
              <div>
                <h4>
                  <strong>Participantes:</strong>
                </h4>
                {event.participants && event.participants.length > 0 ? (
                  <ul>
                    {event.participants.map((participant) => (
                      <li key={participant.id}>
                        <Link
                          to={`/profile/${participant.id}`}
                          className="text-blue-500 hover:underline"
                        >
                          {participant.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No hay participantes</p>
                )}
              </div>
            </div>

            {/* Ubicacion del evento */}
            {event.coordinates ? (
              <div
                id="map-container"
                className="w-full h-96 bg-slate-700"
                ref={mapContainerRef}
              />
            ) : (
              <p className="text-red-500 p-6">
                No se han obtenido coordenadas para mostrar el mapa.
              </p>
            )}

            {/* Reseñas */}
            <div className="p-6 border-t bg-gray-50 mb-16">
              <h2 className="text-2xl font-bold mb-4">Reseñas</h2>
              {loadingReviews ? (
                <p>Cargando reseñas...</p>
              ) : reviews.length > 0 ? (
                reviews.map((review) => (
                  <div
                    key={review._id}
                    className="mb-4 p-6 bg-white shadow-lg rounded-xl hover:shadow-2xl transition-shadow duration-300"
                  >
                    <div className="flex items-center mb-2">
                      <span className="text-xl font-semibold text-gray-800">
                        {review.userName}
                      </span>
                    </div>
                    <div className="relative">
                      {/* Comillas estilizadas */}
                      <blockquote className="text-lg text-gray-700 mb-4 pl-8 border-l-4 border-gray-400 italic">
                        <span className="absolute left-0 -top-3 text-3xl text-gray-400">
                          “
                        </span>
                        {review.description}
                        <span className="absolute right-0 -bottom-3 text-3xl text-gray-400">
                          ”
                        </span>
                      </blockquote>
                    </div>
                    <p className="text-sm text-gray-500">
                      Calificación:{" "}
                      <span className="font-semibold">{review.score}/5</span>
                    </p>
                  </div>
                ))
              ) : (
                <p>No hay reseñas para este evento.</p>
              )}
            </div>

            {/* Media y botón comentar */}
            <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
              {/* Puntuación promedio */}
              <div className="text-gray-700 text-sm flex items-center">
                <span className="font-bold">
                  {event.averageScore ? `${event.averageScore}/5` : "?/5"}
                </span>
              </div>
              {/* Botón de comentar */}
              <button
                className="flex items-center text-blue-500 hover:text-blue-600 transition"
                onClick={handleComment}
              >
                <AiOutlineComment size={24} />
                <span className="ml-2">Comentar</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <MainMenu />
    </div>
  );
};

export default EventDetailsPage;
