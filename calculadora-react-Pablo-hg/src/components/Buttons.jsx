import React from "react";
import "./Buttons.css";

const Buttons = ({ onClick }) => {
  //texto de los botones
  const buttons = [
    "%",
    "CE",
    "C",
    "DEL",
    "1/x",
    "x²",
    "²√x",
    "/",
    "7",
    "8",
    "9",
    "*",
    "4",
    "5",
    "6",
    "-",
    "1",
    "2",
    "3",
    "+",
    "+/-",
    "0",
    ".",
    "=",
  ];

  return (
    <div className="buttons">
      {/* Creamos un boton por cada elemento en "buttons" */}
      {buttons.map((button, index) => (
        // Al hacer click en el boton, le mandamos al padre el valor del boton
        <button key={index} onClick={() => onClick(button)}>
          {button}
        </button>
      ))}
    </div>
  );
};

export default Buttons;
