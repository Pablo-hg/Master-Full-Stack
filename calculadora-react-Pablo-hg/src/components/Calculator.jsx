import React, { useState } from "react";
import Buttons from "./Buttons";
import "./Calculator.css";
import Display from "./Display";

const Calculator = () => {
  const [operation, setOperation] = useState("");
  const [result, setResult] = useState("");
  const [history, setHistory] = useState([]); // Historial de operaciones

  // Dependiendo del valor que recibamos haremos x cosa
  const handleButtonClick = (value) => {
    if (value === "=") {
      const evaluatedResult = new Function(`return ${operation}`)();
      setResult(evaluatedResult);
      setHistory([...history, { operation, result: evaluatedResult }]);
      setOperation("");
      // reseteamos las operaciones y el resultado
    } else if (value === "C") {
      setOperation("");
      setResult("");
      // reseteamos el resultado
    } else if (value === "CE") {
      setResult("");
    } else if (value === "DEL") {
      // borramos el último caracter (ya sea operador o numero)
      setOperation(operation.slice(0, -1));
    } else if (value === "x²") {
      // el valor anterior de "operation" lo multiplicamos *2
      setOperation((prev) => `${prev}**2`);
    } else if (value === "²√x") {
      // hacemos la raiz cuadrado del valor anterior
      setOperation((prev) => `Math.sqrt(${prev})`);
    } else if (value === "1/x") {
      // dividimos 1 entre el valor anterior
      setOperation((prev) => `1/(${prev})`);
    } else if (value === "%") {
      // dividimos el valor anterior entre 100
      setOperation((prev) => `${prev}/100`);
      // cambiamos de signo el valor
    } else if (value === "+/-") {
      setOperation((prev) => `-(${prev})`);
    } else {
      setOperation((prev) => prev + value);
    }
  };

  return (
    <div className="calculator-container">
      <div className="calculator">
        {/* Dentro de display, podemos tener, el resultado, la operacion o "0" */}
        <Display value={result || operation || "0"} />
        {/* Al pulsar en el boton, ejecutamos la funcion "handleButtonClick" con el
        valor del boton "hijo" que hemos recibido */}
        <Buttons onClick={handleButtonClick} />
      </div>
      <div className="history-panel">
        <h3>Historial</h3>
        <ul>
          {/* recorremos el historial y creamos un elemento con la operacion y el resultado */}
          {history.map((item, index) => (
            <li key={index}>
              <span>{item.operation}</span>
              <span> = {item.result}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Calculator;
