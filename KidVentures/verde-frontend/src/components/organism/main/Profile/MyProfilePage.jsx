import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CgProfile } from "react-icons/cg";
/* import { GoPlus } from "react-icons/go";
 */ import {
  MdAlternateEmail,
  MdLocationOn,
  MdOutlineSportsSoccer
} from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import { MainMenu } from "../../../molecule/MainMenu";
import { ModalSettings } from "../../../molecule/ModalSettings";
import ReviewsandEvents from "./atoms/ReviewsAndEvents";

const ProfilePage = () => {
  const [events, setEvents] = useState([]);
  const [userdata, setUserData] = useState([]);
  const [users, setUsers] = useState({ interests: [] });
  const [editingInterest, setEditingInterest] = useState(null);
  const [updatedInterest, setUpdatedInterest] = useState("");
  const [error, setError] = useState(null);
  const { handleSubmit } = useForm();
  const [selectedInterest, setSelectedInterest] = useState("");
  const [intereses, setInterests] = useState([]);
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const { userIdnormal } = useParams();

  const authUser = JSON.parse(localStorage.getItem("authUser")); // Simula la autenticación
  const userId = authUser?.id; // Obtén el ID del usuario autenticado
  console.log(`ID del usuario autenticado: ${userId}`);

  const API_URL = "http://localhost:300";
  

  //console.log("userId", userId);
  /*   const [loading, setLoading] = useState(false); // Estado para indicar si está cargando
   */
  // Obtener los eventos creados por el usuario

  //Modify the getFollowers function
  const getFollowers = async () => {
    try {
      const token = localStorage.getItem("token");
      const strdUserId = localStorage.getItem("userId");
      if (!token || !strdUserId)
        throw new Error("Falta información de sesión.");

      const response = await axios.get(`${API_URL}/users/${strdUserId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const followerIds = response.data?.followers || [];
      console.log("Followers obtenidos:", followerIds);

      const followersData = await Promise.all(
        followerIds.map(async (followerId) => {
          try {
            const res = await axios.get(`${API_URL}/users/${followerId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            return res.data;
          } catch (error) {
            console.error(`Error buscando el usuario ${followerId}:`, error);
            return null;
          }
        })
      );

      const filteredFollowers = followersData.filter((data) => data !== null);
      setFollowers(filteredFollowers);
      setFollowersCount(filteredFollowers.length); // Add counter update
    } catch (err) {
      console.error("Error al obtener followers:", err);
      throw new Error("Hubo un error al obtener los followers.");
    }
  };

  // Modify the getFollowing function
  const getFollowing = async () => {
    try {
      const token = localStorage.getItem("token");
      const strdUserId = localStorage.getItem("userId");
      if (!token || !strdUserId)
        throw new Error("Falta información de sesión.");

      const response = await axios.get(`${API_URL}/users/${strdUserId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const followingIds = response.data?.following || [];
      console.log("Following obtenidos:", followingIds);

      const followingData = await Promise.all(
        followingIds.map(async (followerId) => {
          try {
            const res = await axios.get(`${API_URL}/users/${followerId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            return res.data;
          } catch (error) {
            console.error(`Error buscando el usuario ${followerId}:`, error);
            return null;
          }
        })
      );

      const filteredFollowing = followingData.filter((data) => data !== null);
      setFollowing(filteredFollowing);
      setFollowingCount(filteredFollowing.length); // Add counter update
    } catch (err) {
      console.error("Error al obtener following:", err);
      throw new Error("Hubo un error al obtener los following.");
    }
  };


  const getUserEvents = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token)
        throw new Error("No se encontró el token en el localStorage.");

      const response = await axios.get(`${API_URL}/events`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEvents(response.data || []);
    } catch (err) {
      console.error("Error al obtener eventos:", err);
      setError("Hubo un error al obtener los eventos.");
    }
  };
  const strdUserId = localStorage.getItem("userId");
  //Merge a main
  //Cambiar a main y hacer un pull
  //Resolver conflictos
  //Instalar dependencias nuevas
  console.log(`URL generada: /users/${userIdnormal}`);
  console.log(strdUserId);
  console.log(`${API_URL}/users/${strdUserId}`);
  // Obtener los datos del usuario
  const getUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const strdUserId = localStorage.getItem("userId");
      if (!token || !strdUserId)
        throw new Error("Falta información de sesión.");

      const response = await axios.get(`${API_URL}/users/${strdUserId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(response.data || { interests: [] });
    } catch (err) {
      console.error("Error al obtener el usuario:", err);
      setError("Hubo un error al obtener el usuario.");
    }
  };

  const addInterest = async (/* formData */) => {
    //Usar selectedInterest para obtener valor seleccionado
    console.log(selectedInterest);
    //console.log("Se añade el interés", formData.NewInterest);
    /*   if (!selectedInterest.trim()) {
      setError("El campo de interés no puede estar vacío.");
      return;
    } */

    try {
      const token = localStorage.getItem("token");
      const strdUserId = localStorage.getItem("userId");

      if (!token || !strdUserId)
        throw new Error("Falta información de sesión.");
      console.log("Datos obtenidos correctamente");

      const response = await fetch(`${API_URL}/users/${strdUserId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          interests: [selectedInterest],
        }),
      });
      //setNewInterest(""); // Limpia el campo de interés
      if (response.ok) {
        const updatedUser = await response.json();
        setUsers((prevUsers) => ({
          ...prevUsers,
          interests: updatedUser.interests,
        }));
        console.log("Interés añadido exitosamente:", updatedUser.interests);
      } else {
        setError("No se pudo añadir el interés. Inténtalo nuevamente.");
      }
    } catch (err) {
      console.error("Error al añadir el interés:", err);
      setError("Hubo un error al añadir el interés.");
    }
  };

  const token = localStorage.getItem("token");

  console.log(token);

  // Eliminar un interés
  const removeInterest = async (interestToRemove) => {
    console.log("Entra en el delete");
    console.log("Eventos delete " + interestToRemove);
    try {
      const token = localStorage.getItem("token");
      const strdUserId = localStorage.getItem("userId");
      console.log("usrId asignado " + strdUserId);
      if (!token || !strdUserId) {
        throw new Error("Falta información de sesión.");
      }
      console.log("Intereses delete " + interestToRemove);
      console.log(`${API_URL}/users/rmInterest/${strdUserId}`);
      //Unauthorized
      const response = await axios.put(
        `${API_URL}/users/rmInterest/${strdUserId}`,
        { interestToRemove }, // El cuerpo de la solicitud
        {
          headers: { Authorization: `Bearer ${token}` }, // Encabezados
        }
      );

      console.log("Response " + response);
      if (response.status === 200) {
        setUsers((prevUser) => ({
          ...prevUser,
          interests: prevUser.interests.filter(
            (interest) => interest !== interestToRemove
          ),
        }));
      }
    } catch (err) {
      console.error("Error al eliminar el interés:", err);
      setError("Hubo un error al eliminar el interés.");
    }
  };
  const getInterestName = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token)
        throw new Error("No se encontró el token en el localStorage.");

      const response = await axios.get(`${API_URL}/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setInterests(response.data);

      console.log(response.data);
    } catch (err) {
      console.error("Error al obtener eventos:", err);
      setError("Hubo un error al obtener los eventos.");
    }
  };
  // Llamadas iniciales al montar el componente

  {
    /*Handle remove*/
  }
  const handleRemoveFollowing = async (followerId) => {
    console.log("Entra en el handleRemoveFollowing " + followerId);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No se encontró el token en el localStorage.");
      }

      const currentUserId = localStorage.getItem("userId");
      const response = await axios.put(
        `${API_URL}/users/removeFollower/${currentUserId}`,
        { unfollowId: followerId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        setFollowing(following.filter((f) => f.id !== followerId));
        console.log("Usuario eliminado de seguidos");
      }
    } catch (err) {
      console.error("Error al eliminar seguidor:", err);
      setError("Hubo un error al eliminar el seguidor.");
    }
  };
  const handleRemoveFollower = async (idToRemove) => {
    const token = localStorage.getItem("token");
    const strdUserId = localStorage.getItem("userId");
    console.log("Selected follower ID to remove: ", idToRemove);
    try {
      const response = await axios.put(
        `${API_URL}/users/removeFollower/${strdUserId}`,
        {
          followerId: idToRemove,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setFollowing((prevFollowing) =>
          prevFollowing.filter((follower) => follower._id !== idToRemove)
        );
      }
    } catch (error) {
      console.error("Error removing follower:", error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        getUser(),
        getUserEvents(),
        getInterestName(),
        getFollowers(),
        getFollowing(),
      ]);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:300/users/${userIdnormal}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserData(response.data); // Guarda los datos del usuario
        console.log(response.data, "user data");
      } catch (error) {
        console.error("Error al obtener los usuarios:", error);
      }
    };

    if (token) {
      fetchUserData();
    } else {
      console.error("No se encontró un token de autorización.");
    }
  }, []);

  return (
    <div className="p-4">
      <div className="flex justify-end">
        <ModalSettings userdata={userdata} setUserData={setUserData} />
        {/* <Modal /> */}
      </div>
      <div className="flex align-baseline justify-center">
        <div className="avatar">
          <div className="h-40 w-40 rounded-full bg-gray-300 text-slate-700 overflow-hidden flex justify-center items-center">
            {userdata.avatar_image?.startsWith("data:image") ? (
              <img src={userdata.avatar_image} alt="avatar" />
            ) : (
              <CgProfile className="h-40 w-40" />
            )}
          </div>
        </div>
      </div>

      {/* Información del usuario */}
      {users && users.interests ? (
        <>
          <div className="info-user mt-3">
            <h3 className="text-center">{users.name}</h3>
            <div className="direccion flex items-center justify-center">
              <MdAlternateEmail />
              <span>{users.email}</span>
            </div>
            <div className="direccion flex items-center justify-center">
              <MdLocationOn />
              <span>
                {users.city}, {users.direction}
              </span>
            </div>
          </div>
          {/*El usuario que estas a punto de seguir se obtiene desde la url
          Modificar rutas para permitirlo 
          Investigar pasar id por parametro en url para obtener datos en función de id de url
          En el body del endpoint req.params para recuperar lo que has escrito en la url
          crear endpoint para recibir un id des del front como parametro de la base de datos 
          en el momento en que se hace click en seguir y dejar de seguir
          router.get("/:id", studentController.getStundet); en router para recuperr lo que se ha puesto en la url
          function getStundet(req, res) {
  Student.findById(req.params.id)
    .then((studentDoc) => {
      if (studentDoc === null) {
        console.log("Usuario no encontrado");
        res.send("Usuario no encontrado");
      } else {
        console.log("Found this student by their ID: ", studentDoc);
        res.send(studentDoc);
      }
    })
    .catch((err) => {
      console.log("Error while getting the student: ", err);
      res.send("ERROR", err);
    });
}*/}
          <div>
            {/* Pendiente de testeo*/}
            <p>Seguidores: {followersCount}</p>
            <p>Siguiendo: {followingCount}</p>
          </div>
          {/*  <button className="btn btn-danger btn-sm">Seguir</button>
          <br /> */}
          {/*           <button className="btn btn-danger btn-sm">Dejar de seguir</button>
           */}{" "}
           {/* Following y Followers */}
  <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
    <h2 className="text-lg font-semibold text-gray-800 mb-4">Siguiendo</h2>
    <ul className="divide-y divide-gray-200">
      {following.map((follower) => (
        <li key={follower.id} className="py-3 flex justify-between items-center">
          <Link
            to={`/profile/${follower._id}`}
            className="text-gray-800 font-medium hover:text-blue-500 transition-all"
          >
            {follower.name}
          </Link>
          <button
            type="submit"
            name="remove"
            onClick={() => handleRemoveFollowing(follower._id)}
            className="text-red-500 hover:underline text-sm"
          >
            Dejar de seguir
          </button>
        </li>
      ))}
    </ul>

    <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-4">Seguudores</h2>
    <ul className="divide-y divide-gray-200">
      {followers.map((follower) => (
        <li key={follower._id} className="py-3 flex justify-between items-center">
          <Link
            to={`/profile/${follower._id}`}
            className="text-gray-800 font-medium hover:text-gray-500 transition-all"
          >
            {follower.name}
          </Link>
          <button
            type="submit"
            name="remove"
            onClick={() => handleRemoveFollower(follower._id)}
            className="text-red-500 hover:underline text-sm"
          >
            Eliminar
          </button>
        </li>
      ))}
    </ul>
  </div>


          {/* Intereses del usuario */}
          <div className="interests mb-2">
            <h4>Intereses</h4>
            <form
              onSubmit={handleSubmit((data, event) => {
                // Diferenciar las acciones según el botón presionado
                const action = event.nativeEvent.submitter.name;
                const interest = event.nativeEvent.submitter.value;
                if (action === "remove") {
                  removeInterest(interest);
                } /* else if (action === "edit") {
                  editInterest(interest);
                } */
              })}
            >
              <div className="list mt-5 flex flex-wrap gap-3">
                {users.interests.map((interest, index) => (
                  <div key={index} className="flex items-center gap-2">
                    {editingInterest === interest ? (
                      <>
                        <input
                          type="text"
                          value={updatedInterest}
                          onChange={(e) => setUpdatedInterest(e.target.value)}
                          className="input input-bordered"
                        />

                        <button
                          type="button"
                          onClick={() => setEditingInterest(null)}
                          className="btn btn-secondary btn-sm"
                        >
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="btn rounded-full btn-primary">
                          <MdOutlineSportsSoccer className="w-5 h-auto" />
                          {interest}
                          {/*                           <GoPlus />
                           */}{" "}
                        </button>

                        <button
                          type="submit"
                          name="remove"
                          value={interest}
                          className="btn btn-danger btn-sm"
                        >
                          Eliminar
                        </button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </form>
          </div>
        </>
      ) : (
        <p style={{ color: "red" }}>
          {error || "No se encontraron datos del usuario."}
        </p>
      )}
      {/*---------------------------------------------------*/}
      {/*Obtener lista de personas que sigues */}
      {/* <div>
        <h2>Lista de Personas que Sigues</h2>
        {following.length > 0 ? (
          <ul>
            {following.map((user, index) => (
              <li key={index}>{user.username || user.name}</li> // Muestra el nombre o username
            ))}
          </ul>
        ) : (
          <p>No estás siguiendo a nadie aún.</p>
        )}
      </div>{" "} */}
      {/*--------------------------------------------------------------- */}
      {/*Obtener la lista de seguidores */}
      {/* <div>
        <h2>Lista de Seguidores</h2>
        {error && <p>{error}</p>}
        {followers.length > 0 ? (
          <ul>
            {followers.map((user, index) => (
              <li key={index}>{user.username || user.name}</li> // Muestra el nombre o username
            ))}
          </ul>
        ) : (
          <p>No tienes seguidores aún.</p>
        )}
      </div>{" "} */}

      {/* Formulario para añadir interés */}
<h2 className="text-xl font-bold mb-4">Añadir Interés</h2>
<form onSubmit={handleSubmit(addInterest)} className="bg-base-200 p-4 rounded-lg shadow-md">
  <div className="mb-4">
    <label htmlFor="interestSelect" className="block text-gray-700 font-medium mb-2">
      Selecciona un interés:
    </label>
    <select
      id="interestSelect"
      value={selectedInterest}
      onChange={(e) => setSelectedInterest(e.target.value)}
      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="">-- Selecciona un interés --</option>
      {intereses.map((interest, index) => (
        <option key={index} value={interest}>
          {interest}
        </option>
      ))}
    </select>
  </div>
  {error && <p className="text-red-500 mb-4">{error}</p>}
  
  <button
    type="submit"
    className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2  focus:ring-blue-500 active:bg-blue-400 transition duration-200"
  >
    Añadir
  </button>
</form>

      {/* Formulario para añadir interés */}
      {/*  <h2>Añadir Interés</h2>
      <form onSubmit={handleSubmit(addInterest)}>
        <label htmlFor="interestInput">Nuevo Interés:</label>
        <input type="text" {...register("NewInterest")} />
        <button type="submit">Añadir</button>
      </form> */}


      <ReviewsandEvents />
      <MainMenu />
    </div>
  );
};

export default ProfilePage;
