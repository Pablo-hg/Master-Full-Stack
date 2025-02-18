import { BsChatSquareText, BsFillPeopleFill } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { GoHome } from "react-icons/go";
import { IoCreateOutline } from "react-icons/io5";
import { NavLink } from "react-router-dom";

export const MainMenu = () => {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-base-200 border-t-2 border-gray-300">
      <ul className="menu menu-horizontal w-full max-w-screen justify-between px-4 py-2">
        <li>
          <NavLink to="/discover" className="flex flex-col items-center px-1">
            <GoHome className="w-5 h-auto" />
            <span className="-mt-2">Home</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/events" className="flex flex-col items-center px-1">
            <BsFillPeopleFill className="w-5 h-auto" />
            <span className="-mt-2">Eventos</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/create-edit-event" className="flex flex-col items-center px-1">
            <IoCreateOutline className="w-5 h-auto" />
            <span className="-mt-2">Mis Eventos</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/messages" className="flex flex-col items-center px-1">
            <BsChatSquareText className="w-5 h-auto" />
            <span className="-mt-2">Mensajes</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/profile" className="flex flex-col items-center px-1">
            <CgProfile className="w-5 h-auto" />
            <span className="-mt-2">Perfil</span>
          </NavLink>
        </li>
      </ul>
    </div>
  );
};
