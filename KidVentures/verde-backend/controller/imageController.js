const Image = require("../model/image.model");
const { compressAndUpload, cleanTempFiles } = require("../utils/cloudinaryService");



// Subir imágenes al servidor y Cloudinary
const uploadImages = async (req, res) => {
  const uploads = req.files|| []; // Archivos cargados por multer
  const savedImages = [];
  const failedImages = [];
  const { inputType} = req.body;
  const { id: userId } = req.user;
  
  if (!inputType || !userId) {
    return res.status(400).json({
      message: "El campo 'inputType' es requerido.",
      results: {
        success: [],
        failed: uploads.map(file => ({
          file: file.originalname,
          error: "inputType is not defined",
        })),
      },
    });
  }
  
  if (uploads.length === 0) {
    return res.status(400).json({
      message: "No se recibieron archivos para subir.",
      results: { success: [], failed: [] },
    });
  }

  try {
    for (const file of uploads) {
      try {
        // Comprimir y subir cada imagen a Cloudinary con las transformaciones correspondientes
        const result = await compressAndUpload(file.path,"uploads", inputType);
        
         // Guardar la imagen en la base de datos
         const imageDoc = new Image({
          userId, 
          filePath: result.secure_url,
          public_id: result.public_id,
          inputType, 
        });

        const savedDoc = await imageDoc.save();
        savedImages.push(savedDoc); 
      } catch (error) {
        failedImages.push({ file: file.originalname, error: error.message });
      }
    }
  } finally {
    // Limpiar archivos temporales
    await cleanTempFiles(uploads);
  }


  const response = {
    message: "Imágenes procesadas.",
    results: { success: savedImages, failed: failedImages },
  };
  
  console.log("Respuesta enviada al cliente:", response);
  return res.status(201).json(response);
};


    
// Actualizar imágenes con `eventId`
async function assignEventToImages(req, res) {
  const { eventId, imageIds } = req.body;

  if (!eventId || !imageIds || !Array.isArray(imageIds)) {
      return res.status(400).json({ error: "Faltan `eventId` o `imageIds` válidos." });
  }

  try {
      const updatedImages = await Image.updateMany(
          { _id: { $in: imageIds } }, // Filtrar imágenes por sus IDs
          { eventId } // Asignar el `eventId`
      );

      if (updatedImages.modifiedCount === 0) {
          return res.status(404).json({ message: "No se encontraron imágenes para actualizar." });
      }

      return res.status(200).json({
          message: "Imágenes actualizadas exitosamente.",
          updated: updatedImages.modifiedCount,
      });
  } catch (error) {
      console.error("Error al asignar `eventId` a imágenes:", error);
      return res.status(500).json({ message: "Error al actualizar imágenes", error: error.message });
  }
}


// Actualizar una imagen específica (PUT)
async function updateImage(req, res) {
  try {
    console.log("Request recibido:", req.body, req.file);
    const { imageId } = req.params;
    const { eventId } = req.body;

    let updatedImage = await Image.findById(imageId);

    if (!updatedImage) {
      return res.status(404).json({ message: "Imagen no encontrada." });
    }

    // Subir nueva imagen si se envió un archivo
    if (req.file) {
      const uploadResult = await compressAndUpload(req.file.path, "events", "event");

      // Actualizar la URL de la imagen en la base de datos
      updatedImage.url = uploadResult.secure_url;
      await updatedImage.save();

      // Limpieza del archivo temporal
      await cleanTempFiles([req.file]);
    }

    // Actualizar otros campos
    updatedImage.eventId = eventId;
    updatedImage.updatedAt = Date.now();
    updatedImage = await updatedImage.save();

    return res.status(200).json({
      message: "Imagen actualizada exitosamente",
      updatedImage,
    });
  } catch (error) {
    console.error("Error en updateImage:", error);
    return res.status(500).json({ message: error.message });
  }
}

  
  // Eliminar una imagen (soft delete) (DELETE)
  async function deleteImage(req, res) {
    try {
      const { imageId } = req.params;
  
      const deletedImage = await Image.findByIdAndUpdate(
        imageId,
        { deletedAt: Date.now() },
        { new: true }
      );
  
      if (!deletedImage) {
        return res.status(404).json({ message: "Imagen no encontrada." });
      }
  
      return res.status(200).json({
        message: "Imagen eliminada exitosamente",
        deletedImage,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  
  
  // Obtener todas las imágenes subidas por un usuario específico (GET)
  async function getUserImages(req, res) {
    try {
      const { userId } = req.params;
  
      const images = await Image.find({ userId, deletedAt: null });
  
      if (images.length === 0) {
        return res.status(404).json({ message: "No se encontraron imágenes para este usuario." });
      }
  
      return res.status(200).json(images);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  
  module.exports = {
    assignEventToImages,
    uploadImages,
    updateImage,
    deleteImage,
    getUserImages,
  };