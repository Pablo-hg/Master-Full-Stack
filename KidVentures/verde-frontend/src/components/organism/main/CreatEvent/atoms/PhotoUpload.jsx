import { useState } from "react";
import { FaTimes, FaPaperPlane } from "react-icons/fa";
import { uploadImages } from "../../../../../services/imageService";


const PhotoUpload = ({ userId, onUpload }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Manejar selección de fotos
  const handlePhotoChange = (event) => {
    const files = Array.from(event.target.files);

    if (selectedFiles.length + files.length > 5) {
      alert("Puedes seleccionar un máximo de 5 fotos.");
      return;
    }
    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
    console.log("Archivos seleccionados:", [...selectedFiles, ...files])
  };

  // Eliminar una foto seleccionada
  const handleRemovePhoto = (fileIndex) => {
    setSelectedFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== fileIndex)
  );
  };

  // Subir fotos
  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      alert("Por favor, selecciona al menos una foto antes de subir.");
      console.error("No hay archivo seleccionado");
      return;
    }
    
    setUploading(true);

    console.log("Subiendo archivo:", selectedFiles);

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("images", file); 
    });
     
      // Añadir inputType al FormData
     formData.append("inputType", "event");
     
     // Debug detallado del FormData
       for (const pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
        }  

     try {
      const response = await uploadImages(formData); // Llamada al backend
 
      // Validar estructura de la respuesta del backend
      if (!response || !Array.isArray(response)) {
        throw new Error("La respuesta del servidor tiene un formato inesperado.");
      }
     
     
      // Extrae URLs de la respuesta
      const uploadedUrls = response;
      console.log("URLs recibidas en handleUpload:", uploadedUrls);
      
     // Actualiza el estado con las nuevas URLs
     setUploadedImages((prev) => [...prev, ...uploadedUrls]);
     setSelectedFiles([]); // Limpia los archivos seleccionados

      if (onUpload) {
        onUpload(uploadedUrls); // Notificar al componente padre
      }

      alert("Las imágenes se subieron correctamente.");
    } catch (error) {
      console.error("Error en la subida de las fotos:", error);
      alert("Ocurrió un error al subir las fotos. Intenta nuevamente.");
    }finally {
      setUploading(false);
    }
  };


  return (
    <div className="relative w-full max-w-sm">
      <label htmlFor="photos" className="block text-sm font-medium text-gray-700">
        Fotos del Evento
      </label>
      <input
        type="file"
        multiple
        onChange={handlePhotoChange}
        accept="image/jpeg,image/png"
        name="new-event"
        id="new-event"
        className="p-2 border border-gray-300 rounded-md w-full mt-2"
      />


      {/* Vista previa de imágenes seleccionadas */}
      <div className="mt-3 flex flex-wrap gap-2">
        {selectedFiles.map((file, index) => (
          <div
            key={index}
            className="flex items-center p-2 bg-gray-200 rounded-md"
          >
            <img
              src={URL.createObjectURL(file)} // Vista previa de imagen local
              alt={`selected-${index}`}
              className="w-16 h-16 object-cover rounded-md mr-2"
            />
            {file.name}
            <button
              type="button"
              onClick={() => handleRemovePhoto(index)}
              className="ml-2 text-gray-500 hover:text-red-500"
            >
              <FaTimes />
            </button>
          </div>
        ))}
      </div>


       {/* Vista previa de imágenes subidas */}
      <div className="mt-3 flex flex-wrap gap-2">
        {uploadedImages.map((url, index) => (
          <div key={index} className="flex items-center p-2 bg-green-200 rounded-md">
            <img
              src={url} // URL desde el backend
              alt={`uploaded-${index}`}
              className="w-16 h-16 object-cover rounded-md mr-2"
            />
            <span className="text-xs text-gray-600">Subida</span>
          </div>
        ))}
      </div>


      <button
        onClick={handleUpload}
        disabled={uploading || selectedFiles.length === 0}
        className={`mt-4 p-2 text-white rounded-md hover:bg-blue-600 focus:outline-none ${
          selectedFiles.length === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500"
        }`}
      >
        {uploading ? "Subiendo..." : "Subir Fotos"} <FaPaperPlane className="inline ml-1" />
      </button>
    </div>
  );
};

export default PhotoUpload;
