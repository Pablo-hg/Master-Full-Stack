const cloudinary = require("cloudinary").v2;
const fs = require("fs/promises");
const tinify = require("tinify");

tinify.key = process.env.TINYPNG_API_KEY;

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Mapeo de transformaciones según inputType
const transformationsMap = {
  event: [
    { width: 800, height: 400, crop: "pad", background: "auto" },
    { effect: "saturation:50" },
    { effect: "contrast:30" },
  ],
  review: [
    { width: 600, height: 600, crop: "fill", gravity: "face" },
    { effect: "grayscale" },
  ],
};

// Obtener transformaciones según inputType
function getTransformations(inputType) {
  return transformationsMap[inputType] || []; // Por defecto, no aplica transformaciones
}

// Comprimir y subir una imagen
async function compressAndUpload(filePath, folder = "uploads", inputType = "default") {
  console.log("Comenzando compresión y subida:");
  console.log("FilePath:", filePath);
  console.log("InputType:", inputType);

  
  const compressedPath = `compressed-${Date.now()}.jpg`;

  try {
    // Comprimir imagen con Tinify
    await tinify.fromFile(filePath).toFile(compressedPath);
    console.log("Imagen comprimida exitosamente:", compressedPath);


    // Obtener las transformaciones según inputType
    const transformations = getTransformations(inputType);
    console.log("Transformaciones aplicadas:", transformations);


    // Subir a Cloudinary con transformaciones
    const result = await cloudinary.uploader.upload(compressedPath, { 
      folder,
      transformation: transformations,
     });
     console.log("Subida exitosa a Cloudinary:", result.secure_url);
     
    // Limpiar imagen comprimida
    await fs.unlink(compressedPath);

    return result; // Devuelve datos de Cloudinary
  } catch (error) {
    console.error("Error en compresión/subida:", error);
    throw error;
  }
}

// Limpiar archivos temporales
async function cleanTempFiles(files) {
  try {
    await Promise.all(files.map((file) => fs.unlink(file.path)));
    console.log("Archivos temporales eliminados correctamente.");
  } catch (error) {
    console.error("Error al limpiar archivos temporales:", error);
  }
}

module.exports = {
  compressAndUpload,
  cleanTempFiles,
};
