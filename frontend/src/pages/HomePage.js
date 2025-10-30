import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/HomePage.css";
import NavBar from "../components/NavBar";
const HomePage = () => {
  const { isAuthenticated, user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="home-page">
        <NavBar />
        <main className="home-main">
          <div className="loading">Loading...</div>
        </main>
      </div>
    );
  }
  return (
    <div className="home-page">
      <main className="home-main">
        <div className="home-content">
          <h1>Welcome to MarketLink</h1>

          {isAuthenticated ? (
            <div className="welcome-user">
              <h2>Hello, {user?.name || "User"}!</h2>
              <p>You are successfully logged in.</p>{" "}
              <div className="user-actions">
                <button className="btn-primary">Browse Marketplace</button>{" "}
                <button className="btn-secondary">My Profile</button>
                <button
                  className="btn-secondary"
                  onClick={() => navigate("/test")}
                >
                  🧪 Test Auth
                </button>
              </div>
            </div>
          ) : (
            <div className="welcome-guest">
              <h2>Your marketplace connection platform</h2>
              <p>
                Sign in to access all features and start connecting with the
                marketplace.
              </p>{" "}
              <div className="guest-actions">
                {" "}
                <button
                  className="btn-primary"
                  onClick={() => navigate("/login")}
                >
                  Sign In
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => navigate("/signup")}
                >
                  Sign Up
                </button>{" "}
                <button
                  className="btn-secondary"
                  onClick={() => navigate("/test")}
                >
                  🧪 Test Auth
                </button>
              </div>
            </div>
          )}

          <div className="auth-status">
            <p>
              <strong>Auth Status:</strong>{" "}
              {isAuthenticated ? "Logged In" : "Not Logged In"}
            </p>
            {user && (
              <div>
                <p>
                  <strong>User:</strong> {user.name} ({user.email})
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
