import { useState, useEffect } from "react";





const ImageGallery = ({  existingImages = []}) => {
  
  const [uploadedImages, setUploadedImages] = useState(existingImages); // Todas las imágenes del evento

  // Cargar las imágenes existentes al cargar el componente
  useEffect(() => {
    if (existingImages && existingImages.length > 0) {
      setUploadedImages(existingImages);
    }
  }, [existingImages]);

 

  return (
    <div>


     {/* Mostrar las imágenes existentes */}
     <div className="w-full h-64 bg-cover bg-center">
        {uploadedImages.length > 0 ? (
          uploadedImages.map((image, index) => (
            <div
              key={index}
              className="w-full h-64 bg-cover bg-center relative"
              style={{
                 backgroundImage: `url('${image}')` }}
            >
              
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-64 bg-gray-100">
            <p>Sin imágenes disponibles</p>
          </div>
        )}
      </div>
      
    </div>
  );
};

export default ImageGallery;
