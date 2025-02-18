import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {getReviewById, updateReview, deleteReview } from "../../../../services/reviewService";

const EditReviewPage = () => {
  const { reviewId } = useParams();  // Obtener el reviewId de la URL
  const navigate = useNavigate();

  const [review, setReview] = useState({ description: "", score: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const fetchedReview = await getReviewById(reviewId);
        setReview(fetchedReview);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReview();
  }, [reviewId]);

  const handleUpdate = async () => {
    try {
      await updateReview(reviewId, review);
      navigate(`/reviews/${reviewId}`);
    } catch (error) {
      setError("Error al actualizar la reseña.");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteReview(reviewId);
      navigate("/reviews"); // Redirige a la lista de reseñas
    } catch (error) {
      setError("Error al eliminar la reseña.");
    }
  };

  return (
    <div className="edit-review-page">
      <h1>Editar Reseña</h1>

      {loading ? (
        <p>Cargando reseña...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div>
          <div>
            <label>Comentario:</label>
            <textarea
              value={review.description}
              onChange={(e) => setReview({ ...review, description: e.target.value })}
            ></textarea>
          </div>
          <div>
            <label>Puntuación:</label>
            <input
              type="number"
              value={review.score}
              onChange={(e) => setReview({ ...review, score: e.target.value })}
              min="0"
              max="5"
            />
          </div>

          <button onClick={handleUpdate}>Actualizar Reseña</button>
          <button onClick={handleDelete} className="text-red-500">Eliminar Reseña</button>
        </div>
      )}
    </div>
  );
};

export default EditReviewPage;
