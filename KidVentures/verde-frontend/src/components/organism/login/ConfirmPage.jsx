import axios from "axios"; // Importar axios
import { useEffect, useState } from "react"; // Importar useState y useEffect
import { useParams } from "react-router-dom"; // Para capturar el token desde la URL

const ConfirmPage = () => {
  const { token } = useParams(); // Captura el token de la URL
  const [buttonText, setButtonText] = useState("Cargando..."); // Estado para manejar el texto del botón

  // Función que maneja la validación del token
  const handleConfirm = async () => {
    try {
      const response = await axios.post(
        "http://localhost:300/email/confirm-user",
        { token }
      );

      // Si la respuesta es exitosa (200)
      if (response.status === 200) {
        setButtonText("Cuenta Confirmada"); // O usa la respuesta específica si es necesario
      }
    } catch (error) {
      // Si ocurre un error, puede ser por token expirado o inválido
      if (error.response && error.response.status === 400) {
        setButtonText(error.response.data.message); // Accede a message dentro de `data`
      } else {
        setButtonText("Error al confirmar el token"); // Mensaje genérico si no es un error 400
      }
    }
  };

  // Usamos useEffect para que la validación se ejecute nada más cargar el componente
  useEffect(() => {
    handleConfirm(); // Ejecuta la función de confirmación
  }, [token]); // Solo se ejecuta cuando el token cambia

  return (
    <div>
      <h1>Kidventures</h1>
      <button
        className={`btn ${
          buttonText === "Cuenta Confirmada" ? "btn-success" : "btn-error"
        }`}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default ConfirmPage;
