import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { postReview } from "../../../../services/reviewService";
import { AiOutlineComment} from "react-icons/ai";
import { MainMenu } from "../../../molecule/MainMenu";

const ReviewPage = () => {
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const { eventId } = useParams();
  const [description, setDescription] = useState("");
  const [score, setScore] = useState(1);
  

  const showPopupWithTimeout = (message) => {
    console.log("Mostrando popup con mensaje:", message); 
    setPopupMessage(message);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Formulario de reseñas enviado."); // Log para confirmar el envío del formulario
    console.log("Datos del formulario antes de enviar:", { description, score });
   
    try {
      console.log("Datos de la reseña antes de enviarlos:", { description, score });
      const reviewData = { description, score };
      console.log("Enviando reseña con estos datos:", reviewData);

      // Llamamos a la función para agregar la reseña
      const response = await postReview(reviewData, eventId);
      console.log("Respuesta del servidor después de enviar la reseña :", response);
      
      showPopupWithTimeout("Comentario agregado exitosamente.");
      setDescription("");
      setScore("");
    } catch (error) {
      console.error("Error al enviar el comentario:", error.message);
      console.error("Detalles del error:", error);
      showPopupWithTimeout("Error al enviar el comentario.");
    }
  };

  return (
    <div className="review-page mt-8 mb-40 px-4">
      {/* Título con ícono */}
      <div className="flex items-center mb-6">
        <AiOutlineComment size={28} className="text-blue-500" />
        <h2 className="text-2xl font-bold ml-2">Deja tu comentario</h2>
      </div>

      {/* Tarjeta de formulario */}
      <div className="card bg-white p-6 rounded-xl shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Escribe tu comentario..."
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
          <div>
            <label
              htmlFor="score"
              className="block text-sm font-medium text-gray-700"
            >
              Calificación (1-5)
            </label>
            <input
              type="number"
              id="score"
              value={score}
              onChange={(e) => {
                const value = e.target.value;

                if (value === "") {
                  setScore(""); // Permite borrar el input
                  return;
                }

                const numberValue = Math.max(1, Math.min(5, Number(value))); // Asegura que esté entre 1 y 5
                setScore(numberValue);
              }}
              min="1"
              max="5"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-all"
          >
            Enviar
          </button>
        </form>
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="fixed bottom-50 right-10 bg-blue-500 text-white p-3 rounded-lg shadow-lg z-50">
          {popupMessage}
        </div>
      )}

    <MainMenu/>
      
    </div>
  );
};

export default ReviewPage;

