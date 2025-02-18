/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { MdAlternateEmail } from "react-icons/md";
import { ModalSettings } from "../../../molecule/ModalSettings";
import axios from "axios";
import { useParams } from "react-router-dom";

const ProfilePage = () => {
  const [userdata, setUserData] = useState({ interests: [] });
  const token = localStorage.getItem("token");
  const { userId } = useParams();

  // Obtener los datos del usuario
  const getUser = async () => {
    try {
      if (!token) throw new Error("Falta información de sesión.");

      const response = await axios.get(`http://localhost:300/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUserData(response.data || { interests: [] });
    } catch (err) {
      console.error("Error al obtener el usuario:", err);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="p-4">
      <div className="flex justify-end">
        <ModalSettings userdata={userdata} setUserData={setUserData} />
      </div>
      <div className="flex align-baseline justify-center">
        <div className="avatar">
          <div className="h-40 w-40 rounded-full bg-gray-300 text-slate-700 overflow-hidden flex justify-center items-center">
            {userdata.avatar_image?.startsWith("data:image") ? (
              <img
                src={userdata.avatar_image}
                alt="avatar"
                className="h-full w-full object-cover"
              />
            ) : (
              <CgProfile className="h-20 w-20" />
            )}
          </div>
        </div>
      </div>
      <div className="info-user mt-3">
        <div className="direccion flex items-center justify-center">
          <h3>{userdata.name}</h3>
        </div>
        <div className="direccion flex items-center justify-center">
          <MdAlternateEmail />
          <span>{userdata.email}</span>
        </div>
      </div>
      <div className="interests mt-4">
        <h4 className="text-lg font-bold">Intereses</h4>
        <ul className="list-disc pl-5">
          {userdata.interests.length > 0 ? (
            userdata.interests.map((interest, index) => (
              <li key={index}>{interest}</li>
            ))
          ) : (
            <p>No tienes intereses registrados.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ProfilePage;
