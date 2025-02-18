//import { CgProfile } from "react-icons/cg";
/* import { GoPlus } from "react-icons/go";
 */ /*  import { */
/* eslint-disable react-hooks/exhaustive-deps */
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef, useState } from "react";
import { CgProfile } from "react-icons/cg";
/* import { CiStar } from "react-icons/ci";
import { FaStar } from "react-icons/fa"; */
/* import { GoPlus } from "react-icons/go";
import { LuPartyPopper } from "react-icons/lu";
 */ import {
  MdAlternateEmail,
  MdLocationOn,
  MdOutlineSportsSoccer,
} from "react-icons/md";
import { MainMenu } from "../../../molecule/MainMenu";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";

import { ModalSettings } from "../../../molecule/ModalSettings";
/* import { getUserEvents } from "../../../../services/usersService";
 */
import { getUserReviews } from "../../../../services/reviewService";
import { Link } from "react-router-dom";
const ProfilePage = () => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState({ interests: [] });
  //const [newInterest, setNewInterest] = useState("");
  const [editingInterest, setEditingInterest] = useState(null);
  const [updatedInterest, setUpdatedInterest] = useState("");
  const [error, setError] = useState(null);
  const { /* register,  */ handleSubmit } = useForm();
  // const [interests, setInterests] = useState([]); // Rellena esto con tus intereses.
  /*  const [selectedInterest, setSelectedInterest] = useState("");
  const [intereses, setInterests] = useState([]); */
  const API_URL = "http://localhost:300";
  //Setters de following y followers
  const [following, setFollowing] = useState([]); // Estado para almacenar los datos de los following
  const [followers, setFollowers] = useState([]); // Estado para almacenar los datos de los followers
  // Add these state variables at the top with other useState declarations
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const { userId } = useParams();
  const [eventsCount, setEventCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [userEvents, setUserEvents] = useState([]); // Guardar eventos creados
  /*   const [isFollowed, setIsFollowed] = useState(false);
   */
  console.log("userEvents ", userEvents);

  const [userReviews, setUserReviews] = useState([]);
  console.log("userReviews ", userReviews);

  /*   const [error, setError] = useState(null); // Manejo de errores
   */ const apiKeyMaps = "AIzaSyDBmV6twZ5qVIp8oppCmQBFRsWkHhgLhZQ";
  const [coordinates, setCoordinates] = useState(null);
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const geocoderContainerRef = useRef();
  const tokenMapBox =
    "pk.eyJ1IjoicGhvcmNhamFkYSIsImEiOiJjbTNxN3NldDAwazIzMm1zZGV0Mzhyd3U0In0.KG2eFS-dUlz0VNbwGhiQbQ";

  const secondaryAddresses = [
    {
      name: "Calle 1",
      address: "Rúa do Príncipe, 57Santiago de Vigo, 36202 Vigo, Pontevedra",
      color: "blue",
    },
    {
      name: "Calle ",
      address: "Av. de Vigo, 36001 Pontevedra",
      color: "blue",
    },
  ];

  console.log("userId ", userId);
  /*   const [loading, setLoading] = useState(false); // Estado para indicar si está cargando
   */
  // Obtener los eventos creados por el usuario
  /* Por hacer mañana
  //Hacer función para obtener el id des del back (params.userid) y obtener los datos del usuario find by id
  */
  // Modify the getFollowers function
  // Add these functions after the existing state declarations
  const followUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const strdUserId = localStorage.getItem("userId");

      if (!token || !strdUserId) {
        throw new Error("Falta información de sesión.");
      }

      const response = await axios.put(
        `${API_URL}/addFollower/${strdUserId}`,
        { userId: userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setFollowersCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const unfollowUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const strdUserId = localStorage.getItem("userId");

      if (!token || !strdUserId) {
        throw new Error("Falta información de sesión.");
      }

      const response = await axios.put(
        `${API_URL}/removeFollower/${strdUserId}`,
        { userId: userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setFollowersCount((prev) => prev - 1);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const getFollowers = async () => {
    try {
      const token = localStorage.getItem("token");
      const strdUserId = localStorage.getItem("userId");
      if (!token || !strdUserId)
        throw new Error("Falta información de sesión.");

      const response = await axios.get(`${API_URL}/users/${userId}`, {
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

  // Obtener coordenadas de la dirección principal
  useEffect(() => {
    const address = "Rúa Xeneral Gutiérrez Mellado, 1136001 Pontevedra";
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${apiKeyMaps}`
    )
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        if (data.status === "OK") {
          const location = data.results[0].geometry.location;
          const mainCoordinates = [location.lng, location.lat];
          setCoordinates(mainCoordinates); // Guardar coordenadas principales
        } else {
          console.error(
            "No se encontraron coordenadas para la dirección principal."
          );
        }
      })
      .catch((error) =>
        console.error("Error al obtener las coordenadas principales:", error)
      );
  }, [apiKeyMaps]);

  // Obtener coordenadas para las direcciones secundarias
  const fetchCoordinatesForSecondary = async () => {
    const markerPromises = secondaryAddresses.map((item) =>
      fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          item.address
        )}&key=${apiKeyMaps}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "OK") {
            const location = data.results[0].geometry.location;
            return { ...item, coordinates: [location.lng, location.lat] };
          } else {
            console.error(`No se encontraron coordenadas para ${item.name}.`);
            return null;
          }
        })
    );

    return Promise.all(markerPromises).then((results) =>
      results.filter((item) => item !== null)
    );
  };

  // Inicializar Mapbox y añadir marcadores
  useEffect(() => {
    if (coordinates) {
      mapboxgl.accessToken = tokenMapBox;
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        center: coordinates, // Coordenadas iniciales
        zoom: 15,
      });

      // Crear y añadir el geocoder solo fuera del mapa
      const geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
      });

      // Esperar a que el contenedor del geocoder esté disponible
      if (geocoderContainerRef.current) {
        // Añadir el geocoder al contenedor fuera del mapa
        geocoderContainerRef.current.appendChild(
          geocoder.onAdd(mapRef.current)
        );
      }

      // Crear marcador rojo para la dirección principal
      const mainMarker = new mapboxgl.Marker({ color: "red" })
        .setLngLat(coordinates)
        .addTo(mapRef.current)
        .setPopup(new mapboxgl.Popup().setHTML(`<b>Dirección principal</b>`));

      mapRef.current.addControl(new mapboxgl.FullscreenControl());

      mainMarker.getElement().addEventListener("click", () => {
        mapRef.current.flyTo({
          center: coordinates,
          zoom: 15,
          speed: 1.5,
          curve: 1,
          essential: true,
        });
      });

      // Crear marcadores secundarios
      fetchCoordinatesForSecondary().then((markerData) => {
        markerData.forEach((item) => {
          const marker = new mapboxgl.Marker({ color: "blue" })
            .setLngLat(item.coordinates)
            .addTo(mapRef.current)
            .setPopup(new mapboxgl.Popup().setHTML(`<b>${item.name}</b>`));

          marker.getElement().addEventListener("click", () => {
            mapRef.current.flyTo({
              center: item.coordinates,
              zoom: 15,
              speed: 1.5,
              curve: 1,
              essential: true,
            });
          });
        });
      });

      return () => {
        mapRef.current.remove();
      };
    }
  }, [coordinates]); // Inicializar mapa solo cuando haya coordenadas principales

  // Función para localizar al usuario
  const locateUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const userCoords = [longitude, latitude];

          // Centrar el mapa en las coordenadas del usuario
          if (mapRef.current) {
            mapRef.current.flyTo({
              center: userCoords,
              zoom: 15,
              speed: 1.5,
              curve: 1,
              essential: true,
            });

            // Crear una fuente GeoJSON para el usuario
            const geojsonSource = {
              type: "geojson",
              data: {
                type: "FeatureCollection",
                features: [
                  {
                    type: "Feature",
                    geometry: {
                      type: "Point",
                      coordinates: userCoords,
                    },
                  },
                ],
              },
            };

            // Añadir la fuente y la capa al mapa
            if (mapRef.current.getSource("user-location")) {
              mapRef.current
                .getSource("user-location")
                .setData(geojsonSource.data);
            } else {
              mapRef.current.addSource("user-location", geojsonSource);

              mapRef.current.addLayer({
                id: "circle",
                type: "circle",
                source: "user-location",
                paint: {
                  "circle-color": "#4264fb",
                  "circle-radius": 8,
                  "circle-stroke-width": 2,
                  "circle-stroke-color": "#ffffff",
                },
              });
            }
          }
        },
        (error) => {
          console.error("Error obteniendo la ubicación:", error);
          alert("No se pudo obtener tu ubicación.");
        }
      );
    } else {
      alert("Tu navegador no soporta la geolocalización.");
    }
  };

  // Obtener eventos y reseñas creadas por el usuario
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem("userId");

        if (!userId) throw new Error("El usuario no está autenticado.");

        // Contar eventos
        const events = await getUserEvents(userId);
        setUserEvents(events);
        setEventCount(events?.length || 0);

        // Contar reseñas
        const reviews = await getUserReviews(userId);
        setUserReviews(reviews);
        setReviewCount(reviews?.length || 0);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchUserData();
  }, []);

  // Modify the getFollowing function
  const getFollowing = async () => {
    try {
      const token = localStorage.getItem("token");
      const strdUserId = localStorage.getItem("userId");
      if (!token || !strdUserId)
        throw new Error("Falta información de sesión.");

      const response = await axios.get(`${API_URL}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const followingIds = response.data?.following || [];
      console.log("Following obtenidos:", followingIds);

      // Check if current profile userId exists in followingIds
      const userIsFollowed = followingIds.includes(userId);
      setIsFollowing(userIsFollowed);

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
      setFollowingCount(filteredFollowing.length);
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

  console.log(strdUserId);
  console.log(`${API_URL}/users/${strdUserId}`);
  // Obtener los datos del usuario
  const getUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const strdUserId = localStorage.getItem("userId");
      if (!token || !strdUserId)
        throw new Error("Falta información de sesión.");

      const response = await axios.get(`${API_URL}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(response.data || { interests: [] });
    } catch (err) {
      console.error("Error al obtener el usuario:", err);
      setError("Hubo un error al obtener el usuario.");
    }
  };
  /* 
  const addInterest = async (/* formData */ /*) => {
    //Usar selectedInterest para obtener valor seleccionado
    console.log(selectedInterest);
    //console.log("Se añade el interés", formData.NewInterest);
    /*   if (!selectedInterest.trim()) {
      setError("El campo de interés no puede estar vacío.");
      return;
    } */

  /*try {
      const token = localStorage.getItem("token");
      const strdUserId = localStorage.getItem("userId");

      if (!token || !strdUserId)
        throw new Error("Falta información de sesión.");
      console.log("Datos obtenidos correctamente");

      const response = await fetch(`${API_URL}/users/${userId}`, {
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
  }; */

  const token = localStorage.getItem("token");

  console.log(token);
  /* const handleFollow = async () => {
    try {
      const response = await fetch("/api/follow", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error("Failed to follow user");
      }

      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error("Error following user:", error);
    }
  }; */
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
      console.log(`${API_URL}/users/rmInterest/${userId}`);
      //Unauthorized
      const response = await axios.put(
        `${API_URL}/users/rmInterest/${userId}`,
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
  /*  const getInterestName = async () => {
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
  }; */
  // Llamadas iniciales al montar el componente

  {
    /*Handle remove*/
  } /* 
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
    /*     const strdUserId = localStorage.getItem("userId");
      console.log("Selected follower ID to remove: ", idToRemove);
    try {
      const response = await axios.put(
        `${API_URL}/users/removeFollower/${userId}`,
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
  }; */
  useEffect(() => {
    console.log("userId ", userId);

    const fetchData = async () => {
      await Promise.all([
        getUser(),
        getUserEvents(),
        /*     getInterestName(), */
        getFollowers(),
        getFollowing(),
      ]);
    };
    fetchData();
  }, []);

  return (
    <div className="p-4">
      {/* Información del usuario */}
      {users && users.interests ? (
        <div className="info-user mt-3">
          <h3 className="text-center">{users.name}</h3>
          <>
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
          </>
        </div>
      ) : (
        <p>Cargando datos del usuario...</p>
      )}
      {/* Segunda sección */}
      <div className="p-4">
        <div className="p-4">
          <div className="flex justify-end">
            <ModalSettings />
          </div>

          <div className="flex align-baseline justify-center">
            <div className="avatar">
              <div className="w-52 rounded">
                <CgProfile className="w-full h-auto" />
              </div>
            </div>
          </div>

          {/* <div className="info-user mt-3">
          <div className="direccion flex items-center justify-center">
            <h3>Pablo Horcajada González</h3>
          </div>
          <div className="direccion flex items-center justify-center">
            <MdAlternateEmail />
            <span>phghorcajada@gmail.com</span>
          </div>
          <div className="direccion flex items-center justify-center">
            <MdLocationOn />
            <span>Pinto, Calle de mi casa nº1</span>
          </div>
        </div> */}
          <div className="direccion flex items-center justify-center">
            <MdLocationOn />
            <span>
              {users.city}, {users.direction}
            </span>
          </div>
          {/* Mapa y localización */}
          <p>Mapa</p>
          <button
            onClick={locateUser}
            className="p-2 bg-blue-500 text-white rounded mb-4"
          >
            Localizarme
          </button>
          <div ref={geocoderContainerRef} />
          {coordinates && (
            <div
              id="map-container"
              className="w-full h-96 bg-slate-700"
              ref={mapContainerRef}
            />
          )}

          {/* Estadísticas */}
          <div className="stats shadow w-full">
            <div className="stat place-items-center px-2">
              <div className="stat-value text-xl">{reviewCount}</div>
              <div className="stat-desc text-xs">Valoraciones</div>
            </div>
            <div className="stat place-items-center px-2">
              <div className="stat-value text-xl">3</div>
              <div className="stat-desc text-xs">Eventos Unidos</div>
            </div>
            <div className="stat place-items-center px-2">
              <div className="stat-value text-xl">{eventsCount}</div>
              <div className="stat-desc text-xs">Eventos creados</div>
            </div>
            <div className="stat place-items-center px-2">
              <div className="stat-value text-xl"> {followersCount}</div>
              <div className="stat-desc text-xs">Seguidores</div>
            </div>
            <div className="stat place-items-center px-2">
              <div className="stat-value text-xl">{followingCount}</div>
              <div className="stat-desc text-xs">Seguidos</div>
            </div>
          </div>

          {/* Intereses */}
          {/*  <div className="interests mb-2">
          <h4>Intereses</h4>
          <div className="list mt-5 flex flex-wrap gap-3">
            <button className="btn rounded-full btn-primary">
              <MdOutlineSportsSoccer className="w-5 h-auto" />
              Deportes
              <span className="text-xl">-</span>
            </button>
            <button className="btn rounded-full border-dashed border-2 border-blue-400">
              <MdOutlineSportsSoccer className="w-5 h-auto" />
              Bailaradadadad
              <GoPlus className="w-5 h-auto" />
            </button>
            <button className="btn rounded-full border-dashed border-2 border-blue-400">
              <LuPartyPopper className="w-5 h-auto" />
              Fiestas
              <GoPlus className="w-5 h-auto" />
            </button>
          </div>
        </div> */}

          {/* Reseñas */}
          <h4>Mis Valoraciones</h4>
          <div className="hero-content">
            {/* <img
                  src="https://www.ventadehinchables.com/wp-content/uploads/2018/06/bubble-park5.jpg"
                  className="max-w-36 rounded-lg"
                /> */}
            {/*   <div>
                  <h3 className="font-bold leading-4">Nombre del evento</h3>
                  <p className="py-2 leading-4">Calle de mi casa nº3</p>
                  <div className="flex">
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <CiStar />
                    <CiStar />
                  </div>
                </div> */}
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
              <p>Followers: {followersCount}</p>
              <p>Following: {followingCount}</p>
            </div>
            <button
              className={`btn btn-${
                isFollowing ? "secondary" : "danger"
              } btn-sm`}
              onClick={() => {
                if (isFollowing) {
                  unfollowUser();
                } else {
                  followUser();
                }
                setIsFollowing(!isFollowing);
              }}
            >
              {isFollowing ? "Dejar de seguir" : "Seguir"}
            </button>
            {/*Lista de seguidores y seguidos*/}
            <div>
              <h2>Lista de Following</h2>
              <ul>
                {following.map((follower) => (
                  <li key={follower.id}>
                    <Link to={`/profile/${follower._id}`}>{follower.name}</Link>{" "}
                    {/*  <button
                          type="submit"
                          name="remove"
                          onClick={() => handleRemoveFollowing(follower._id)}
                          className="btn btn-danger btn-sm"
                        >
                          Eliminar
                        </button> */}
                  </li>
                ))}
              </ul>

              <h2>Lista de Followers</h2>
              <ul>
                {followers.map((follower) => (
                  <li key={follower._id}>
                    <Link to={`/profile/${follower._id}`}>{follower.name}</Link>{" "}
                    {/* <button
                          type="submit"
                          name="remove"
                          onClick={() => handleRemoveFollower(follower._id)}
                          className="btn btn-danger btn-sm"
                        >
                          Eliminar
                        </button> */}
                  </li>
                ))}
              </ul>
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
                              onChange={(e) =>
                                setUpdatedInterest(e.target.value)
                              }
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
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </form>
              </div>
              <div className="direccion flex items-center justify-center">
                <MdLocationOn />
                <span>
                  {users.city}, {users.direction}
                </span>
              </div>
            </div>
          </div>

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
        </div>{" "}
        {/* Formulario para añadir interés */}
        {/*  <h2>Añadir Interés</h2>
        <form onSubmit={handleSubmit(addInterest)}>
          <label htmlFor="interestSelect">Selecciona un interés:</label>
          <select
            id="interestSelect"
            value={selectedInterest}
            onChange={(e) => setSelectedInterest(e.target.value)}
          >
            <option value="">-- Selecciona un interés --</option>
            {intereses.map((interest, index) => (
              <option key={index} value={interest}>
                {interest}
              </option>
            ))}
          </select>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button type="submit">Añadir</button>
        </form> */}
        {/* Formulario para añadir interés */}
        {/*  <h2>Añadir Interés</h2>
      <form onSubmit={handleSubmit(addInterest)}>
        <label htmlFor="interestInput">Nuevo Interés:</label>
        <input type="text" {...register("NewInterest")} />
        <button type="submit">Añadir</button>
      </form> */}
        {/* Formulario para añadir interés */}
        {/*  <h2>Añadir Interés</h2>
      <form onSubmit={handleSubmit(addInterest)}>
        <label htmlFor="interestInput">Nuevo Interés:</label>
        <input type="text" {...register("NewInterest")} />
        <button type="submit">Añadir</button>
      </form> */}
        {/* Eventos unidos */}
        {/*  {userEvents.length > 0 ? (
        userEvents.map((event) => (
          <div key={event.id} className="card bg-base-200 p-4 rounded-lg">
            <h5 className="font-bold">{event.name}</h5>
            <p className="text-sm">{event.description}</p>
            <p className="text-sm">Inicio: {event.startTime}</p>
            <p className="text-sm">Fin: {event.endTime}</p>
            <p className="text-sm">Precio: {event.price}</p>
            <p className="text-sm">Ubicación: {event.location}</p>
          </div>
        ))
      ) : (
        <p>No se encontraron eventos creados.</p>
      )}
      {/* Mis Valoraciones*/}
        <div className="events-created mt-8 mb-40">
          <h2>Mis Valoraciones</h2>
          <div className="events-list mt-4 flex flex-col gap-4">
            {userReviews.length > 0 ? (
              userReviews.map((review) => (
                <div
                  key={review.id}
                  className="card bg-base-200 p-4 rounded-lg"
                >
                  <h5 className="font-bold">{review.description}</h5>
                  <p className="text-sm">{review.score}</p>
                  <p className="text-sm">
                    Calificación: {review.avarageScore}/5
                  </p>
                  <p className="text-sm">Fecha: {review.createdAt}</p>
                </div>
              ))
            ) : (
              <p>No se encontraron reseñas creadas.</p>
            )}
          </div>
        </div>{" "}
        {/* Eventos creados */}
        <div className="events-created mt-8 mb-40">
          <h4>Mis Eventos Creados</h4>
          <div className="events-list mt-4 flex flex-col gap-4">
            {events.length > 0 ? (
              events.map((event) => (
                <div key={event.id} className="card bg-base-200 p-4 rounded-lg">
                  <h5 className="font-bold">{event.name}</h5>
                  <p className="text-sm">{event.description}</p>
                  <p className="text-sm">{event.endTime}</p>
                  <p className="text-sm">{event.startTime}</p>
                  <p className="text-sm">{event.price}</p>
                </div>
              ))
            ) : (
              <p>No se encontraron eventos creados.</p>
            )}
          </div>
        </div>
        <MainMenu />
      </div>{" "}
    </div>
  );
};
export default ProfilePage;
