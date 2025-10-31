import React from "react";
import { FaInfoCircle } from "react-icons/fa";

const ErrorMessage = ({ error }) => {
  if (!error) return null;

  return (
    <div className="error-message">
      <FaInfoCircle />
      <span>{error}</span>
    </div>
  );
};

export default ErrorMessage;
