const Task = require("../models/task.model");

function createTask(req, res) {
  console.log("REQ.BODY: ", req.body);

  // Buscamos el último task_id
  Task.findOne()
    .sort({ task_id: -1 })
    .then((lastTask) => {
      // Calcular el nuevo task_id
      const newTaskId = lastTask ? lastTask.task_id + 1 : 1;
      // rellenamos la task con todos los datos
      const newTask = {
        task_id: newTaskId,
        title: req.body.title,
        description: req.body.description,
        status: req.body.status,
        dueDate: req.body.dueDate,
        assigned: req.body.assigned,
        createdAt: Date.now(),
        modifiedAt: Date.now(),
      };
      return Task.create(newTask);
    })
    // Tras crear la task, mandamos el mensaje
    .then((taskDoc) => {
      console.log(`Tarea creada con éxito: ${taskDoc}`);
      res.status(201).send(taskDoc);
    })
    .catch((err) => {
      console.log(`Error al crear una tarea: ${err}`);
      res
        .status(500)
        .send({ error: `Error al crear una tarea: ${err.message}` });
    });
}

function listTask(req, res) {
  Task.find()
    .then((taskDocs) => {
      console.log("Found this: ", taskDocs);
      res.send(taskDocs);
    })
    .catch((err) => console.log("Error al obtener las tareas: ", err));
}

function UpdateTask(req, res) {
  const task_id = { task_id: req.params.id };
  const { title, description, status, dueDate, assigned } = req.body;
  Task.findOneAndUpdate(
    task_id,
    { title, description, status, dueDate, assigned },
    { new: true }
  )
    .then((updatedTask) => {
      if (updatedTask === null) {
        console.log("Task no encontrado");
        res.status(404).send("Task no encontrado");
      } else {
        console.log("Tarea actualizada: ", updatedTask);
        res.status(200).send(updatedTask);
      }
    })
    .catch((err) => {
      console.log("Error al actualziar la tarea: ", err);
      res.status(500).send("Error al actualziar la tarea");
    });
}

