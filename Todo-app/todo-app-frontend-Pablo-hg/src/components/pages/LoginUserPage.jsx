import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom"; // Importa useNavigate

// email: phghorcajada@gmail.com
// password: 12345

const LoginUserPage = () => {
  const { register, handleSubmit, formState } = useForm();
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Inicializa useNavigate

  // Función para manejar el envío del formulario
  const enviarForm = async (formData) => {
    console.log("FORMDATA", formData); // Para verificar lo que se está enviando

    try {
      const response = await fetch("http://localhost:3000/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // Asegúrate de enviar el formData como JSON
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message); // Mensaje de éxito
        navigate("/tasks"); // Redirige a /tasks
      } else {
        setMessage(data.message); // Mensaje de error (usuario o contraseña incorrectos)
      }
    } catch {
      setMessage("Error en la solicitud"); // Captura errores de la solicitud
    }
  };

  return (
    <div>
      <h2>Login User Page</h2>
       email: phghorcajada@gmail.com<br></br>
        password: 12345
      <form onSubmit={handleSubmit(enviarForm)}>
        <input
          type="email"
          {...register("email", {
            required: {
              value: true,
              message: "El campo email es obligatorio",
            },
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "El formato del correo no es válido",
            },
          })}
          placeholder="Correo Electrónico"
        />
        <br />
        {formState.errors.email && (
          <span className="error-text">{formState.errors.email.message}</span>
        )}
        <br />
        <input
          type="password"
          {...register("password", {
            required: {
              value: true,
              message: "El campo password es obligatorio",
            },
          })}
          placeholder="password"
        />
        <br />
        {formState.errors.password && (
          <span className="error-text">
            {formState.errors.password.message}
          </span>
        )}
        <br />
        <button type="submit">Acceder</button>
      </form>

      {/* Mostrar mensajes de error o éxito */}
      {message && <p>{message}</p>}
    </div>
  );
};

export default LoginUserPage;
