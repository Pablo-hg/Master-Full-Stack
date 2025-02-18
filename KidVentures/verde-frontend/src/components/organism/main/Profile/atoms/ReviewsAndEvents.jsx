import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUserEvents } from "../../../../../services/usersService";
import { getUserReviews } from "../../../../../services/reviewService";

const ReviewsandEvents = () => {
  const [loading, setLoading] = useState(true);
  const [userEvents, setUserEvents] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) throw new Error("El usuario no está autenticado.");

        setLoading(true);

        const events = await getUserEvents(userId);
        setUserEvents(events);

        const reviews = await getUserReviews(userId);
        setUserReviews(reviews);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const renderUserEvents = () => {
    if (loading) return <p>Cargando eventos...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;
    if (userEvents.length === 0) return <p>No has creado eventos todavía.</p>;

    return (
      <>
        <div className="events-list mt-4 flex flex-col gap-4">
          {userEvents.slice(0, 2).map((event) => (
            <div key={event.id || event._id} className="relative">
              <Link
                to={`/events/${event.id || event._id}`}
                className="card bg-base-200 p-4 rounded-lg shadow-md flex justify-between items-center"
              >
                <div>
                  <h5 className="font-bold">{event.name}</h5>
                  <p className="text-sm">{event.description}</p>
                </div>
              </Link>
              <Link
                to={`/events/${event.id || event._id}/edit`}
                className="absolute top-2 right-2 text-blue-500 cursor-pointer"
              >
                Editar
              </Link>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link to="/events/list" className="text-blue-600 hover:underline text-sm">
            Todos mis eventos
          </Link>
        </div>
      </>
    );
  };

  const renderUserReviews = () => {
    if (loading) return <p>Cargando reseñas...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;
    if (Array.isArray(userReviews) && userReviews.length === 0)
      return <p>No has dejado reseñas todavía.</p>;

    return (
      <div className="reviews-list mt-4 flex flex-col gap-4 mb-10">
        {userReviews.slice(0, 2).map((review) => {
           
          return (
            <div key={review.id || review._id} className="relative">
              <Link
                to={`/events/${review.eventId}`}
                className="card bg-base-200 p-4 rounded-lg shadow-md flex justify-between items-center"
              >
                <div>
                  
                  <p className="text-sm italic mr-6">
                    &quot;{review.description.slice(0, 40)}
                    {review.description.length > 40
                     ? "..." : ""}&quot;
                  </p>
                </div>
              </Link>
              <Link
                to={`/reviews/${review.id || review._id}/edit`}
                className="absolute top-2 right-2 text-blue-500 cursor-pointer mb-3 ml-6"
              >
                Editar
              </Link>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="reviews-and-events">
      <div className="events-created mt-8 mb-6">
        <h4 className="text-xl font-bold">Mis Eventos Creados</h4>
        {renderUserEvents()}
      </div>

      <div className="reviews mt-0 mb-20">
        <h4 className="text-xl font-bold">Mis Reseñas</h4>
        {renderUserReviews()}
      </div>
    </div>
  );
};

export default ReviewsandEvents;