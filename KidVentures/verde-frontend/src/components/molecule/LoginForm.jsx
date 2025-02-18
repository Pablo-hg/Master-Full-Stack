/* eslint-disable react/prop-types */
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export const LoginForm = ({ onLogin, setErrorMessage }) => {
  const { register, handleSubmit, formState } = useForm();
  const [showPassword, setShowPassword] = useState(false);

  const seePassword = () => {
    setShowPassword(!showPassword); // Cambia el estado al hacer clic en el checkbox
  };

  const onSubmitHandler = async (formData) => {
    const response = await loginForm(formData);
    //login existoso
    if (response && response.status === 201) {
      console.log("La respuesta del end-point de login: ", response.data.token);
      console.log("userID:", response.data.user._id);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.user._id);
      onLogin();
    } else {
      setErrorMessage(response.data.message);
      const btn = document.getElementById("btnmodalError");
      btn.click();
    }
  };

  const loginForm = async (formData) => {
    try {
      const response = await axios.post(
        "http://localhost:300/login/check-form",
        { formData }
      );
      return response;
    } catch {
      // console.log("algo salio mal");
      return false;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="block w-full">
      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text">Correo electrónico</span>
        </div>
        <input
          type="email"
          {...register("email", {
            required: {
              value: true,
              message: "El campo email es obligatorio",
            },
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Introduce un correo válido",
            },
          })}
          className={`input input-bordered w-full max-w-xs ${
            formState.errors.email ? "input-error" : ""
          }`}
          placeholder="Correo Electrónico"
        />
        {formState.errors.email && (
          <span className="error-text">{formState.errors.email.message}</span>
        )}
      </label>
      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text">Contraseña</span>
        </div>
        <label
          className={`input input-bordered flex items-center gap-2 ${
            formState.errors.password ? "input-error" : ""
          }`}
        >
          <input
            type={showPassword ? "text" : "password"}
            {...register("password", {
              required: {
                value: true,
                message: "El campo password es obligatorio",
              },
            })}
            className="h-max w-full"
            placeholder="Contraseña"
          />
          <label className="swap">
            <input type="checkbox" onChange={seePassword} />
            <FaEye className="swap-on" />
            <FaEyeSlash className="swap-off" />
          </label>
        </label>
        {formState.errors.password && (
          <span className="error-text">
            {formState.errors.password.message}
          </span>
        )}
      </label>
      <button type="submit" className="btn btn-primary mt-3">
        Iniciar sesión
      </button>
    </form>
  );
};
