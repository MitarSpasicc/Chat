import React from "react";
import "../styles/popup.css";

export default function Popup({ message }) {
  return (
    <div className="popup">
      <p>{message}</p>
    </div>
  );
}
