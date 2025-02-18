/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createEvent,
  getCategories,
  getCities,
} from "../../../../services/creatEventService";
import { getUsers } from "../../../../services/usersService";
import { MainMenu } from "../../../molecule/MainMenu";
import PhotoUpload from "../../main/CreatEvent/atoms/PhotoUpload";
import Age from "./atoms/Age";
import Application from "./atoms/Application";
import Category from "./atoms/Category";
import City from "./atoms/City";
import Cronograma from "./atoms/Cronograma";
import Manager from "./atoms/Manager";
import ParticipantsLimit from "./atoms/ParticipantsLimit";
import Price from "./atoms/Price";
import Time from "./atoms/Time";



const CreateEventPage = () => {
  const [eventData, setEventData] = useState({
    name: "",
    description: "",
    dates: [],
    is_unique_date: false,
    recurrence: { frequency: "weekly", interval: 1, endDate: "" },
    managers: [],
    participants: [],
    age_range: "",
    participants_limit: 1,
    price: "",
    city: "",
    category: "",
    photos: "",
    coordinates: "",
    ubication: "",
    event_type: "",
    applications: [],
  });
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [isFree, setIsFree] = useState(false);
  const [managers, setManagers] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [errors, setErrors] = useState({});
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [participantsLimit, setParticipantsLimit] = useState("");
  const [applications, setApplications] = useState([]);
  const [users, setUsers] = useState([]);

  const apiKeyMaps = import.meta.env.VITE_API_MAPS;

  const navigate = useNavigate();

  //Lllamada a API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoryResponse, cityResponse, userResponse] =
          await Promise.all([getCategories(), getCities(), getUsers()]);

          console.log("Respuesta de la API:", categoryResponse.name);

        setCategories(categoryResponse?.data || []);
        setCities(cityResponse?.data || []);
        setUsers(userResponse || []);
        setManagers(userResponse || []);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };
    fetchData();
  }, []);

  /** MANEJO DE VALIDACIONES Y ERRORES */
  const validateField = (name, value) => {
    let errorMessage = "";

    switch (name) {
      case "participants_limit":
        if (value && !/^\d*$/.test(value)) {
          errorMessage = "Debe ser un número válido";
        }
        break;

      case "name":
        if (value && !/^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]*$/.test(value)) {
          errorMessage = "Nombre solo debe contener letras y espacios";
        }
        break;
      case "ubication":
        if (value && !/^[A-Za-zÀ-ÿ0-9\sçÇ·'’"“”.,\-\/]*$/.test(value)) {
          errorMessage = "Ubicación solo debe contener caracteres válidos";
        }
        
        break;
      case "description":
        { const regex = /^[\p{L}\p{N}\s¡!¿?.,'-]*$/u;

        if (!regex.test(value)) {
          errorMessage = "La descripción contiene caracteres no permitidos";
        } else if (value.length > 0 && value.length < 10) {
          errorMessage = "La descripción debe tener al menos 10 caracteres";
        }
        break; }
      case "price":
        if (value !== "" && !/^\d*$/.test(value)) {
          errorMessage = "Debe ser un número válido";
        }
        break;
      default:
        break;
    }

    return errorMessage;
  };

  // Validación de fechas (puedes reutilizarla en otros contextos)
  const validateDates = (dates) => {
    if (!dates || dates.length === 0) {
      return { isValid: false, error: "Debe seleccionar al menos una fecha." };
    }

    const formattedDates = dates
      .map((date) => {
        const parsedDate = new Date(date);
        return isNaN(parsedDate) ? null : parsedDate.toISOString();
      })
      .filter(Boolean);

    if (formattedDates.length === 0) {
      return { isValid: false, error: "Formato de fecha no válido." };
    }

    return { isValid: true, formattedDates };
  };

  // Maneja cambios en campos de entrada (incluye validación)
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Limpiar el error antes de aplicar la validación
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "", // Limpia el error antes de validar
    }));

    // Actualizar el valor en el estado
    setEventData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Manejador para desenfoque de campos (puedes reutilizar validateField)
  const handleBlur = (e) => {
    const { name, value } = e.target;
    let errorMessage = validateField(name, value);

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));
  };

  /** MANEJADORES DEL EVENTO */

  // Manejador para seleccionar administradores
  const handleManagerChange = (updatedManagers) => {
    setEventData((prev) => ({
      ...prev,
      managers: updatedManagers.map((manager) => manager._id),
    }));
  };

  // Manejador para subir fotos
  const handlePhotoUpload = (uploadedUrls) => {
    setPhotos((prevPhotos) => [...prevPhotos, ...uploadedUrls]);
  };

  // Manejador invitaciones a usuarios
  const handleApplicationChange = (updatedUsers) => {
    console.log("Usuarios seleccionados en Application:", updatedUsers);

    setApplications(updatedUsers);
    // Sincronizar participantes con los IDs de los usuarios seleccionados
    setEventData((prevEventData) => ({
      ...prevEventData,
      participants: updatedUsers.map((user) => user._id), // Mapea los IDs
    }));
  };

  // Rango de Edad
  const handleAgeRangeChange = (value) => {
    setAgeRange(value);
  };

  //Time
  const handleTimeChange = (field, value, error = "") => {
    if (field === "startTime") {
      setStartTime(value);
      setErrors({ ...errors, startTime: error });
    } else if (field === "endTime") {
      setEndTime(value);
      setErrors({ ...errors, endTimeTime: error });
    }
  };

  // Manejador de cambios en el precio
  const handlePriceChange = (value) => {
    const numericValue = value.replace(/[^0-9]/g, ""); // Permitir solo números
    setEventData((prevData) => ({
      ...prevData,
      price: numericValue,
    }));

    // Validación
    let errorMessage = "";
    if (value !== "" && isNaN(Number(numericValue))) {
      errorMessage = "Debe ser un número válido";
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      price: errorMessage,
    }));
  };

  // Manejador para el cambio de checkbox de "Gratis"
  const handlePriceToggle = () => {
    setIsFree(!isFree);
    setEventData((prevData) => ({
      ...prevData,
      price: !isFree ? "0" : "",
    }));
  };

  // Validación en el desenfoque del precio
  const handlePriceBlur = () => {
    if (eventData.price === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        price: "Este campo es obligatorio",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        price: "",
      }));
    }
    if (!isFree && eventData.price === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        price: "El precio no puede estar vacío",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        price: "",
      }));
    }
  };

  //Aforo
  const handleParticipantChange = (name, value) => {
    setParticipantsLimit(value);
    setEventData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleParticipantsLimitBlur = (name, value, errorMessage) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));
    if (!errorMessage) {
      setEventData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSelectChange = (name, value) => {
    setEventData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: value ? "" : `El campo ${name} es obligatorio.`,
    }));
  };

  /** ENVÍO DEL FORMULARIO */


  //obteniendo userid del token
  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token"); // O donde guardes el token
    if (!token) {
      console.error("Token no encontrado.");
      return null;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1])); // Decodificar JWT
      return payload.id; // Cambia según cómo está estructurado tu token
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = getUserIdFromToken(); // Obtener el ID del usuario creador
    if (!userId) {
      console.error("No se pudo obtener el ID del usuario creador.");
      setPopupMessage("Error: No se pudo identificar al creador del evento.");
      setShowPopup(true);
      return;
    }

    // Obtiene los participantes
    const participants = eventData.participants || [];
    console.log("Participantes iniciales:", participants);

    // Construir el array de managers (el creador es siempre manager)
    const allManagers = [userId, ...eventData.managers];
    console.log("Preparando los datos para enviar...", allManagers);

    // Añadir el ID del creador si no está ya incluido en los participantes
    const allParticipants = [...new Set([...participants, userId])];
    console.log("Preparando los datos para enviar...", allParticipants);
     
     // Validación de categoría
  if (!eventData.category) {
    setErrors((prevErrors) => ({
      ...prevErrors,
      category: "Por favor, selecciona una categoría.",
    }));
    return;
  }
    // Validar y procesar `applications`
    const validatedApplications =
      Array.isArray(eventData.applications) && eventData.applications.length > 0
        ? eventData.applications
            .map((app) => {
              if (app && app.userId) {
                return {
                  userId: app.userId,
                  check: { accepted: true }, // Por defecto, 'true' para aceptación automática
                };
              } else {
                console.warn("Aplicación inválida encontrada:", app);
                return null; // Opcional, filtra elementos no válidos
              }
            })
            .filter(Boolean) // Elimina elementos `null` del array
        : [];

    console.log("Participantes válidos", validatedApplications);
    console.log("Participantes antes de enviar:", eventData.participants);
    // Validación de horas
    if (startTime && endTime && startTime >= endTime) {
      setErrors({
        ...errors,
        form: "La hora de inicio debe ser anterior a la de fin.",
      });
      return;
    }
    // Validar el rango de edad
    if (!ageRange) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        ageRange: "El rango de edad es obligatorio.",
      }));
      return;
    }
    // Validar el rango de edad
    if (!ageRange) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        ageRange: "El rango de edad es obligatorio.",
      }));
      return;
    }

    // Validar si hay errores en los campos obligatorios
    const formErrors = {};
    if (!eventData.name)
      formErrors.name = "El nombre del evento es obligatorio";
    if (!eventData.description)
      formErrors.description = "La descripción es obligatoria";
    if (!eventData.price && !isFree)
      formErrors.price = "El precio es obligatorio";
    if (!eventData.participants_limit)
      formErrors.participants_limit =
        "El límite de participantes es obligatorio";
    if (!eventData.city) formErrors.city = "La ciudad es obligatoria";
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return; // Detiene el envío si hay errores
    }

    const address = `${eventData.ubication}, ${eventData.city}`;
    const coordinates = await fetchCoordinates(address);

    // Preparar los datos del evento
    const finalEventData = {
      name: eventData.name,
      description: eventData.description,
      dates: eventData.dates,
      recurrence: {
        frequency: eventData.recurrence.frequency || undefined,
        interval: eventData.recurrence.interval || 1,
        endDate: eventData.recurrence.endDate || null,
      },
      is_unique_date: eventData.is_unique_date,
      managers: allManagers,
      startTime,
      endTime,
      age_range: ageRange,
      price: eventData.price,
      participants: allParticipants,
      participants_limit: eventData.participants_limit,
      city: eventData.city,
      ubication: eventData.ubication,
      coordinates: coordinates,
      category: eventData.category,
      applications: validatedApplications,
      event_type: eventData.event_type,
      photos: photos,
    };
    console.log(
      "Datos finales a enviar al servidor (finalEventData):",
      finalEventData
    );
    console.log("Datos a guardar:", { managers, participants });

    if (
      !["weekly", "monthly", "yearly"].includes(
        finalEventData.recurrence.frequency
      )
    ) {
      console.warn("Frecuencia no válida. Eliminando del objeto de datos.");
      delete finalEventData.recurrence.frequency;
    }

    try {
      console.log("Enviando los datos del evento al servidor...");
      const data = await createEvent(finalEventData);
      console.log("Evento creado exitosamente:", data);

      setPopupMessage("¡Evento creado!");
      setShowPopup(true);
      // Redirigir después de 3 segundos
      setTimeout(() => {
        setShowPopup(false);
        navigate("/events");
      }, 3000);
    } catch (error) {
      console.error(
        error.response
          ? `Error en la respuesta del servidor: ${error.response.data}`
          : `Error al conectar con el servidor: ${error.message}`
      );
    }
  };

  const fetchCoordinates = async (address) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          address
        )}&key=${apiKeyMaps}`
      );
      const data = await response.json();

      if (data.status === "OK") {
        const location = data.results[0].geometry.location;
        const mainCoordinates = [location.lng, location.lat];
        return mainCoordinates;
      } else {
        console.error(
          "No se encontraron coordenadas para la dirección principal."
        );
      }
    } catch (error) {
      console.error("Error al obtener las coordenadas principales:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="flex items-center mb-2 p-2">
        <h4 className="text-2xl font-bold mb-0 px-4">Crear evento</h4>
      </div>

      {/* Formulario */}
      <div className="flex-1 space-y-4 max-w-lg mx-auto w-full overflow-y-auto pb-20 px-4">
        {/* Nombre del evento */}
        <label className="form-control w-full relative">
          <div className="label">
            <span className="block text-sm font-medium text-gray-700">
              Nombre del evento
            </span>
          </div>
          <input
            type="text"
            name="name"
            value={eventData.name}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder="Nombre del evento"
            className={`input input-bordered w-full ${
              errors.name ? "border-red-500" : ""
            }`}
            autoComplete="off"
          />
          {errors.name && (
            <p className="text-sm text-red-500 mt-1">{errors.name}</p>
          )}
        </label>

        {/* Descripción del evento */}
        <label className="form-control w-full relative">
          <div className="label">
            <span className="block text-sm font-medium text-gray-700">
              Descripción del evento
            </span>
          </div>
          <textarea
            name="description"
            value={eventData.description}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder="Descripción del evento"
            className={`textarea textarea-bordered w-full ${
              errors.description ? "border-red-500" : ""
            }`}
            autoComplete="off"
          />

          {errors.description && (
            <p className="text-sm text-red-500 mt-1">{errors.description}</p>
          )}
        </label>

        {/* Administrador */}
        <Manager
          users={users}
          selectedManagers={users.filter((user) =>
            eventData.managers.includes(user._id)
          )}
          onManagerChange={handleManagerChange}
        />

        {/* Tipo de evento */}
        <label className="form-control w-full">
          <div className="label">
            <span className="block text-sm font-medium text-gray-700">
              Tipo de evento
            </span>
          </div>
          <select
            name="event_type"
            value={eventData.event_type}
            onChange={(e) => handleSelectChange(e.target.name, e.target.value)}
            className={`select select-bordered w-full ${
              errors.event_type ? "border-red-500" : ""
            }`}
            autoComplete="off"
          >
            <option value="" disabled>
              Selecciona el tipo de evento
            </option>
            <option value="privado">Privado</option>
            <option value="abierto">Abierto</option>
          </select>
        </label>

        {/* Campo de fotos */}
        <PhotoUpload onUpload={handlePhotoUpload} />

        {/* Ciudad */}
        <City
          cities={cities}
          selectedCity={eventData.city}
          onChange={handleSelectChange}
          error={errors.city}
        />

        {/* Ubicación */}
        <label className="form-control w-full">
          <div className="label">
            <span className="block text-sm font-medium text-gray-700">
              Ubicación
            </span>
          </div>
          <input
            type="text"
            name="ubication"
            value={eventData.ubication}
            onBlur={handleBlur}
            onChange={handleInputChange}
            placeholder="Ubicación exacta"
            className={`input input-bordered w-full ${
              errors.ubication ? "border-red-500" : ""
            }`}
            autoComplete="off"
          />
          {errors.ubication && (
            <p className="text-sm text-red-500 mt-1">{errors.ubication}</p>
          )}
        </label>

        {/* Categoría */}
        <Category
          categories={categories}
          selectedCategory={eventData.category}
          onChange={handleSelectChange}
          error={errors.category}
        />


        {/* Campo de aforo */}
        <ParticipantsLimit
          value={eventData.participants_limit}
          onChange={handleParticipantChange}
          onBlur={handleParticipantsLimitBlur}
          error={errors.participants_limit}
        />

        {/* Invitaciones */}

        <Application
          users={users} // Lista de usuarios
          onChange={handleApplicationChange} // Sincronizar con el padre
        />

        {/* Campo de precio */}
        <Price
          isFree={isFree}
          price={eventData.price}
          onToggleFree={handlePriceToggle}
          onChange={handlePriceChange}
          onBlur={handlePriceBlur}
          error={errors.price}
        />

        {/* Cronograma */}
        <Cronograma eventData={eventData} setEventData={setEventData} />

        {/* Componente Horario */}
        <Time
          startTime={startTime}
          endTime={endTime}
          onTimeChange={handleTimeChange}
        />

        {/* Componente de Rango de Edad */}
        <Age ageRange={ageRange} onAgeRangeChange={handleAgeRangeChange} />

        {/* Botón de creación del evento */}
        <button onClick={handleSubmit} className="btn btn-primary w-full">
          Crear evento
        </button>

        {/* Popup de confirmación */}
        {showPopup && (
          <div className="fixed bottom-20 right-10 bg-green-500 text-white p-3 rounded-lg shadow-lg z-50">
            {popupMessage}
          </div>
        )}
      </div>

      {/* Menú Principal */}
      <MainMenu className="fixed bottom-0 left-0 w-full" />
    </div>
  );
};

export default CreateEventPage;
