import React from "react";

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="loading-container">
      <div className="loading-content">
        <div className="spinner"></div>
        <h3>{message}</h3>
      </div>
    </div>
  );
};

export default LoadingSpinner;
