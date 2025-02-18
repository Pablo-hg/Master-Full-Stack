/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { GoArrowLeft } from "react-icons/go";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { LoginForm } from "../../molecule/LoginForm";
import { ModalLogin } from "../../molecule/ModalLogin";

// eslint-disable-next-line react/prop-types
const LoginPage = ({ onLogin }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Si hay un mensaje de error en el estado, establecerlo
    if (location.state?.errorMessage) {
      setErrorMessage(location.state.errorMessage);
    }
  }, [location.state]);

  const handleLogin = () => {
    onLogin(); // Llama a la función onLogin que viene de App.jsx
    navigate("/profile"); // Redirige a /profile después de iniciar sesión
  };
  return (
    <div className="grid h-screen p-4">
      <div className="grid grid-cols-6 align-baseline items-center">
        <NavLink to={"/"}>
          <GoArrowLeft />
        </NavLink>
        <h3 className="col-span-5">!Nos algrea verte de nuevo!</h3>
      </div>
      <LoginForm onLogin={handleLogin} setErrorMessage={setErrorMessage} />
      <ModalLogin message={errorMessage} />
    </div>
  );
};
export default LoginPage;
