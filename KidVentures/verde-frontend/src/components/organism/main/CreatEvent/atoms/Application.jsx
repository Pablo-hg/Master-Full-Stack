import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaTimes } from 'react-icons/fa';

const Application = ({ users,selectedParticipants = [], onSendInvitation, onChange}) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const inputRef = useRef(null);


  useEffect(() => {
    // Sincroniza los participantes seleccionados desde el padre al cargar
    setSelectedUsers(selectedParticipants);
  }, [selectedParticipants]);

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
    if (selected) {
      const isAlreadySelected = selectedUsers.some(user => user._id === selected._id);
      if (!isAlreadySelected) {
        const updatedUsers = [...selectedUsers, selected];
        setSelectedUsers(updatedUsers);
        setInputValue('');
        setSuggestion('');


        console.log("Usuarios seleccionados actualizados:", updatedUsers); // Log aquí
        console.log("Notificando al padre con onChange:", onChange);


        // Notifica al padre sobre el cambio en los usuarios seleccionados
        if (onChange) {
          onChange(updatedUsers);
        }
      }
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
  const handleRemoveUser = (_id) => {
    const updatedUsers = selectedUsers.filter(user => user._id !== _id);
    setSelectedUsers(updatedUsers);

    console.log("Usuarios seleccionados después de eliminar:", updatedUsers);

    // Notifica al padre sobre el cambio en los usuarios seleccionados
    if (onChange) {
      console.log("Notificando al padre después de eliminar un usuario:", updatedUsers);
      onChange(updatedUsers);
    }
  };


  // Enviar invitaciones y limpiar el estado
  const handleSendInvitationClick = () => {
    if (selectedUsers.length > 0) {
      // Crear un array con el formato necesario para las invitaciones
      const invitations = selectedUsers.map((user) => ({
        userId: user._id,
        check: "accepted", // Estado predeterminado
      }));

      onSendInvitation(invitations); // Notifica al padre con los datos
      setSelectedUsers([]); // Limpia la lista de seleccionados
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
            key={user._id}
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

export default Application


