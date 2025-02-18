// HorarioSelector.jsx
import React from 'react';

const Time = ({ startTime, endTime, onTimeChange}) => {
   
    const handleTimeChange = (name, value) => {
        console.log(`Field: ${name}, Value: ${value}`); 
        const toMinutes = (time) => {
            const [hours, minutes] = time.split(':').map(Number);
            return hours * 60 + minutes;
        };

        if (name === "endTime" && startTime) {
            const startMinutes = toMinutes(startTime);
            const endMinutes = toMinutes(value);

            if (endMinutes <= startMinutes) {
                onTimeChange(name, value, "La hora de fin debe ser posterior a la de inicio");
                return;
            }
        }
        
        // Validación también para `startTime` si `endTime` ya está establecido
        if (name === "startTime" && endTime) {
            const startMinutes = toMinutes(value);
            const endMinutes = toMinutes(endTime);

            if (startMinutes >= endMinutes) {
                onTimeChange(name, value, "La hora de inicio debe ser anterior a la de fin");
                return;
            }
        }

        onTimeChange(name, value, "");
    };



    return (
    <div className="flex gap-4 my-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Hora de Inicio</label>
        <input
          type="time"
          name="startTime"
          value={startTime}
          onChange={(e) => handleTimeChange('startTime', e.target.value)}
          className="mt-1 p-2 border border-gray-300 rounded-md w-full"
        
       
       />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Hora de Fin</label>
        <input
          type="time"
          name="endTime"
          value={endTime}
          onChange={(e) => handleTimeChange('endTime', e.target.value)}
          className="mt-1 p-2 border border-gray-300 rounded-md w-full"
        
       />
      </div>
    </div>
  );
};

export default Time;
