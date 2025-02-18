import { useState, useRef, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

const Manager = ({ error,  users, selectedManagers, onManagerChange }) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const inputRef = useRef(null);
  

  // Manejo de cambio en el input
  const handleInputChange = (e) => {
    let { value } = e.target;
    value = value.charAt(0).toUpperCase() + value.slice(1);

    if (/^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ\s]*$/.test(value)) {
      setInputValue(value);

      if (value && users) {
        const match = users.find(user =>
          user.name.toLowerCase().startsWith(value.toLowerCase())
        );
        setSuggestion(match ? match.name : '');
      } else {
        setSuggestion('');
      }
    }
  };

  // Selección de administrador
  const handleManagerSelection = () => {
    if (!Array.isArray(users)) return;

    const selected = users.find((user) => user.name === suggestion);
    if (selected) {
      const isAlreadySelected = selectedManagers.some(
        (manager) => manager._id === selected._id
      );
      if (!isAlreadySelected) {
        const updatedManagers = [...selectedManagers, selected];
        onManagerChange(updatedManagers); // Notifica al padre
        setInputValue('');
        setSuggestion('');
      }
    }
  };

  // Manejo de tecla Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleManagerSelection();
    }
  };

  // Eliminar un administrador de la lista
  const handleRemoveManager = (_id) => {
    const updatedManagers = selectedManagers.filter(manager => manager._id !== _id);
    onManagerChange(updatedManagers);

    // Notificar al componente padre
    if (onManagerChange) {
      onManagerChange(updatedManagers);
  };
};

  // Cierra las sugerencias si se hace clic fuera
  const handleClickOutside = (e) => {
    if (inputRef.current && !inputRef.current.contains(e.target)) {
      setSuggestion('');
    }
  };


  // Efecto para detectar clics fuera del componente
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
        className={`relative w-full max-w-sm ${error ? "border border-red-500" : ""}`}
        ref={inputRef}>

      <label htmlFor="manager" className="block text-sm font-medium text-gray-700">
        Administradores del evento
      </label>
      <div className="relative flex items-center">
        <input
          type="text"
          id="manager"
          name="manager"
          autoComplete="off"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          placeholder="Buscar administrador"
        />

        {suggestion && suggestion.toLowerCase().startsWith(inputValue.toLowerCase()) && (
          <div
            className="absolute top-1/2 left-2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
            style={{
              fontSize: '16px',
              lineHeight: '0.8',
              marginLeft: `${inputValue.length}ch`,
              whiteSpace: 'nowrap',
              transform: 'translateY(-30%)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              color: '#A0AEC0'
            }}
          >
            {suggestion.slice(inputValue.length)}
          </div>
        )}
      </div>

      {/* Lista de administradores seleccionados */}
      <div className="mt-3 flex flex-wrap gap-2">
        {selectedManagers.map(manager => (
          <div
          key={manager._id || manager.id}
            className="flex items-center px-3 py-1 bg-gray-200 rounded-full text-gray-700"
          >
            {manager.name}
            <button
              type="button"
              onClick={() => handleRemoveManager(manager._id)}
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

export default Manager;
