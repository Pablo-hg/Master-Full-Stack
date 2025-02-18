/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import "./ListTaskPage.css";

// Componente para mostrar cada tarea
const TaskItem = ({ task, onUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="task-item">
      <h3>{task.title}</h3>
      <p>ID: {task.task_id}</p>
      <p>Asignado a {task.assigned}</p>
      <p>Estado: {task.status}</p>
      <p>Fecha: {task.dueDate}</p>
      <button onClick={openModal}>Ver Detalles</button>

      {isModalOpen && (
        <Modal task={task} onClose={closeModal} onUpdate={onUpdate} />
      )}
    </div>
  );
};

// Componente Modal para editar tarea
const Modal = ({ task, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description,
    status: task.status,
    dueDate: task.dueDate,
    assigned: "pablo", // Opción por defecto
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/tasks/${task._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedTask = await response.json();
        onUpdate(updatedTask); // Llama a la función onUpdate para actualizar la tarea en el estado principal
        onClose(); // Cierra el modal
      } else {
        console.error("Error al actualizar la tarea");
      }
    } catch (err) {
      console.error("Error en la solicitud", err);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Editar Tarea</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Título:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Descripción:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Estado:</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="TODO">TODO</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="DONE">DONE</option>
            </select>
          </div>
          <div>
            <label>Fecha:</label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Asignado a:</label>
            <select
              name="assigned"
              value={formData.assigned}
              onChange={handleChange}
              required
            >
              <option value="Pablo">Pablo</option>
              <option value="Pepe">Pepe</option>
            </select>
          </div>
          <button type="submit">Guardar</button>
          <button type="button" onClick={onClose}>
            Cerrar
          </button>
        </form>
      </div>
    </div>
  );
};

// Componente Modal para crear nueva tarea
const CreateTaskModal = ({ onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "TODO", // Opción por defecto
    dueDate: "",
    assigned: "Pablo", // Opción por defecto
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/tasks/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newTask = await response.json();
        onCreate(newTask); // Llama a la función onCreate para añadir la nueva tarea al estado principal
        onClose(); // Cierra el modal
      } else {
        console.error("Error al crear la tarea");
      }
    } catch (err) {
      console.error("Error en la solicitud", err);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Crear Nueva Tarea</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Título:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Descripción:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Estado:</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="TODO">TODO</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="DONE">DONE</option>
            </select>
          </div>
          <div>
            <label>Fecha:</label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Asignado a:</label>
            <select
              name="assigned"
              value={formData.assigned}
              onChange={handleChange}
              required
            >
              <option value="Pablo">Pablo</option>
              <option value="Pepe">Pepe</option>
            </select>
          </div>
          <button type="submit">Crear</button>
          <button type="button" onClick={onClose}>
            Cerrar
          </button>
        </form>
      </div>
    </div>
  );
};

const ListTaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Filtros
  const [assignedFilter, setAssignedFilter] = useState("todos");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [searchTerm, setSearchTerm] = useState("");

  // Efecto para obtener las tareas cuando se carga el componente
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("http://localhost:3000/tasks/");
        if (!response.ok) {
          throw new Error("Error al obtener las tareas");
        }
        const data = await response.json();
        setTasks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleUpdate = (updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === updatedTask._id ? updatedTask : task
      )
    );
  };

  const handleCreate = (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesAssigned =
      assignedFilter === "todos" || task.assigned === assignedFilter;
    const matchesStatus =
      statusFilter === "todos" || task.status === statusFilter;
    const matchesSearchTerm =
      searchTerm === "" ||
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.task_id.toString() === searchTerm;

    return matchesAssigned && matchesStatus && matchesSearchTerm;
  });

  return (
    <div>
      <h2>List Task Page</h2>

      {/* Filtros */}
      <div className="filters">
        <label>Filtrar por asignado:</label>
        <select
          value={assignedFilter}
          onChange={(e) => setAssignedFilter(e.target.value)}
        >
          <option value="todos">Todos</option>
          <option value="Pablo">Pablo</option>
          <option value="Pepe">Pepe</option>
        </select>

        <label>Filtrar por estado:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="todos">Todos</option>
          <option value="TODO">TODO</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="DONE">DONE</option>
        </select>

        <label>Buscar:</label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por título o ID"
        />
      </div>

      <button onClick={() => setIsCreateModalOpen(true)}>
        Crear Nueva Tarea
      </button>
      {isCreateModalOpen && (
        <CreateTaskModal
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreate}
        />
      )}

      {filteredTasks.length === 0 ? (
        <p>No hay tareas disponibles.</p> // Mensaje si no hay tareas
      ) : (
        filteredTasks.map((task) => (
          <TaskItem key={task._id} task={task} onUpdate={handleUpdate} /> // Renderiza cada tarea
        ))
      )}
    </div>
  );
};

export default ListTaskPage;
