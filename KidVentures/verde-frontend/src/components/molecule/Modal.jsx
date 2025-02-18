import { useState, useEffect } from "react";
import { CiEdit } from "react-icons/ci";
import axios from "axios";
export const Modal = () => {
  const [userdata, setUserData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true); // Carga inicial

  const getUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const strdUserId = localStorage.getItem("userId");

      if (!token) {
        setError("No se encontró el token en el localStorage.");
        return;
      }

      const response = await axios.get(
        `http://localhost:300/users/${strdUserId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUserData(response.data || []);
    } catch (err) {
      console.error("Error al obtener eventos:", err);
      setError("Hubo un error al obtener los eventos.");
    }
  };

  useEffect(() => {
    const fetchDataUser = async () => {
      await Promise.all([getUser()]);
      setLoadingUser(false);
    };
    fetchDataUser();
  }, []);
  if (loadingUser) {
    return <p>Cargando datos del usuario...</p>;
  }

  const handleInputChange = (e, field, id) => {
    setUserData((prevUserData) =>
      prevUserData.map((user) =>
        user.id === id ? { ...user, [field]: e.target.value } : user
      )
    );
  };

  return (
    <div>
      <CiEdit
        className="w-10 h-auto cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      />
      {isModalOpen && (
        <div style={modalBackdropStyles}>
          <div style={modalBoxStyles}>
            {userdata.map((usData) => (
              <div key={usData.id}>
                <h3 style={modalHeaderStyles}>Datos del perfil</h3>
                <label>
                  <b>Nombre:</b>
                  <input
                    className="input-style"
                    style={inputStyles}
                    value={usData.name}
                    onChange={(e) => handleInputChange(e, "name", usData.id)}
                  />
                </label>
                <label>
                  <b>Email:</b>
                  <input
                    className="input-style"
                    style={inputStyles}
                    value={usData.email}
                    onChange={(e) => handleInputChange(e, "email", usData.id)}
                  />
                </label>
                <label>
                  <b>Ciudad:</b>
                  <input
                    className="input-style"
                    style={inputStyles}
                    value={usData.city}
                    onChange={(e) => handleInputChange(e, "city", usData.id)}
                  />
                </label>
                <label>
                  <b>Dirección:</b>
                  <input
                    className="input-style"
                    style={inputStyles}
                    value={usData.direction}
                    onChange={(e) =>
                      handleInputChange(e, "direction", usData.id)
                    }
                  />
                </label>
                <label>
                  <b>Seguidores:</b>
                  <input
                    className="input-style"
                    style={inputStyles}
                    value={usData.followers}
                    onChange={(e) =>
                      handleInputChange(e, "direction", usData.id)
                    }
                  />
                </label>
                <label>
                  <b>Siguiedo:</b>
                  <input
                    className="input-style"
                    style={inputStyles}
                    value={usData.following}
                    onChange={(e) =>
                      handleInputChange(e, "direction", usData.id)
                    }
                  />
                </label>
                <button style={buttonStyles} type="submit">
                  Actualizar
                </button>
              </div>
            ))}
            <button
              style={closeButtonStyles}
              onClick={() => setIsModalOpen(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Estilos en línea para el modal
const modalBackdropStyles = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const modalBoxStyles = {
  backgroundColor: "white",
  borderRadius: "8px",
  padding: "20px",
  width: "400px",
  maxWidth: "90%",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  position: "relative",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const modalHeaderStyles = {
  fontSize: "1.5rem",
  fontWeight: "bold",
  marginBottom: "10px",
  color: "#333",
};

const inputStyles = {
  width: "100%",
  padding: "8px",
  marginBottom: "10px",
  borderRadius: "4px",
  border: "1px solid #ddd",
};

const buttonStyles = {
  padding: "10px",
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  marginTop: "10px",
};

const closeButtonStyles = {
  backgroundColor: "transparent",
  color: "#555",
  border: "none",
  fontSize: "1rem",
  cursor: "pointer",
  position: "absolute",
  top: "10px",
  right: "10px",
};
