// Importaciones
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { Server } = require("socket.io"); // Socket.io
const http = require("http"); // Servidor HTTP
require("dotenv").config();

// Routers
const userRouter = require("./routes/userRouter.js");
const citiesRouter = require("./routes/citiesRouter.js");
const applicationRouter = require("./routes/applicationRouter.js");
const eventRouter = require("./routes/eventRouter.js");
const reviewRouter = require("./routes/reviewRouter.js");
const imageRouter = require("./routes/imageRouter.js");
const categoryRouter = require("./routes/categoryRouter.js");
const loginRouter = require("./routes/loginRouter.js");
const emailRouter = require("./routes/emailRouter.js");
const chatRouter = require("./routes/chatRouter.js");

// Middlewares
const authMiddlewares = require("./middleware.js");
const { SaveChats } = require("./controller/chatController.js");
// Configuración inicial
const app = express();
const PORT = process.env.PORT || 300;

// Crear servidor HTTP
const server = http.createServer(app);

// Inicializar Socket.io - http://localhost:5173
const io = new Server(server, {
  cors: {
    origin: "*", // Cambia según tu frontend
    methods: ["GET", "POST"],
  },
});

// Conexión a MongoDB
const mongoDB = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_SERVER}/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=ClusterDePablo`;

mongoose
  .connect(mongoDB)
  .then(() => console.log("MongoDB conectado!"))
  .catch((err) => console.error("Error conectando a MongoDB:", err));

// Middlewares Globales
app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "30mb" }));

// app.listen(PORT, () => {
//   console.log(
//     `Hello ${process.env.DB_USER}.Example app listening on port ${PORT}`,
//     process.env.CLOUDINARY_CLOUD_NAME
//   );
// });

// Rutas

app.use("/users", authMiddlewares.validateToken, userRouter);
app.use("/events", authMiddlewares.validateToken, eventRouter);
app.use("/reviews", authMiddlewares.validateToken, reviewRouter);
app.use("/images", authMiddlewares.validateToken, imageRouter);
app.use("/categories", authMiddlewares.validateToken, categoryRouter);
app.use("/cities", authMiddlewares.validateToken, citiesRouter);
app.use("/chats", authMiddlewares.validateToken, chatRouter);
app.use("/applications", applicationRouter);
app.use("/login", loginRouter);
app.use("/email", emailRouter);

// Ruta Default para Verificar Conexión
app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente.");
});

// Manejo de Errores
app.use((err, req, res, next) => {
  console.error("Error:", err.message || "Error desconocido.");
  res
    .status(err.status || 500)
    .json({ message: err.message || "Error del servidor." });
});

// Websockets
io.on("connection", (socket) => {
  console.log("Cliente conectado:", socket.id);

  // Recibir y reenviar mensajes
  socket.on("message", async (data) => {
    console.log("Mensaje recibido:", data);
    const { chatId, sender, content } = data;

    // Validar datos
    if (!chatId || !sender || !content) {
      console.error("Datos incompletos para guardar el mensaje");
      return;
    }

    try {
      // Guardar el mensaje usando SaveChats y obtener el nuevo mensaje
      const new_data = await SaveChats(data);
  
      // Verifica si el mensaje fue guardado correctamente
      if (!new_data) {
        console.error("No se pudo guardar el mensaje.");
        return;
      }
      console.log("Mensaje procesado y guardado:", new_data);

      // Emitir el mensaje a todos los clientes conectados
      io.emit("message", new_data);
      console.log("Mensaje guardado y enviado a los clientes:", new_data);
    } catch (error) {
      console.error("Error al guardar el mensaje:", error.message);
    }
  });

  // Manejo de desconexión
  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id);
  });
});

// Levantar el Servidor
server.listen(PORT, "127.0.0.1", () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
