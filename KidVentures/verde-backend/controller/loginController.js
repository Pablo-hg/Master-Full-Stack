const jwt = require("jsonwebtoken");
const User = require("../model/user.model.js");
const City = require("../model/city.model.js");
const Category = require("../model/category.model");
const bcrypt = require("bcrypt");

async function loginForm(req, res) {
  const { formData } = req.body;
  try {
    const user = await User.findOne({ email: formData.email });
    if (user) {
      if (user.is_active) {
        // Compara la contraseña ingresada con el hash almacenado
        const contraseñaCorrecta = await bcrypt.compare(
          formData.password,
          user.password
        );
        if (contraseñaCorrecta) {
          console.log("Datos OK");
          const token = jwt.sign(
            { id: user.id.toString(), role: user.role },
            process.env.SECRET
          );
          return res.status(201).json({ token, user });
        } else {
          console.error("contraseña incorrecta");
          return res.json({ message: "Correo o contraseña incorrecto" });
        }
      } else {
        console.error("Usuario no activo");
        return res.json({ message: "Usuario no activo" });
      }
    } else {
      console.error("Correo incorrecto");
      return res.json({ message: "Correo o contraseña incorrecto" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Error en el servidor" });
  }
}

async function checkEmail(req, res) {
  const { formData } = req.body;
  try {
    const user = await User.findOne({ email: formData.email });
    if (!user) {
      // console.log("correo valido");
      return res.status(201).json({ user });
    } else {
      console.error("Este correo ya está en uso");
      return res.json({ message: "Error en la creación de cuenta" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Error en el servidor" });
  }
}

function getNamesCitiesAndCategories(req, res) {
  let cityNames = [];
  let categoryNames = [];

  City.find()
    .then((citiesDocs) => {
      cityNames = citiesDocs.map((city) => city.name); // Extrae los nombres de las ciudades
      return Category.find(); // Realiza la segunda consulta después de obtener las ciudades
    })
    .then((categoriesDocs) => {
      categoryNames = categoriesDocs.map((category) => category.name); // Extrae los nombres de las categorías
      res.send({ cities: cityNames, categories: categoryNames }); // Envía ambos datos en la respuesta
      // console.log("Listado de nombres de ciudades:", cityNames);
      // console.log("Listado de nombres de categorías:", categoryNames);
    })
    .catch((err) => {
      console.log("Error obteniendo datos", err);
      res.status(500).send("Error obteniendo datos");
    });
}

async function createUser(req, res) {
  try {
    const passwordCifrada = await cifrarContrasena(req.body.password);
    const newUser = {
      name: req.body.name,
      email: req.body.email,
      password: passwordCifrada,
      direction: req.body.address,
      city: req.body.city,
      interests: req.body.interests,
    };
    // Crea el usuario en la base de datos
    User.create(newUser)
      .then((userDocs) => {
        console.log(`Usuario creado correctamente`);
        res.send(userDocs);
      })
      .catch((err) => {
        console.log(`Creating a new user went wrong! Try again 😞 ${err}`);
      });
  } catch (err) {
    console.error(`Error al cifrar o al recuperar el usuario ${err}`);
    res.status(500).send("Error al cifrar o al recuperar el usuario");
  }
}

const cifrarContrasena = async (contrasena) => {
  try {
    const saltRounds = 15; // Número de rondas de encriptación
    const hashedPassword = await bcrypt.hash(contrasena, saltRounds);
    // console.log("Contraseña cifrada:", hashedPassword);
    return hashedPassword;
  } catch (error) {
    console.error("Error al cifrar la contraseña:", error);
  }
};

module.exports = {
  // loginUser,
  loginForm,
  checkEmail,
  getNamesCitiesAndCategories,
  createUser,
};
