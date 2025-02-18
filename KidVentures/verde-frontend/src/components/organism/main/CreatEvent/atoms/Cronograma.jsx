import  { useState, useRef, useEffect } from "react";
import { Calendar, utils } from "@hassanmojab/react-modern-calendar-datepicker";
import "@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css";
import './custom-calendar.css';
import { FaCalendarAlt, FaTimes } from "react-icons/fa";

const Cronograma = ({ eventData, setEventData }) => {
  const [openCalendar, setOpenCalendar] = useState(false);
  const [isUniqueDate, setIsUniqueDate] = useState(false); // Estado para "¿Es solo una fecha?"
  const [showRecurrenceOptions, setShowRecurrenceOptions] = useState(false);
  const calendarRef = useRef();

  // Formatear y guardar las fechas seleccionadas
  const handleDateChange = (dates) => {
    const formattedDates = dates.map((date) =>
      `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`
    );

    setEventData((prevData) => ({
      ...prevData,
      dates: formattedDates,
    }));

    // Si el usuario selecciona solo una fecha, activar la pregunta
    if (formattedDates.length === 1) {
      setIsUniqueDate(true);
    } else {
      setIsUniqueDate(false);
      setShowRecurrenceOptions(false); 
    }
  };

  // Limpiar las fechas seleccionadas
  const clearDates = () => {
    setEventData((prevData) => ({
      ...prevData,
      dates: [],
    }));
    setIsUniqueDate(false);
    setShowRecurrenceOptions(false); 
  };
  
  // Manejar selección de "¿Es solo una fecha?"
  const handleUniqueDateSelection = (isYes) => {
    setIsUniqueDate(isYes);

    if (!isYes) {
      setEventData((prevData) => ({
        ...prevData,
        recurrence: "", // Limpiar frecuencia si selecciona "Sí"
      }));
    }
  };

  // Manejar la selección de la recurrencia
  const handleRecurrenceChange = (e) => {
    const { value } = e.target;
    setEventData((prevData) => ({
      ...prevData,
      recurrence: {
        ...prevData.recurrence,
        frequency: value, // Guarda la frecuencia en el objeto recurrence
      },
    }));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setOpenCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <label className="form-control w-full">
      <div className="label">
        <span className="block text-sm font-medium text-gray-700">Cronograma</span>
      </div>

      <div className="relative w-full">
        <FaCalendarAlt
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
          onClick={() => setOpenCalendar(!openCalendar)}
        />

        {eventData.dates.length > 0 && (
          <FaTimes
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
            onClick={clearDates}
          />
        )}

        <input
          type="text"
          readOnly
          placeholder="Elige fecha"
          value={
            eventData.dates.length > 0
               ? eventData.dates.join(", ")
              : ""
          }
          onClick={() => setOpenCalendar(!openCalendar)}
          onKeyDown={(e) => e.key === "Enter" && setOpenCalendar(false)}
          className="input input-bordered w-full pl-10 cursor-pointer"
        />

        {openCalendar && (
          <div className="absolute top-full mt-2 z-50 bg-white shadow-lg rounded-md" ref={calendarRef}>
            <Calendar
              value={eventData.dates.map((date) => {
                const [year, month, day] = date.split("-").map(Number);
                return { year, month, day };
              })}
              onChange={handleDateChange}
              colorPrimary="#0fbcf9"
              shouldHighlightWeekends
              minimumDate={utils().getToday()}
              calendarClassName="custom-calendar"
              calendarTodayClassName="custom-today-day"
            />
          </div>
        )}
      </div>

      {/* Mostrar la pregunta si hay solo una fecha */}
      {isUniqueDate && (
        <div className="mt-4">
        <span>¿Es solo una fecha?</span>
        <div className="flex space-x-4 mt-2">
          <button
            className={`btn ${!isUniqueDate ? "btn-primary" : ""}`}
            onClick={() => handleUniqueDateSelection(false)}
          >
            No
          </button>
          <button
            className={`btn ${isUniqueDate ? "btn-primary" : ""}`}
            onClick={() => handleUniqueDateSelection(true)}
          >
            Sí
          </button>
        </div>

          {/* Mostrar selector de frecuencia si selecciona "No" */}
          {showRecurrenceOptions && (
            <div className="mt-4">
              <span>Frecuencia de recurrencia:</span>
              <select
                value={eventData.recurrence || ""}
                onChange={handleRecurrenceChange}
                className="select select-bordered w-full mt-2"
              >
                <option value="" disabled>
                  Selecciona la frecuencia
                </option>
                <option value="weekly">Semanal</option>
                <option value="monthly">Mensual</option>
              </select>
            </div>
          )}
        </div>
      )}
    </label>
  );
};

export default Cronograma;
