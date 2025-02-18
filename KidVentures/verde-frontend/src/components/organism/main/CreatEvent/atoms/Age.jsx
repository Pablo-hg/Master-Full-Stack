import React, {useState} from 'react';

const Age = ({ ageRange, onAgeRangeChange }) => {
   const [errors, setErrors] = useState({});
    
   const handleInputChange = (e) => {
    const value = e.target.value;
    onAgeRangeChange(value);

    // Validación del formato de edad
    if (value.trim() === '') {
      setErrors({ age_range: "Este campo es obligatorio" });
    } else if (!/^\d+\s*a\s*\d+\s*años?$/.test(value)) {
      setErrors({ age_range: "Formato debe ser '5 a 10 años'" });
    } else {
      setErrors({ age_range: '' });
    }
  };

  return (
    <label className="form-control w-full">
        <div className="label">
          <span className="block text-sm font-medium text-gray-700">Rango de edad</span>
        </div>
    
      <input
          type="text"
          name="age_range"
          value={ageRange}
          onChange={handleInputChange}
          onBlur={() => {
            const ageRangeValue = ageRange.trim();
            if (ageRangeValue === '') {
              setErrors(prevErrors => ({
                ...prevErrors,
                age_range: "Este campo es obligatorio"
              }));
            } else if (!/^\d+(\s*a\s*\d+)?\s*años?$/.test(ageRangeValue)) {
              setErrors(prevErrors => ({
                ...prevErrors,
                age_range: "Formato debe ser '5 a 10 años'"
              }));
            } else {
              setErrors(prevErrors => ({
                ...prevErrors,
                age_range: ''
              }));
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault(); 
              e.target.blur(); 
            }
          }}
          placeholder="Ejemplo: 5 a 10 años"
          className={`input input-bordered w-full ${errors.age_range ? 'border-red-500' : ''}`}
          autoComplete="off"
        />
        {errors.age_range && <p className="text-sm text-red-500 mt-1">{errors.age_range}</p>}
      </label>

  );
};

export default Age;
