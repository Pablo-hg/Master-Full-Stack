const express = require("express");
const router = express.Router();
const {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory
} = require("../controller/categoryController");

// Ruta para crear una nueva categoría (POST) - Solo Admin
router.post('/', createCategory);

// Ruta para obtener todas las categorías (GET)
router.get('/', getCategories);

// Ruta para actualizar una categoría (PUT) - Solo Admin
router.put('/:categoryId', updateCategory);

// Ruta para eliminar una categoría (DELETE) - Solo Admin
router.delete('/:categoryId', deleteCategory);

module.exports = router;
