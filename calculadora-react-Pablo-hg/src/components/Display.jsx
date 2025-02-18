import React from "react";
import "./Display.css";

const Display = ({ value }) => {
  return (
    <div className="display">
      <span>{value}</span>
    </div>
  );
};

export default Display;
