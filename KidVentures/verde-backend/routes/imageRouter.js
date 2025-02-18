const express = require("express");
const multer = require("multer");
const router = express.Router();
const {
  uploadImages,
  assignEventToImages,
  updateImage,
  deleteImage,
  getUserImages,
  getImagesByEvent
} = require("../controller/imageController");

// Configuración única de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`),
});
const upload = multer({ storage });


// Ruta: Subir imágenes
router.post("/upload", upload.array("images", 5), uploadImages);


// Asignar imágenes a un evento
router.patch("/assign-event", assignEventToImages);

// Ruta para actualizar una imagen específica (PUT)
router.put('/:imageId', upload.single('image'), updateImage);

// Ruta para eliminar una imagen (soft delete) (DELETE)
router.delete('/:imageId', deleteImage);


// Ruta para obtener imágenes por evento y usuario (GET)
router.get('/user/:userId', getUserImages);

module.exports = router;

