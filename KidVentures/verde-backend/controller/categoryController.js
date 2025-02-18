const Category = require("../model/category.model");

// Crear una nueva categoría (POST) - Solo Admin
async function createCategory(req, res) {
  try {
    const { name, description } = req.body;

    const newCategory = new Category({ name, description });
    await newCategory.save();

    return res.status(201).json({
      message: "Categoría creada exitosamente",
      newCategory,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// Obtener todas las categorías (GET)
async function getCategories(req, res) {
  try {
    const categories = await Category.find();
    // const categoryNames = categories.map((category) => category.name); // Extrae los nombres de las categorías
    // console.log("category names" + categoryNames);
    console.log("Categorías enviadas",);
    return res.send(categories);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// Actualizar una categoría (PUT) - Solo Admin
async function updateCategory(req, res) {
  try {
    const { categoryId } = req.params;
    const { name, description } = req.body;

    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { name, description },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Categoría no encontrada." });
    }

    return res.status(200).json({
      message: "Categoría actualizada exitosamente",
      updatedCategory,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// Eliminar una categoría (DELETE) - Solo Admin
async function deleteCategory(req, res) {
  try {
    const { categoryId } = req.params;

    const deletedCategory = await Category.findByIdAndDelete(categoryId);

    if (!deletedCategory) {
      return res.status(404).json({ message: "Categoría no encontrada." });
    }

    return res.status(200).json({
      message: "Categoría eliminada exitosamente",
      deletedCategory,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};
