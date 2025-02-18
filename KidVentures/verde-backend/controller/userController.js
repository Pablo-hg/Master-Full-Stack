// Importar el modelo User
const User = require("../model/user.model.js");
// Importar el modelo Event
const Event = require("../model/event.model");

// Función para eliminar un usuario seguido
async function removeFollowing(req, res) {
  try {
    const userId = req.params.userId;
    const followingId = req.body.followingId;
    console.log("Usuario recibido:", req.body);
    // Buscar el usuario por su ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Eliminar el ID del array following
    user.following = user.following.filter(
      (id) => id.toString() !== followingId
    );

    // Guardar los cambios en la base de datos
    await user.save();

    // Enviar respuesta exitosa
    res.status(200).json({
      message: "ID eliminado del array following exitosamente",
      user: user,
    });
  } catch (error) {
    console.error("Error al eliminar ID del array following:", error);

    // Enviar respuesta de error
    res
      .status(500)
      .json({ message: "Error al eliminar ID del array following" });
  }
}

// Función para eliminar un seguidor
async function removeFollower(req, res) {
  try {
    const userId = req.params.userId;
    const followerId = req.body.followerId;
    console.log("Usuario recibido:", req.body);
    // Buscar el usuario por su ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Eliminar el ID del array followers
    user.followers = user.followers.filter(
      (id) => id.toString() !== followerId
    );

    // Guardar los cambios en la base de datos
    await user.save();

    // Enviar respuesta exitosa
    res.status(200).json({
      message: "ID eliminado del array followers exitosamente",
      user: user,
    });
  } catch (error) {
    console.error("Error al eliminar ID del array followers:", error);

    // Enviar respuesta de error
    res
      .status(500)
      .json({ message: "Error al eliminar ID del array followers" });
  }
}

// Función para crear un nuevo usuario
async function createUser(req, res) {
  try {
    console.log("Usuario recibido:", req.body);

    // Crear una nueva instancia del modelo User con los datos recibidos en el cuerpo de la solicitud
    const newUser = new User(req.body);

    // Guardar el usuario en la base de datos
    const savedUser = await newUser.save();

    // Enviar respuesta exitosa
    res.status(201).json({
      message: "Usuario creado exitosamente",
      user: savedUser,
    });
  } catch (error) {
    console.error("Error al crear usuario:", error);

    // Enviar respuesta de error
    res.status(500).json({
      message: "Hubo un error al crear el usuario",
      error: error.message,
    });
  }
}

// Función para añadir un seguidor
async function addFollower(req, res) {
  try {
    const { userId, followerId } = req.body;

    // Buscar el usuario por userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Añadir el followerId al array followers
    user.followers.push(followerId);

    // Guardar el usuario actualizado en la base de datos
    const updatedUser = await user.save();

    // Enviar respuesta exitosa
    res.status(200).json({
      message: "Seguidor añadido exitosamente",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error al añadir seguidor:", error);

    // Enviar respuesta de error
    res.status(500).json({
      message: "Hubo un error al añadir el seguidor",
      error: error.message,
    });
  }
}

// Función para obtener todos los usuarios
function getUsers(req, res) {
  User.find()
    .then((userDocs) => {
      res.send(userDocs);
      // console.log("Dentro de getUsers", userDocs);
    })
    .catch((err) => console.log("Error getting users", err));
}

// Función para obtener un usuario por ID
function getUser(req, res) {
  console.log(req.params.id);
  User.findById(req.params.id)
    .then((userDoc) => {
      if (userDoc === null) {
        res.json({ message: "No se ha encontrado ningún usuario con este ID" });
      } else {
        console.log("Usuario que se manda:", userDoc.name);
        res.json(userDoc);
      }
    })
    .catch((err) => {
      console.log("Error while getting the student: ", err);
      res.status(500).json({ message: "Error getting user", error: err });
    });
}

// Función para eliminar un interés de un usuario
const removeInterest = async (req, res) => {
  console.log(
    "----------------------------Accede a rmInterest------------------------",
    req.body
  );

  const userId = req.params.id; // ID del usuario en la base de datos
  const interestToRemove = req.body.interestToRemove; // El interés que queremos eliminar

  // Validaciones iniciales
  if (!userId) {
    return res.status(400).json({
      message: "El ID del usuario es obligatorio.",
    });
  }

  if (!interestToRemove) {
    return res.status(400).json({
      message: "El interés a eliminar es obligatorio.",
    });
  }

  try {
    // Buscar al usuario por ID
    const existingUser = await User.findById(userId);

    if (!existingUser) {
      return res.status(404).json({
        message: "Usuario no encontrado.",
      });
    }

    console.log("Usuario encontrado:", existingUser);

    // Asegurar que el campo `interests` exista y sea un arreglo
    if (!Array.isArray(existingUser.interests)) {
      return res.status(400).json({
        message: "El usuario no tiene un campo 'interests' válido.",
      });
    }

    // Filtrar el interés a eliminar
    const updatedInterests = existingUser.interests.filter(
      (interest) => interest !== interestToRemove
    );

    console.log("Intereses actualizados (pre-guardar):", updatedInterests);

    // Actualizar el campo `interests` del usuario en la base de datos
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { interests: updatedInterests } },
      { new: true, runValidators: true }
    );

    console.log("Usuario actualizado:", updatedUser);

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("Error al eliminar el interés:", err);
    res.status(500).json({
      message: "Error interno del servidor al eliminar el interés.",
      error: err,
    });
  }
};

