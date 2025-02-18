const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

// const cors = require("cors");
// app.use(cors({ origin: "http://localhost:5173" }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Permite cualquier origen
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

require("dotenv").config();

const mongoose = require("mongoose");
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

async function main() {
  await mongoose.connect(mongoDB);
  console.log("MongoDB conectado");
}
main().catch((err) => console.log(err));

var tasks = require("./routes/tasks.js");
app.use("/tasks", tasks);

var users = require("./routes/users.js");
app.use("/user", users);

app.listen(port, () => {
  // con "process.env.xxxx" podemos obtenemos las variables del archvo .env
  console.log(
    `Hello ${process.env.DB_USER} Example app listening on port ${port}`
  );
});
