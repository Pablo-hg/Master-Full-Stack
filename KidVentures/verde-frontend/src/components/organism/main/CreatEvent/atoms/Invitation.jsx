import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaTimes } from 'react-icons/fa';

const Invitation = ({ users, onSendInvitation}) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const inputRef = useRef(null);

  // Filtra y sugiere el usuario basado en el input
  const handleInputChange = (e) => {
    let { value } = e.target;
    value = value.charAt(0).toUpperCase() + value.slice(1);

    if (/^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ\s]*$/.test(value)) {
      setInputValue(value);

      if (value) {
        const match = users.find(user =>
          user.name.toLowerCase().startsWith(value.toLowerCase())
        );
        setSuggestion(match ? match.name : '');
      } else {
        setSuggestion('');
      }
    }
  };

  // Añade el usuario sugerido a la lista de usuarios seleccionados
  const handleUserSelection = () => {
    const selected = users.find(user => user.name === suggestion);
    console.log("Usuario sugerido encontrado:", selected); // Verificar el usuario sugerido
  
    // Cambiar user.id a user._id para comparar correctamente
    if (selected && !selectedUsers.some(user => user._id === selected._id)) {
      setSelectedUsers(prev => [...prev, selected]);
      setInputValue(''); // Limpiar el input
      setSuggestion(''); // Limpiar la sugerencia
      console.log("Usuarios seleccionados actualizados:", selectedUsers); // Confirmar los usuarios seleccionados después de agregar
    } else {
      console.log("Usuario ya seleccionado o no encontrado"); // Indicar si el usuario ya está en la lista o no se encontró
    }
  };
  
  

  // Añade usuario al presionar Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      console.log("Tecla Enter presionada. Valor actual del input:", inputValue); // Log para ver el valor del input cuando se presiona Enter
      handleUserSelection();
    }
  };
  

  // Cierra las sugerencias si se hace clic fuera
  const handleClickOutside = (e) => {
    if (inputRef.current && !inputRef.current.contains(e.target)) {
      setSuggestion('');
    }
  };

  // Eliminar un usuario de la lista seleccionada
  const handleRemoveUser = (id) => {
    setSelectedUsers(selectedUsers.filter(user => user._id !== id));
  };

  // Enviar invitaciones y limpiar el estado
  const handleSendInvitationClick = () => {
    if (selectedUsers.length > 0) {
      onSendInvitation(selectedUsers);
      setSelectedUsers([]);
    } else {
      alert("Selecciona al menos un usuario para enviar la invitación");
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full max-w-sm" ref={inputRef}>
      <label htmlFor="participant" className="block text-sm font-medium text-gray-700">
        Enviar invitación
      </label>
      <div className="relative flex items-center">
        <input
          type="text"
          id="participant"
          name="participant"
          autoComplete="off"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          placeholder="Buscar invitado"
        />

        {suggestion && suggestion.toLowerCase().startsWith(inputValue.toLowerCase()) && (
          <div
            className="absolute top-1/2 left-2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
            style={{
              fontSize: "16px",
              lineHeight: "0.8",
              marginLeft: `${inputValue.length}ch`,
              whiteSpace: "nowrap",
              transform: "translateY(-30%)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              color: "#A0AEC0"
            }}
          >
            {suggestion.slice(inputValue.length)}
          </div>
        )}

        <button
          type="button"
          onClick={handleSendInvitationClick}
          className="ml-2 p-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none"
          title="Enviar invitación"
        >
          <FaPaperPlane />
        </button>
      </div>

      {/* Lista de usuarios seleccionados */}
      <div className="mt-3 flex flex-wrap gap-2">
        {selectedUsers.map(user => (
          <div
            key={user.i_d}
            className="flex items-center px-3 py-1 bg-gray-200 rounded-full text-gray-700"
          >
            {user.name}
            <button
              type="button"
              onClick={() => handleRemoveUser(user._id)}
              className="ml-2 text-gray-500 hover:text-red-500"
            >
              <FaTimes />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Invitation;


