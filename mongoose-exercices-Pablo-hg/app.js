const express = require("express");
const app = express();
const port = 8000;
app.use(express.json());

//con la siguente linea (e instalando "npm i dotenv"), podemos lleer la info de .env
require("dotenv").config();

// importamos mongoose
const mongoose = require("mongoose");
// creamos una constante que contiene una "url" con los datos del ".env"
const mongoDB =
  "mongodb+srv://" +
  process.env.DB_USER +
  ":" +
  process.env.DB_PASSWORD +
  "@" +
  process.env.DB_SERVER +
  "/" +
  process.env.DB_NAME +
  "?retryWrites=true&w=majority";
// console.log("Url de la base de datos:  " + mongoDB);

// ejecutamos la funcion asincrona llamada "main()",
// que va a estar esperando a que se conecte a "mongoose"
async function main() {
  await mongoose.connect(mongoDB);
  console.log("MongoDB conectado");
}
// si al conectar, a dado un error, lo imprimimos
main().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

var students = require("./routes/students");
app.use("/students", students);

var masters = require("./routes/masters");
app.use("/masters", masters);

app.listen(port, () => {
  // con "process.env.xxxx" podemos obtenemos las variables del archvo .env
  console.log(
    `Hello ${process.env.DB_USER} Example app listening on port ${port}`
  );
});
