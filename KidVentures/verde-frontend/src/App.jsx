import axios from "axios";
import { useEffect, useState } from "react";

// Importar páginas y componentes
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ConfirmPage from "./components/organism/login/ConfirmPage";
import CreatePage from "./components/organism/login/CreatePage";
import HomePage from "./components/organism/login/HomePage";
import LoginPage from "./components/organism/login/LoginPage";
import CreateEventPage from "./components/organism/main/CreatEvent/CreateEventPage";
import DiscoverPage from "./components/organism/main/Discover/DiscoverPage";
import EventDetailsPage from "./components/organism/main/Events/EventDetailPage";
import EventsPage from "./components/organism/main/Events/EventsPage";
import ReviewPage from "./components/organism/main/Events/ReviewPage";
import EditReviewPage from "./components/organism/main/Profile/EditReviewPage";
import ChatPage from "./components/organism/main/Messages/ChatPage";
import EditEventPage from "./components/organism/main/Profile/EditEventPage";
import ProfilePage from "./components/organism/main/Profile/ProfilePage";
import MyProfilePage from "./components/organism/main/Profile/MyProfilePage";
import UserEventsListPage from "./components/organism/main/Profile/userEventsListPage";
import MessagesPage from "./components/organism/main/Messages/MessagesPage";

function App() {
  const [userLogged, setUserLogged] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Nuevo estado para la carga

  const getUser = () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    axios
      .get(`http://localhost:300/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUserLogged(response.data);
        localStorage.setItem("userLogged", JSON.stringify(response.data));
      })
      .catch((error) => {
        console.error("Error al obtener el usuario:", error);
        setUserLogged(false);
      })
      .finally(() => {
        setIsLoading(false); // Finaliza la carga
      });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("userLogged");

    if (token && storedUser) {
      setUserLogged(JSON.parse(storedUser));
      setIsLoading(false); // Si hay un usuario almacenado, finaliza la carga
    } else if (token) {
      getUser();
    } else {
      setIsLoading(false); // Si no hay token, finaliza la carga directamente
    }
  }, []);

  const borrarCache = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("userLogged");
    setUserLogged(null);
  };

  const Logout = () => {
    useEffect(() => {
      borrarCache();
    }, []);
    return <Navigate to="/" />;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Cargando...</p>
      </div>
    ); // Mostrar un spinner o mensaje mientras carga
  }

  return (
    <div className="container h-screen">
      <BrowserRouter>
        <Routes>
          {/* Rutas públicas */}
          {!userLogged ? (
            <>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage onLogin={getUser} />} />
              <Route path="/create" element={<CreatePage />} />
              <Route
                path="/email/confirm-user/:token"
                element={<ConfirmPage />}
              />
              {/* Redirigir a / si intenta acceder a una ruta privada sin estar autenticado */}
              <Route path="*" element={<Navigate to="/" />} />
            </>
          ) : (
            <>
              {/* Rutas privadas */}
              <Route path="/discover" element={<DiscoverPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/new" element={<CreateEventPage />} />
              <Route path="/profile" element={<MyProfilePage />} />
              <Route path="/profile/:userId" element={<ProfilePage />} />
              <Route path="/events/:eventId/edit" element={<EditEventPage />} />
              <Route path="/events/:eventId" element={<EventDetailsPage />} />
              <Route path="/events/list" element={<UserEventsListPage />} />
              <Route path="/reviews/events/:eventId" element={<ReviewPage />} />
              <Route path="/reviews/:reviewId/edit" element={<EditReviewPage />} />
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/chats" element={<ChatPage />} />
              {/* Redirigir a /discover si intenta acceder a una ruta inexistente estando autenticado */}
              <Route path="*" element={<Navigate to="/discover" />} />
            </>
          )}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
