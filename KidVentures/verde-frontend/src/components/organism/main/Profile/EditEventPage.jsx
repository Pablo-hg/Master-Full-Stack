import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getEventById, updateEvent, deleteEvent } from "../../../../services/eventsService";
import { AiOutlineSave, AiOutlineDelete } from "react-icons/ai";
import { getCategories } from "../../../../services/creatEventService";
import { getUsers } from "../../../../services/usersService";
import Manager from "../CreatEvent/atoms/Manager";
import Cronograma from "../CreatEvent/atoms/Cronograma";
import { MainMenu } from "../../../molecule/MainMenu";
import ImageGallery from "./atoms/ImageGallery";
import PhotoUpload from "../CreatEvent/atoms/PhotoUpload";
import Application from "../CreatEvent/atoms/Application";
import { getCities } from "../../../../services/creatEventService";
import City from "../CreatEvent/atoms/City";

const EditEventPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [users, setUsers] = useState([]);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); // Popup de éxito
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [cities, setCities] = useState([]);

  

  // Manejo de estado para los campos editables
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    is_unique_date: true,
    dates:  "",
    recurrence: "",
    startTime: "",
    endTime: "",
    city: "",
    coordinates: { lat: "", lng: "" },
    ubication: "",
    managers: [{ name: "" }],
    participants: [{ name: "" }],
    event_type: "",
    participants_limit: "",
    age_range: "",
    price: "",
    applications: [],
    photos: [],
  });

  const formatDate = (date) => {
    const options = { year: '2-digit', month: '2-digit', day: '2-digit' };
    return new Date(date).toLocaleDateString('es-ES', options);
  };
  

  const openDeleteConfirmation = () => {
    setShowDeletePopup(true);
  };

  const closeDeleteConfirmation = () => {
    setShowDeletePopup(false);
  };

  const handleDelete = async () => {
    setConfirmingDelete(true);
    try {
      await deleteEvent(eventId);
      setShowDeletePopup(false);
      setShowSuccessPopup(true);

      setTimeout(() => {
        setShowSuccessPopup(false);
        navigate("/profile");
      }, 2000);
    } catch (err) {
      alert("Error al eliminar el evento: " + err.message);
    } finally {
      setConfirmingDelete(false);
    }
  };

  // Función para manejar la modificación de la ubicación
  const handleLocationChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      ubication: e.target.value, // Modificamos la ubicación
    }));
  };

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        console.log(`Realizando solicitud a la API con ID: ${eventId}`);
        const [eventData, categoriesResponse, userResponse, citiesResponse] = await Promise.all([
          getEventById(eventId),
          getCategories(),
          getUsers(),
          getCities(), 
        ]);
        
        console.log(categoriesResponse)
        setEvent(eventData);
        setCategories(categoriesResponse?.data || []);
        setUsers(userResponse || []);
        setCities(citiesResponse?.data || []);
        
  
        setUploadedImages(eventData.photos);
        console.log("Fotos del evento obtenidas:", eventData.photos);
        setFormData({
          ...eventData,
          category: eventData.category || "",
          city: eventData.city || "",
        });
      } catch (err) {
        console.error("Error al cargar datos:", err.message);
        setError("Error al cargar los datos del evento.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchEventData();
  }, [eventId]);
  

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

   // Manejador para la ciudad seleccionada
   const handleCityChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const updatedData = {
        ...formData,
        category: formData.category?.id || formData.category,
        dates: typeof formData.dates === 'string' ? formData.dates.split(",").map((date) => date.trim()) : formData.dates.map((date) => date.trim()),
        managers: formData.managers.map(manager => ({
          id: manager._id || manager.id,
          name: manager.name,
        })),
        participants: formData.participants.map(participant => ({
          id: participant._id || participant.id,
          name: participant.name,
        })),
        photos: photos,
      };

      await updateEvent(eventId, updatedData);
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false); // Cierra el popup
        navigate("/events/list"); // Navega a la nueva página
      }, 1500);
    } catch (err) {
      console.error("Error al guardar los cambios:", err);
      alert("No se pudieron guardar los cambios");
    }
  };

   // Manejador para subir fotos
  const handlePhotoUpload = (uploadedUrls) => {
    setPhotos((prevPhotos) => [...prevPhotos, ...uploadedUrls]);
  };

  
  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;


  return (
    <div className="event-edit-page bg-gray-100 p-0 h-screen overflow-y-auto">
      <div className="max-w-full mx-auto mb-40">
        <div
          className="event-card bg-white rounded-none overflow-hidden"
          style={{
            boxShadow: "none",
            minHeight: "150vh",
            
          }}
        >
          {/* Encabezado */}
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">Editar Evento</h1>
          </div>
  
          {/* Contenido Editable */}
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               
               {/* Fotos */}
              <div>
              <label className="block text-gray-700 font-semibold mb-2">Cambiar Foto</label>
              <ImageGallery
                   eventId={eventId}
                   existingImages={uploadedImages}
                   onUpload={(newImages) => setUploadedImages((prev) => [...prev, ...newImages])}
                   onDelete={(deletedImage) =>
                     setUploadedImages((prev) => prev.filter((img) => img !== deletedImage))
                    }
                />
              </div>
              <PhotoUpload onUpload={handlePhotoUpload} />

  
              {/* Nombre */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Nombre</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
              </div>
  
              {/* Descripción */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Descripción</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2"
                ></textarea>
              </div>
  
              {/* Categoría */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Categoría</label>
                <select
                  name="category"
                  value={String(formData.category) || ""}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2"
                >
                  <option value="" disabled>
                    Selecciona una categoría
                  </option>
                  {categories.map((category,index) => (
                    <option key={index} value={String(category)}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
  
              {/* Cronograma */}
              <Cronograma 
                eventData={{
                  ...formData, 
                  dates: formData.dates ? formData.dates.map(date => formatDate(date)) : [],
                }}   
                setEventData={setFormData}
              />
  
            </div>
  
            {/* Hora de inicio y fin */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Hora de Inicio</label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Hora de Fin</label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
              </div>
            </div>
  
            {/* Ubicación */}
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Ubicación</span>
              </div>
              <input
                type="text"
                name="ubication"
                value={formData.ubication} // Mostrar la ubicación guardada
                onChange={handleLocationChange} // Cambiar la ubicación
                placeholder="Ubicación exacta"
                className={`input input-bordered w-full ${error.ubication ? 'border-red-500' : ''}`}
                autoComplete="off"
              />
              {error.ubication && <p className="text-sm text-red-500 mt-1">{error.ubication}</p>}
            </label>
  
            {/* Ciudad */}
            <div>
            
            <City
              cities={cities} // Lista de ciudades disponibles
              selectedCity={formData.city} // Ciudad actual seleccionada
              onChange={handleCityChange} // Maneja los cambios
              error={error.city} // Muestra errores relacionados
            />
          </div>
  
            {/* Precio */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Precio</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>
  
            {/* Rango de Edad */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Rango de Edad</label>
              <input
                type="text"
                name="age_range"
                value={formData.age_range}
                placeholder="Ejemplo: 18-30"
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>
  
            {/* Organizadores */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Organizadores</label>
              <Manager
                users={users}
                selectedManagers={formData.managers}
                onManagerChange={(updatedManagers) =>
                  setFormData({
                    ...formData,
                    managers: updatedManagers,
                  })
                }
              />
            </div>
  
            {/* Participantes */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Participantes</label>
              <Application
                users={users}
                selectedParticipants={formData.participants}
                onSendInvitation={(invitations) => {
                  console.log("Invitaciones enviadas:", invitations);
                }}
                onChange={(updatedParticipants) => 
                  setFormData({
                    ...formData,
                    participants: updatedParticipants, // Actualizamos los participantes en el estado del formulario
                  })
                }
              />
            </div>
  
            {/* Tipo de Evento */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Tipo de Evento</label>
              <input
                type="text"
                name="event_type"
                value={formData.event_type}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>
  
            {/* Límite de Participantes */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Límite de Participantes</label>
              <input
                type="number"
                name="participants_limit"
                value={formData.participants_limit}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>
  
          </div>
        </div>
  
        {/* Botón de Guardar y Eliminar */}
        <div className="p-4 border-t bg-gray-50 flex justify-center space-x-4">
          <button
            onClick={handleDelete}
            className="flex items-center bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition"
            title="Eliminar evento"
          >
            <AiOutlineDelete size={20} className="mr-2" />
            Eliminar
          </button>
  
          <button
            onClick={handleSave}
            className="flex items-center bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
          >
            <AiOutlineSave size={24} className="mr-2" />
            Guardar Cambios
          </button>
        </div>
      </div>
  
      {/* Modal de Confirmación de Eliminación */}
      {showDeletePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-sm">
            <h2 className="text-xl font-semibold text-gray-800">¿Estás seguro?</h2>
            <p className="mt-2 text-gray-600">
              ¿Deseas eliminar este evento? Esta acción no se puede deshacer.
            </p>
            <div className="mt-4 flex justify-end space-x-4">
              <button
                onClick={closeDeleteConfirmation} // Cancelar eliminación
                className="py-2 px-4 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete} // Confirmar eliminación
                className={`py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition ${confirmingDelete ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={confirmingDelete} // Desactivar el botón durante el proceso
              >
                {confirmingDelete ? "Eliminando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}
  
      {/* Popup de éxito */}
      {showSuccessPopup && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
          Evento eliminado exitosamente.
        </div>
      )}
  
      {/* Popup de Guardado */}
      {showPopup && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
          Cambios guardados con éxito!!
        </div>
      )}

       <MainMenu/>
    </div>

    
  );
  };
  
  
  export default EditEventPage;
  