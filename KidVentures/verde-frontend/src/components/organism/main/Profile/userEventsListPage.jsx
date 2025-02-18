import { useEffect, useState } from "react";
import { getUserEvents } from "../../../../services/usersService"; 
import { Link } from "react-router-dom";
import { MainMenu } from "../../../molecule/MainMenu";

const UserEventsListPage = () => {
  const [userEvents, setUserEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem("userId"); 

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const events = await getUserEvents(userId);
        setUserEvents(events);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [userId]);

  if (loading) return <p>Cargando eventos...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="flex items-center mb-2 p-2">
        <h4 className="text-2xl font-bold mb-0 px-4">Mis Eventos</h4>
      </div>

      {/* Lista de eventos */}
      <div className="flex-1 space-y-4 max-w-4xl mx-auto w-full overflow-y-auto pb-20 px-4">
        {userEvents.length === 0 ? (
          <p>No tienes eventos creados o en los que participes.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userEvents.map((event) => (
              <div
                key={event.id || event._id}
                className="p-4 border rounded-xl shadow relative hover:bg-gray-50 transition duration-300"
              >
                <h2 className="text-xl font-bold">{event.title}</h2>
                <p className="text-sm text-gray-600 mt-2">{event.description}</p>

                {/* Botón para editar el evento */}
                <Link
                  to={`/events/${event.id || event._id}/edit`}
                  className="text-blue-500 mt-2 inline-block hover:underline"
                >
                  Editar
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Menú Principal */}
      <MainMenu className="fixed bottom-0 left-0 w-full" />
    </div>
  );
};

export default UserEventsListPage;