const taskController = {
  getTasksList: (req, res) => {
    console.log("llamada a getTasksList");

    // Filtramos las tareas que no tienen el estado 'DONE'
    let filteredTasks = tasks.filter((task) => task.status !== "DONE");

    // Retornamos la lista filtrada de tareas con un estado 200 (OK)
    res.status(200).json(filteredTasks);
  },

  getTasksInfo: (req, res) => {
    console.log("llamada a getTasksInfo");
    // Comprobamos si el ID proporcionado existe en el array de tareas
    if (req.params.id < tasks.length) {
      const task = tasks[req.params.id]; // Obtiene la tarea correspondiente al ID
      const user = users.find((user) => user.id === task.user); // Busca el usuario asociado a la tarea
      if (user === undefined) {
        // Si el usuario no existe, devuelve un error 403
        res.status(403).json({
          msg: "Forbidden",
        });
      } else {
        // Si el usuario existe, devuelve la tarea correspondiente
        res.status(200).json(tasks[req.params.id]);
      }
    } else {
      // Si el ID no existe, respondemos con un código 404 (No encontrado)
      res.status(404).json({
        msg: "Task not found",
      });
    }
  },

  putTaskUpdate: (req, res) => {
    console.log("llamada a putTaskUpdate");
    const taskId = req.params.id; // Obtiene el ID de la tarea a actualizar
    if (taskId < tasks.length) {
      const task = tasks[taskId]; // Obtiene la tarea correspondiente al ID
      const user = users.find((user) => user.id === task.user); // Busca el usuario asociado a la tarea
      if (user === undefined) {
        // Si el usuario no existe, devuelve un error 403
        res.status(403).json({
          msg: "Forbidden",
        });
      } else {
        // Desestructura los parámetros enviados en la solicitud
        const { title, description, dueDate, status } = req.body;
        const values = [
          { name: "title", value: title },
          { name: "description", value: description },
          { name: "dueDate", value: dueDate },
          { name: "status", value: status },
        ];
        // Filtra los parámetros que faltan
        const missingParams = values
          .filter((param) => param.value === undefined)
          .map((param) => `'${param.name}'`);

        // Si faltan parámetros, devuelve un error 400
        if (missingParams.length > 0) {
          res.status(400).json({
            msg: `You missed parameters: 'id' or ${missingParams.join(" or ")}`,
          });
        } else {
          // Actualiza los valores de la tarea
          tasks[taskId].title = title;
          tasks[taskId].description = description;
          tasks[taskId].dueDate = dueDate;
          tasks[taskId].status = status;
          // Devuelve un mensaje de éxito
          res.status(200).json({
            msg: "Task updated",
          });
        }
      }
    } else {
      // Si el ID no existe, respondemos con un código 404 (No encontrado)
      res.status(404).json({
        msg: "Task not found",
      });
    }
    // console.log(tasks);
  },

  deleteTask: (req, res) => {
    console.log("llamada a deleteTask");
    let copiaDeTasks = [...tasks]; // Crea una copia del array de tareas
    const taskId = req.params.id; // Obtiene el ID de la tarea a eliminar
    if (taskId < tasks.length) {
      const task = tasks[taskId]; // Obtiene la tarea correspondiente al ID
      const user = users.find((user) => user.id === task.user); // Busca el usuario asociado a la tarea
      if (user === undefined) {
        // Si el usuario no existe, devuelve un error 403
        res.status(403).json({
          msg: "Forbidden",
        });
      } else {
        // Filtra y elimina la tarea de la copia
        copiaDeTasks = copiaDeTasks.filter((task) => task.id !== taskId);
        res.status(200).json({
          msg: "Task removed successfully", // Mensaje de éxito
        });
      }
    } else {
      // Si el ID no existe, respondemos con un código 404 (No encontrado)
      res.status(404).json({
        msg: "Task not found",
      });
    }
  },

  postTask: (req, res) => {
    console.log("llamada a postTask");
    let copiaDeTasks = [...tasks]; // Crea una copia del array de tareas
    const { title, description, dueDate } = req.body; // Obtiene los datos de la nueva tarea
    const values = [
      { name: "title", value: title },
      { name: "description", value: description },
      { name: "dueDate", value: dueDate },
    ];
    // Filtra los parámetros que faltan
    const missingParams = values
      .filter((param) => param.value === undefined)
      .map((param) => `${param.name}`);

    // Si falta el título, devuelve un error 400
    if (missingParams.length > 0 && missingParams.includes("title")) {
      res.status(400).json({
        msg: "You missed parameter 'title'",
        missingParameters: missingParams, // Lista de parámetros faltantes
      });
    } else {
      // Crea un nuevo objeto de tarea
      const newTask = {
        id: copiaDeTasks.length.toString(), // Asigna un ID único basado en la longitud del array
        title: req.body.title,
        description: req.body.description,
        dueDate: req.body.dueDate,
      };
      copiaDeTasks.push(newTask); // Añade la nueva tarea a la copia
      res.status(201).json({
        msg: "Task created",
        id: newTask.id, // Devuelve el ID de la nueva tarea
      });
    }
  },

  patchTaskMark: (req, res) => {
    console.log("llamada a patchTaskMark");
    const taskId = req.params.id; // Obtiene el ID de la tarea a marcar
    if (taskId === undefined) {
      // Si no se proporciona el ID, devuelve un error 400
      res.status(400).json({
        msg: "Missing parameter: id",
      });
    } else {
      // Verifica si el ID existe en el array de tareas
      if (taskId < tasks.length) {
        const task = tasks[taskId]; // Obtiene la tarea correspondiente al ID
        const user = users.find((user) => user.id === task.user); // Busca el usuario asociado a la tarea
        if (user === undefined) {
          // Si el usuario no existe, devuelve un error 403
          res.status(403).json({
            msg: "Forbidden",
          });
        } else {
          // Marca la tarea como completada
          tasks[req.params.id].status = "DONE";
          res.status(200).json({
            msg: "Task marked as completed",
          });
        }
      } else {
        // Si el ID no existe, respondemos con un código 404 (No encontrado)
        res.status(404).json({
          msg: "Task not found",
        });
      }
    }
    // console.log(tasks); // Puedes descomentar para ver la lista de tareas actualizada
  },
};

module.exports = {
  taskController,
  createTask,
  listTask,
  UpdateTask,
};
