import React from 'react';

const Category = ({ categories, selectedCategory, onChange, error }) => (
  <label className="form-control w-full">
    <div className="label">
      <span className="block text-sm font-medium text-gray-700">Categoría</span>
    </div>
    <select
      name="category"
      value={selectedCategory}
      onChange={(e) => onChange(e.target.name, e.target.value)}
      className={`select select-bordered w-full ${error ? 'border-red-500' : ''}`}
      autoComplete="off"
    >
      <option value="" disabled>Selecciona una categoría</option>
      {categories.length > 0 ? (
        categories.map((category) => (
          <option key={category._id} value={category.name}>
            {category.name}
          </option>
        ))
      ) : (
        <option disabled>Cargando categorías...</option>
      )}
    </select>
    {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
  </label>
);

export default Category;
