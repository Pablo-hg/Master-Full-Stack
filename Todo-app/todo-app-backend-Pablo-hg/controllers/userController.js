// const users = [
//   {
//     id: "0",
//     firstname: "Jordi",
//     lastname: "Galobart",
//     email: "test@example.com",
//     password: "correctpassword",
//   },
// ];

const User = require("../models/user.model");

function getUser(req, res) {
  User.find()
    .then((usertDocs) => {
      console.log("Usuario encontrado: ", usertDocs);
      res.send(usertDocs);
    })
    .catch((err) => console.log("Error al obetner el Usuario: ", err));
}

async function postUser(req, res) {
  try {
    const { email, password } = req.body;
    // Buscar al usuario por email
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(400).json({ message: "Error al logearse" });
    }
    // Si todo está bien, devolver una respuesta de éxito
    res.status(200).json({ message: "Inicio de sesión exitoso" });
  } catch (err) {
    console.error("Error al iniciar sesión: ", err);
    res.status(500).json({ message: "Error en el servidor" });
  }
}

const userController = {
  getUserInfo: (req, res) => {
    console.log("llamada a getUserInfo");
    // Crea una copia del array de usuarios para evitar modificar el original
    let copiaUsers = JSON.parse(JSON.stringify(users));
    // console.log(copiaUsers);

    let user = copiaUsers[0]; // Obtiene el primer usuario de la copia
    delete user.id; // Elimina la propiedad 'id' del usuario
    delete user.password; // Elimina la propiedad 'password' del usuario
    // console.log(user);

    // Devuelve el usuario modificado con un código de estado 200 (OK)
    res.status(200).json(user);
  },

  postUserLogin: (req, res) => {
    console.log("llamada a postUserLogin");
    const userEmail = req.body.email; // Obtiene el correo electrónico del cuerpo de la solicitud
    // console.log(users);

    // Encuentra el usuario en el array original basado en el correo electrónico
    const user = users.find((user) => user.email === userEmail);
    // console.log(user);

    // Si no se encuentra el usuario, devuelve un error 404
    if (user === undefined) {
      return res.status(404).json({
        msg: "User not found",
      });
    } else {
      // Compara la contraseña proporcionada con la contraseña del usuario
      if (req.body.password !== user.password) {
        return res.status(403).json({
          msg: "Forbidden",
        });
      } else {
        // Si todo es correcto, devuelve un mensaje de éxito con un código de estado 200
        return res.status(200).json({
          msg: "Login successful",
        });
      }
    }
  },
};

module.exports = {
  userController,
  getUser,
  postUser,
};
