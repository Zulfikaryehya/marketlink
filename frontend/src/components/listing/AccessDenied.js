import React from "react";
import { useNavigate } from "react-router-dom";

const AccessDenied = () => {
  const navigate = useNavigate();

  return (
    <div className="access-denied">
      <div className="access-denied-content">
        <h2>🔒 Access Denied</h2>
        <p>You must be logged in to access this page.</p>
        <button onClick={() => navigate("/login")} className="login-btn">
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default AccessDenied;
