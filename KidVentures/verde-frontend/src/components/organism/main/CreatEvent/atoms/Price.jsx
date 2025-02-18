import React from 'react';

const Price = ({ isFree, price, onToggleFree, onChange, onBlur, error }) => {
  return (
    <label className="form-control w-full">

      {/* Etiqueta del precio */}
      <div className="label">
        <span className="block text-sm font-medium text-gray-700">Precio</span>
      </div>
      
      {/* Checkbox Gratis */}
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          className="checkbox"
          checked={isFree}
          onChange={onToggleFree}
          id="free-checkbox"
        />
        <label htmlFor="free-checkbox" className="cursor-default">
          Gratis
        </label>
      </label>
      
      {/* Input Precio */}
      {!isFree && (
        <div className="relative w-full mt-4">
          <input
            type="number"
            name="price"
            value={price}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            placeholder="0"
            className={`input input-bordered w-full pr-10 ${error ? 'border-red-500' : ''}`}
            min="0"
          />
         <span className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-500">
           €
         </span>
       </div>
      )}

      {/* Mostrar errores */}
      {!isFree && error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </label>
  );
};

export default Price;