// Función para actualizar un usuario
const updateUser = async (req, res) => {
  console.log("Datos recibidos en req.body:", req.body);

  const userId = req.params.id;

  if (!userId || !req.body) {
    return res
      .status(400)
      .json({ message: "Faltan datos necesarios para actualizar el usuario." });
  }

  try {
    // Obtener el usuario actual de la base de datos
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    // Procesar la mezcla de datos
    const updatedData = { ...existingUser.toObject() };

    for (const key in req.body) {
      if (Array.isArray(req.body[key])) {
        // Si es un arreglo, combinar elementos únicos
        updatedData[key] = Array.isArray(updatedData[key])
          ? [...new Set([...updatedData[key], ...req.body[key]])] // Evitar duplicados
          : req.body[key];
      } else if (typeof req.body[key] === "object" && req.body[key] !== null) {
        // Si es un objeto, combinar propiedades
        updatedData[key] = { ...updatedData[key], ...req.body[key] };
      } else {
        // Si es un valor primitivo, actualizar directamente
        updatedData[key] = req.body[key];
      }
    }

    // Actualizar en la base de datos
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updatedData },
      { new: true, runValidators: true }
    );

    console.log("Usuario actualizado:", updatedUser);
    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("Error al actualizar el usuario:", err);
    res
      .status(500)
      .json({ message: "Error al actualizar el usuario.", error: err });
  }
};

// Función para actualizar múltiples usuarios
function updateUsers(req, res) {
  User.updateMany({ $set: req.body })
    .then((updatedUsers) => {
      console.log("Los usuarios se han modificado", updatedUsers);
      res.json(updatedUsers); // Cambiar res.send a res.json
    })
    .catch((err) => {
      console.log("Error updating users", err);
      res.status(500).json({ message: "Error updating users", error: err });
    });
}

// Función para eliminar un usuario por ID
function deleteUser(req, res) {
  User.findByIdAndDelete(req.params.id)
    .then((deletedUser) => {
      if (deletedUser === null) {
        res.json({ message: "El usuario no existe" });
      } else {
        console.log(`Deleted user with id: ${deletedUser._id}`);
        res.json(deletedUser); // Cambiar res.send a res.json
      }
    })
    .catch((err) => {
      console.log("Error deleting user: ", err);
      res.status(500).json({ message: "Error deleting user", error: err });
    });
}

// Función para eliminar múltiples usuarios
function deleteUsers(req, res) {
  User.deleteMany(req.body)
    .then((deletedUsers) => {
      console.log("Deleted users: ", deletedUsers);
      res.json(deletedUsers); // Cambiar res.send a res.json
    })
    .catch((err) => {
      console.log("Error deleting users: ", err);
      res.status(500).json({ message: "Error deleting users", error: err });
    });
}

// Exportar las funciones del controlador
module.exports = {
  createUser,
  getUsers,
  deleteUser,
  deleteUsers,
  updateUsers,
  updateUser,
  getUser,
  removeInterest,
  removeFollowing,
  removeFollower,
  addFollower,
};
