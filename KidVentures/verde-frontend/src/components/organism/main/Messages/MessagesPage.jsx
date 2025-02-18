import { useNavigate } from "react-router-dom";
import { MainMenu } from "../../../molecule/MainMenu";

const MessagesPage = () => {
  const navigate = useNavigate();

  return (
    <div className="grid h-[calc(100vh-80px)] p-4 bg-gray-100 pt-2">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Chats</h1>

      {/* Mensaje de bienvenida con botón */}
      <div className="text-center mb-6">
        <p className="text-3xl font-extrabold text-gray-800 mb-4">
          <span className="block bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            ¡Conéctate con los participantes
          </span>
          <span className="block bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            de los eventos a los que vas a ir!
          </span>
        </p>
        <button
          className="px-8 py-4 bg-blue-500 text-white font-medium text-lg rounded-lg hover:bg-blue-600 shadow-md transition duration-300"
          onClick={() => navigate("/chats")}
        >
          Ir a Chats
        </button>
      </div>

      {/* Banner motivacional */}
      <div className="p-6 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-2">¡Mantente conectado!</h2>
        <p className="text-base">
          Aquí podrás encontrar todas tus conversaciones y gestionar tus
          mensajes fácilmente.
        </p>
      </div>

      {/* Menú principal */}
      <MainMenu />
    </div>
  );
};

export default MessagesPage;


