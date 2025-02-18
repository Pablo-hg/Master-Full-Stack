import axios from "axios";
import { useEffect, useState } from "react";
import { IoSettingsOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
export const ModalSettings = ({ users, setUsers }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Estado para controlar la carga de los datos
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  // Verificación de userdata antes de renderizar
  console.log("Datos de usuario:", users);

  // Manejo del cambio en los campos de texto
  const handleInputChange = (e, field) => {
    setUsers((prevData) => ({
      ...prevData,
      [field]: e.target.value,
    }));
  };

  // Manejo de la imagen de perfil
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        setUsers((prevData) => ({
          ...prevData,
          avatar_image: reader.result, // Guarda en Base64
        }));
      };

      reader.readAsDataURL(file);
    }
  };

  // Cargar los datos del usuario cuando el componente se monta
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true); // Establece el estado de carga en true
        const response = await axios.get(
          `http://localhost:300/users/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Datos del usuario recibidos:", response.data);
        setUsers(response.data); // Establece los datos del usuario
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
      } finally {
        setIsLoading(false); // Establece el estado de carga en false una vez los datos estén listos
      }
    };

    fetchUserData();
  }, [userId, token, setUsers]);

  // Manejo de la actualización de los datos del perfil
  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:300/users/user/${userId}`,
        users,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Perfil actualizado con éxito");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
    }
  };

  return (
    <div>
      <IoSettingsOutline
        className="w-10 h-auto cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      />
      {isModalOpen && (
        <div style={modalBackdropStyles}>
          <div style={modalBoxStyles}>
            <div key={users.id}>
              <h3 style={modalHeaderStyles}>Datos del perfil</h3>

              {/* Verificación de los datos antes de mostrar */}
              {isLoading ? (
                <p>Cargando...</p> // Mensaje mientras se cargan los datos
              ) : (
                <>
                  <label>
                    <b>Nombre:</b>
                    <input
                      className="input-style"
                      style={inputStyles}
                      value={users?.name || ""} // Previene valores undefined
                      onChange={(e) => handleInputChange(e, "name")}
                    />
                  </label>
                  <label>
                    <b>Email:</b>
                    <input
                      className="input-style"
                      style={inputStyles}
                      value={users?.email || ""} // Previene valores undefined
                      onChange={(e) => handleInputChange(e, "email")}
                    />
                  </label>
                  <label>
                    <b>Ciudad:</b>
                    <input
                      className="input-style"
                      style={inputStyles}
                      value={users?.city || ""} // Previene valores undefined
                      onChange={(e) => handleInputChange(e, "city")}
                    />
                  </label>
                  <label>
                    <b>Dirección:</b>
                    <input
                      className="input-style"
                      style={inputStyles}
                      value={users?.direction || ""} // Previene valores undefined
                      onChange={(e) => handleInputChange(e, "direction")}
                    />
                  </label>
                  <label>
                    <b>Foto de perfil:</b>
                    <input type="file" onChange={handleImageChange} />
                  </label>
                </>
              )}

              <button style={buttonStyles} type="button" onClick={handleUpdate}>
                Actualizar
              </button>
            </div>

            <button
              style={closeButtonStyles}
              onClick={() => setIsModalOpen(false)}
            >
              Cerrar
            </button>

            <button
              style={buttonStyles}
              type="button"
              onClick={() => navigate("/logout")}
            >
              Cerrar sesión
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
  overflowY: "auto",
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
