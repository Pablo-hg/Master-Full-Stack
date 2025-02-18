import { NavLink } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="grid grid-rows-4 grid-flow-col h-screen p-5">
      <div className="titulo text-center">
        <h1>KidVentures</h1>
        <h3>Una aventura para niños</h3>
      </div>
      <div className="row-start-4 grid grid-rows-3 gap-4">
        <NavLink to="/create" className="btn btn-primary">
          Registrarse
        </NavLink>
        <NavLink to="/login" className="underline text-center">
          ¿Ya tienes una cuenta? Inicia sesión
        </NavLink>
      </div>
    </div>
  );
};

export default HomePage;
