import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import axios from "axios";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef, useState } from "react";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { getEvents } from "../../../../services/eventsService";
import { MainMenu } from "../../../molecule/MainMenu";
import "./DiscoverPage.css";

const DiscoverPage = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  const apiKeyMaps = import.meta.env.VITE_API_MAPS;
  const [coordinates, setCoordinates] = useState(null);
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const geocoderContainerRef = useRef();
  const tokenMapBox = import.meta.env.VITE_TOKEN_MAPBOX;
  const [userdata, setUserData] = useState([]);
  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const [searchTerm, setSearchTerm] = useState("");
  const [markersByName, setMarkersByName] = useState({});
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);

  // Obtener eventos al cargar la página
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const fetchedEvents = await getEvents();
        setEvents(fetchedEvents);
      } catch (error) {
        console.error("Error al obtener los eventos:", error);
      }
    };
    fetchEvents();
  }, []);
  // console.log(events);

  const handleEventClick = (eventId) => {
    navigate(`/events/${eventId}`); // Redirige a EventDetailsPage
  };

  const handleViewMore = () => {
    navigate("/events"); // Redirige a EventsPage
  };

  // Obtener datos del usuario al cargar la página
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const strdUserId = localStorage.getItem("userId");
        if (!token || !strdUserId)
          throw new Error("Falta información de sesión.");
        const response = await axios.get(`${API_URL}/users/${strdUserId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data || { interests: [] });
      } catch (err) {
        console.error("Error al obtener el usuario:", err);
      }
    };
    fetchUser(); // Llamada a la función asíncrona
  }, []);

  // Obtener coordenadas de la ciudad del usuario
  useEffect(() => {
    if (!userdata || !userdata.city) return;
    const city = userdata.city;
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        city
      )}&key=${apiKeyMaps}`
    )
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        if (data.status === "OK") {
          const location = data.results[0].geometry.location;
          const mainCoordinates = [location.lng, location.lat];
          setCoordinates(mainCoordinates); // Guardar coordenadas principales
        } else {
          console.error("No se encontraron coordenadas para la ciudad.");
        }
      })
      .catch((error) =>
        console.error("Error al obtener las coordenadas principales:", error)
      );
  }, [apiKeyMaps, userdata.city]);

  // Inicializar el mapa
  useEffect(() => {
    if (coordinates && !mapRef.current) {
      mapboxgl.accessToken = tokenMapBox;
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        center: coordinates, // Coordenadas iniciales
        zoom: 15,
      });

      mapRef.current.addControl(new mapboxgl.FullscreenControl()); // Añadir control de pantalla completa
    }
  }, [coordinates]);

  // Añadir marcadores
  useEffect(() => {
    console.log("Añadiendo marcadores...");
    if (mapRef.current) {
      // Limpiar marcadores anteriores
      Object.values(markersByName).forEach((marker) => marker.remove());
      const tempMarkersByName = {};

      // Filtrar eventos por ciudad seleccionada (si hay una) y por categoría seleccionada
      const filteredEvents = events.filter((event) => {
        const isCityMatch = selectedCity ? event.city === selectedCity : true;
        const isCategoryMatch = selectedCategory
          ? event.category === selectedCategory // Asumiendo que el evento tiene un campo `category`
          : true;

        return isCityMatch && isCategoryMatch;
      });

      filteredEvents.forEach((event) => {
        if (event.coordinates && event.coordinates.length === 2) {
          const marker = new mapboxgl.Marker({ color: "red" })
            .setLngLat(event.coordinates)
            .addTo(mapRef.current)
            .setPopup(
              new mapboxgl.Popup().setHTML(
                `<div class="flex gap-4 p-2 pb-0 align-baseline">
                <div class="flex-1">
                  <h4 class="text-lg font-bold text-gray-800 leading-tight">${
                    event.name
                  }</h4>
                  <p class="text-sm text-gray-500 mt-1"> ${
                    event.description.length > 50
                      ? event.description.substring(0, 50) + "..."
                      : event.description.substring(0, 50)
                  }</p>
                  <p class="text-sm text-gray-500 mt-1">FECHA: ${event.dates[0].substring(
                    0,
                    10
                  )} </p>
                  <p class="text-sm text-gray-500"> HORARIO: ${
                    event.startTime
                  } - ${event.endTime}</p>
                  <div class="flex justyify-baseline">
                  <button id="viewEvent-${
                    event._id
                  }" class="mt-2 bg-blue-500 text-white rounded p-2">Ver más</button>
                  </div>
                </div>
                <div class="flex-2">
                  <img class="rounded-lg" src=${
                    event.photos[0]
                  } alt="Foto del evento" />
                </div>
              </div>`
              )
            );

          marker.getElement().addEventListener("click", () => {
            mapRef.current.flyTo({
              center: event.coordinates,
              zoom: 15,
              speed: 1.5,
              curve: 1,
              essential: true,
            });
          });

          // Añadir listener al botón "Ver más"
          marker.getPopup().on("open", () => {
            const button = document.getElementById(`viewEvent-${event._id}`);
            button.addEventListener("click", () => handleViewEvent(event._id));
          });

          // Guardar el marcador en el objeto usando el nombre del evento como clave
          tempMarkersByName[event.name] = marker;
        }
      });

      // Actualizar el estado con los nuevos marcadores
      setMarkersByName(tempMarkersByName);
    } else {
      console.error(
        "No se puede añadir marcadores porque el mapa no está listo."
      );
    }
  }, [events, selectedCity, selectedCategory, coordinates]); // Se ejecuta cada vez que `events` o `selectedCity` cambian.

  //obtener las ciudades
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const token = localStorage.getItem("token");
        const strdUserId = localStorage.getItem("userId");
        if (!token || !strdUserId)
          throw new Error("Falta información de sesión.");
        const response = await axios.get(`${API_URL}/cities`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCities(response.data);
      } catch (err) {
        console.error("Error al obtener el usuario:", err);
      }
    };
    fetchCities();
  }, []);

  //obtener las categorias
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const strdUserId = localStorage.getItem("userId");
        if (!token || !strdUserId)
          throw new Error("Falta información de sesión.");
        const response = await axios.get(`${API_URL}/categories`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(response.data);
      } catch (err) {
        console.error("Error al obtener el usuario:", err);
      }
    };
    fetchCategories();
  }, []);

   // Habilita el botón si cualquiera de los dos tiene un valor
  useEffect(() => {
    setIsButtonEnabled(!!selectedCity || !!selectedCategory);
  }, [selectedCity, selectedCategory]);

  // Función para cambiar la ciudad seleccionada
  const handleCityChange = (event) => {
    const newCity = event.target.value;
    setSelectedCity(newCity); // Esto disparará el useEffect y filtrará los marcadores
    console.log(selectedCity);
  };

  const handleCategoryChange = (event) => {
    const newCategory = event.target.value;
    setSelectedCategory(newCategory); // Esto disparará el useEffect y filtrará los marcadores
    console.log(selectedCategory);
  };

  // Función para ver un evento
  const handleViewEvent = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  // Función para localizar al usuario
  const locateUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const userCoords = [longitude, latitude];

          // Centrar el mapa en las coordenadas del usuario
          if (mapRef.current) {
            mapRef.current.flyTo({
              center: userCoords,
              zoom: 15,
              speed: 1.5,
              curve: 1,
              essential: true,
            });

            // Crear una fuente GeoJSON para el usuario
            const geojsonSource = {
              type: "geojson",
              data: {
                type: "FeatureCollection",
                features: [
                  {
                    type: "Feature",
                    geometry: {
                      type: "Point",
                      coordinates: userCoords,
                    },
                  },
                ],
              },
            };

            // Añadir la fuente y la capa al mapa
            if (mapRef.current.getSource("user-location")) {
              mapRef.current
                .getSource("user-location")
                .setData(geojsonSource.data);
            } else {
              mapRef.current.addSource("user-location", geojsonSource);

              mapRef.current.addLayer({
                id: "circle",
                type: "circle",
                source: "user-location",
                paint: {
                  "circle-color": "#4264fb",
                  "circle-radius": 8,
                  "circle-stroke-width": 2,
                  "circle-stroke-color": "#ffffff",
                },
              });
            }
          }
        },
        (error) => {
          console.error("Error obteniendo la ubicación:", error);
          alert("No se pudo obtener tu ubicación.");
        }
      );
    } else {
      alert("Tu navegador no soporta la geolocalización.");
    }
  };

  // Filtrar eventos según el término de búsqueda
  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Función que se activa al hacer clic en un elemento del listado
  const handleSelectEventFromList = (eventName) => {
    const marker = markersByName[eventName]; // Buscar el marcador por nombre
    if (marker) {
      marker.getElement().click(); // Disparar el evento de clic del marcador
    }
  };

  // Esto elimina el filtro de ciudad
  const resetFilters = () => {
    setSelectedCity(null);
    setSelectedCategory(null);
  };

  return (
    <div className="grid h-screen p-4 bg-gray-100">
      <h2 className="text-2xl font-bold mb-0">Descubrir</h2>
      {/* Mapa */}
      <div className="map">
        <h4 className="text-xl font-semibold mb-4">Eventos cerca de ti</h4>
        <button
          onClick={locateUser}
          className="p-2 bg-blue-500 text-white rounded mb-4"
        >
          Localizarme
        </button>

        <label className="input input-bordered flex items-center gap-2 mb-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type="text"
            className="grow"
            placeholder="Buscar evento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </label>

        {searchTerm && filteredEvents.length === 0 ? (
          <p>No se encontraron eventos.</p>
        ) : (
          searchTerm && (
            <ul className="list-disc pl-5">
              {filteredEvents.map((event) => (
                <li
                  key={event._id}
                  className="cursor-pointer"
                  onClick={() => handleSelectEventFromList(event.name)}
                >
                  {event.name}
                </li>
              ))}
            </ul>
          )
        )}

        <div className="filtros mb-4">
        <button
  className="btn btn-square"
  onClick={resetFilters}
  disabled={!isButtonEnabled}
>
  <RiDeleteBin6Fill />
</button>


          <select
            className="select w-full max-w-32 city"
            value={selectedCity || ""}
            onChange={handleCityChange}
          >
            <option disabled value="">
              Ciudad
            </option>

            {cities.map((city) => (
              <option key={city._id} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
          <select
            className="select w-full max-w-32 category"
            value={selectedCategory || ""}
            onChange={handleCategoryChange}
          >
            <option disabled value="">
              Categoría
            </option>

            {categories.map((category) => (
              <option key={category._id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div ref={geocoderContainerRef} />
        {coordinates && (
          <div
            id="map-container"
            className="w-full h-96 bg-slate-700 "
            ref={mapContainerRef}
          />
        )}
      </div>

      {/* Lista de eventos */}
      <div className="events-created mt-4">
        <h4 className="text-xl font-semibold mb-4">Eventos más recientes</h4>
        <div className="events-list grid grid-cols-1 md:grid-cols-2 gap-6">
          {events
            .sort((a, b) => new Date(a.dates[0]) - new Date(b.dates[0])) // Ordenar por fecha
            .slice(0, 2)
            .map((event) => (
              <div
                key={event._id}
                className="card bg-white p-4 rounded-lg shadow-md cursor-pointer hover:shadow-xl transition-shadow duration-300"
                onClick={() => handleEventClick(event._id)} // Redirige al hacer clic
              >
                {/* Imagen del evento */}
                <img
                  src={
                    event.photos[0] ||
                    "https://via.placeholder.com/400x200?text=Evento"
                  }
                  alt={event.name}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />

                {/* Contenido del evento */}
                <div>
                  <h5 className="font-bold text-lg mb-2">{event.name}</h5>
                  <p className="text-sm text-gray-600">
                    {event.description?.slice(0, 50)}...{" "}
                    {/* Limitar descripción a 50 caracteres */}
                  </p>
                </div>
              </div>
            ))}
        </div>

        {/* Botón para redirigir a EventsPage */}
        <button
          onClick={handleViewMore}
          className="mt-4 text-blue-500 hover:underline pb-32"
        >
          Ver más eventos
        </button>
      </div>

      {/* Menú principal */}
      <MainMenu />
    </div>
  );
};

export default DiscoverPage;
