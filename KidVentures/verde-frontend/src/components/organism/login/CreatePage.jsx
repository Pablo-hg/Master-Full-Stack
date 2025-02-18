import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { GoArrowLeft } from "react-icons/go";
import { NavLink, useNavigate } from "react-router-dom";
import { ModalLogin } from "../../molecule/ModalLogin";

const CreatePage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const { register, handleSubmit, formState } = useForm();
  const [errorMessage, setErrorMessage] = useState("");
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const btn = document.getElementById("btnmodalError");
  const navigate = useNavigate();

  const seePassword = () => {
    setShowPassword(!showPassword); // Cambia el estado al hacer clic en el checkbox
  };
  const seePassword2 = () => {
    setShowPassword2(!showPassword2); // Cambia el estado al hacer clic en el checkbox
  };

  const onSubmitHandler = async (formData) => {
    if (formData.password == formData.password2) {
      const response = await checkEmail(formData);
      if (response && response.status === 201) {
        try {
          // Creación del usuario sin activar
          await axios.post("http://localhost:300/login/create-user", {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            address: formData.address,
            city: formData.city,
            interests: formData.categories,
          });

          // Si la creación del usuario fue exitosa, mandamos el correo
          const response = await axios.post("http://localhost:300/email/alta", {
            toEmail: formData.email,
            nameUser: formData.name,
          });
          // Si el correo se envía correctamente, redirigir con un mensaje de éxito
          const successMessage =
            response.data.message || "Cuenta creada exitosamente";
          navigate("/login", { state: { errorMessage: successMessage } });
        } catch (error) {
          // Si ocurre un error en cualquiera de las dos solicitudes, manejar el error
          const errorMessage =
            error.response?.data?.message || "Ocurrió un error inesperado";
          navigate("/login", { state: { errorMessage } });
        }
      } else {
        setErrorMessage(response.data.message);
        btn.click();
      }
    } else {
      setErrorMessage("Las contraseñas no coinciden");
      btn.click();
    }
  };

  const checkEmail = async (formData) => {
    try {
      const response = await axios.post(
        "http://localhost:300/login/check-email",
        { formData }
      );
      return response;
    } catch {
      console.log("algo salio mal");
      return false;
    }
  };

  useEffect(() => {
    axios
      .get("http://localhost:300/login/")
      .then((response) => {
        setCities(response.data.cities);
        setCategories(response.data.categories);
      })
      .catch((error) => {
        console.error("Error al obtener las ciudades:", error);
      });
  }, []);

  const handleChangeCity = (event) => {
    setSelectedCity(event.target.value);
  };

  return (
    <div className="grid h-screen p-4">
      <form onSubmit={handleSubmit(onSubmitHandler)} className="block w-full">
        <div className="grid grid-cols-6 align-baseline items-center">
          <NavLink to={"/"}>
            <GoArrowLeft />
          </NavLink>
          <h3 className="col-span-5">Registrarse</h3>
        </div>
        <div className="block w-full">
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Nombre y apellidos</span>
            </div>
            <input
              type="text"
              {...register("name", {
                required: {
                  value: true,
                  message: "El campo name es obligatorio",
                },
                pattern: {
                  value:
                    /^[A-Za-zÀ-ÿ'-]+\s+[A-Za-zÀ-ÿ'-]+(?:\s+[A-Za-zÀ-ÿ'-]+)*$/,
                  message: "Introduce un nombre válido",
                },
              })}
              className={`input input-bordered w-full max-w-xs ${
                formState.errors.name ? "input-error" : ""
              }`}
            />
            {formState.errors.name && (
              <span className="error-text">
                {formState.errors.name.message}
              </span>
            )}
          </label>
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
            />
            {formState.errors.email && (
              <span className="error-text">
                {formState.errors.email.message}
              </span>
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
                  minLength: {
                    value: 9,
                    message: "La contraseña debe tener al menos 9 caracteres",
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?=.*\d).{9,}$/,
                    message:
                      "La contraseña debe contener al menos una minúscula, una mayúscula, un símbolo y un número",
                  },
                })}
                className="h-max w-full"
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
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Verificar Contraseña</span>
            </div>
            <label
              className={`input input-bordered flex items-center gap-2 ${
                formState.errors.password ? "input-error" : ""
              }`}
            >
              <input
                type={showPassword2 ? "text" : "password"}
                {...register("password2", {
                  required: {
                    value: true,
                    message: "El campo password es obligatorio",
                  },
                  minLength: {
                    value: 9,
                    message: "La contraseña debe tener al menos 9 caracteres",
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?=.*\d).{9,}$/,
                    message:
                      "La contraseña debe contener al menos una minúscula, una mayúscula, un símbolo y un número",
                  },
                })}
                className="h-max w-full"
              />
              <label className="swap">
                <input type="checkbox" onChange={seePassword2} />
                <FaEye className="swap-on" />
                <FaEyeSlash className="swap-off" />
              </label>
            </label>
            {formState.errors.password2 && (
              <span className="error-text">
                {formState.errors.password2.message}
              </span>
            )}
          </label>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Dirección</span>
            </div>
            <input
              type="text"
              {...register("address", {
                required: {
                  value: true,
                  message: "La dirección es obligatoria",
                },
                pattern: {
                  value: /^[\w\s.,'ºªñÑ#/-]{5,100}$/,
                  message: "La dirección debe ser válida",
                },
              })}
              className={`input input-bordered w-full max-w-xs ${
                formState.errors.address ? "input-error" : ""
              }`}
            />
            {formState.errors.address && (
              <span className="error-text">
                {formState.errors.address.message}
              </span>
            )}
          </label>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Ciudad</span>
            </div>
            <select
              {...register("city", {
                required: {
                  value: true,
                  message: "La ciudad es obligatoria",
                },
              })}
              value={selectedCity}
              onChange={handleChangeCity}
              className={`select input input-bordered w-full max-w-xs" ${
                formState.errors.address ? "input-error" : ""
              }`}
            >
              <option value="" disabled>
                Selecciona una ciudad
              </option>
              {cities.map((city, index) => (
                <option key={index} value={city}>
                  {city}
                </option>
              ))}
            </select>
            {formState.errors.city && (
              <span className="error-text">
                {formState.errors.city.message}
              </span>
            )}
          </label>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Intereses</span>
            </div>
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Selecciona las categorías</span>
              </label>
              <div className="flex flex-col">
                {categories.map((category, index) => (
                  <label key={index} className="flex items-center">
                    <input
                      type="checkbox"
                      value={category}
                      {...register("categories", {
                        required: {
                          value: true,
                          message: "Los intereses son obligatorios",
                        },
                      })}
                      className={`checkbox ${
                        formState.errors.categories ? "input-error" : ""
                      }`}
                    />
                    <span className="ml-2">{category}</span>
                  </label>
                ))}
              </div>
              {formState.errors.categories && (
                <span className="text-error">
                  {formState.errors.categories.message}
                </span>
              )}
            </div>

            {formState.errors.city && (
              <span className="error-text">
                {formState.errors.city.message}
              </span>
            )}
          </label>
        </div>
        <div className="divider"></div>
        <button type="submit" className="btn btn-primary mt-3">
          Registrarse
        </button>
      </form>
      <div className="text-center">
        Al continuar, confirmar que acepetas las{" "}
        <NavLink className={"underline"}>Condiciones de servicio</NavLink> de
        Kidventures. Gestionaremos la información tal y como se describe en la{" "}
        <NavLink className={"underline"}>Politica de privacidad</NavLink> y la{" "}
        <NavLink className={"underline"}>Condiciones de cookies</NavLink>.
      </div>
      <ModalLogin message={errorMessage} />
    </div>
  );
};
export default CreatePage;
