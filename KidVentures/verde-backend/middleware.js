const jwt = require("jsonwebtoken");

const authMiddlewares = {
  // Middleware para validar el token JWT en las solicitudes
  validateToken: (req, res, next) => {
    // Verificamos si la solicitud tiene el token en el header 'Authorization'
    // console.log("Authorization Header:", req.headers.authorization);
    // console.log("Token decodificado:", req.user);

    if (!req.headers.authorization) {
      return res.status(401).send("You are not authorized");
    }

    try {
      // Extraemos el token del header (formato: "Bearer [token]")
      const token = req.headers.authorization.split(" ")[1];

      // Verificamos el token utilizando la clave secreta almacenada en process.env.SECRET
      const decoded = jwt.verify(token, process.env.SECRET);
      // console.log("Usuario decodificado del token:", decoded);
      // decoded contendrá los datos del token (por ejemplo, { id: 1, role: 'user', iat: 1631080000 })

      // Añadimos la información decodificada del token al objeto req para que esté disponible en las siguientes rutas
      req.user = { id: decoded.id, role: decoded.role };
      // console.log("ID de usuario desde token:", req.user.id);
      console.log("ID de usuario desde token recuperada");
      // console.log("Usuario decodificado del token:", req.user);
      // Continuamos con la ejecución de la siguiente función del middleware
      next();
    } catch (err) {
      // Si hay un error al verificar el token (por ejemplo, token inválido o expirado), enviamos un error 401
      console.log("Error validating token", err);
      return res.status(401).send("You are not authorized");
    }
  },
};

module.exports = authMiddlewares;
