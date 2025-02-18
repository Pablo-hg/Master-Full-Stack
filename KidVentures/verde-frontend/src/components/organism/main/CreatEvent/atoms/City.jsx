import React from "react";

const City = ({ cities, selectedCity, onChange, error }) => {
  // Ordenar las ciudades alfabéticamente por su nombre
  const sortedCities = [...cities].sort((a, b) =>
    a.name.localeCompare(b.name, "es", { sensitivity: "base" })
  );

  return (
    <label className="form-control w-full">
      <div className="label">
        <span className="block text-sm font-medium text-gray-700">Ciudad</span>
      </div>
      <select
        name="city"
        value={selectedCity}
        onChange={(e) => onChange(e.target.name, e.target.value)}
        className={`select select-bordered w-full ${
          error ? "border-red-500" : ""
        }`}
        autoComplete="off"
      >
        <option value="" disabled>
          Selecciona una ciudad
        </option>
        {sortedCities.map((city, index) => (
          <option key={city.id || index} value={city.id}>
            {city.name}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </label>
  );
};

export default City;
