import React from 'react';

const ParticipantsLimit = ({ value, onChange, onBlur, error }) => {
    
    const handleChange = (e) => {
        const { name, value } = e.target;
    
        // Permitir solo números
        if (/^\d*$/.test(value)) {
            onChange(name, value);
          }
        };
      

    // Validación al perder el foco
    const handleBlur = (e) => {
        const { name, value } = e.target;
        let errorMessage = '';
    
        if (value !== '' && !/^\d+$/.test(value)) {
            errorMessage = 'Debe ser un número válido';
          } else if (Number(value) <= 0) {
            errorMessage = 'El número debe ser mayor a 0';
          }
    
        onBlur(name, value, errorMessage);
      };

  return (
    <label className="form-control w-full">
      <div className="label">
        <span className="block text-sm font-medium text-gray-700">Aforo máximo</span>
      </div>
      <input
         type="text"
        name="participants_limit"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="Número máximo de participantes"
        className={`input input-bordered w-full ${error ? 'border-red-500' : ''}`}
        autoComplete="off"
      />
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </label>
  );
};

export default ParticipantsLimit;
