import React from "react";
import NavBar from "../components/NavBar";
import { useAuth } from "../contexts/AuthContext";
import { useNavigation } from "../contexts/NavigationContext";
import "../styles/TestPage.css";

const TestPage = () => {
  const { isAuthenticated, user, loading, logout } = useAuth();
  const { navigateTo } = useNavigation();

  const handleQuickLogout = async () => {
    await logout();
  };

  if (loading) {
    return (
      <div className="test-page">
        <NavBar />
        <main className="test-main">
          <div className="loading">Loading authentication state...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="test-page">
      <NavBar />

      <main className="test-main">
        <div className="test-container">
          <h1>🧪 Authentication Test Page</h1>

          <div className="auth-status-card">
            <h2>Current Authentication Status</h2>
            <div className="status-grid">
              <div className="status-item">
                <strong>Authenticated:</strong>
                <span
                  className={`status ${
                    isAuthenticated ? "authenticated" : "not-authenticated"
                  }`}
                >
                  {isAuthenticated ? "✅ Yes" : "❌ No"}
                </span>
              </div>
              <div className="status-item">
                <strong>User Data:</strong>
                <span>{user ? JSON.stringify(user, null, 2) : "None"}</span>
              </div>
              <div className="status-item">
                <strong>Token:</strong>
                <span>
                  {localStorage.getItem("token") ? "🔑 Present" : "🚫 None"}
                </span>
              </div>
            </div>
          </div>

          <div className="test-actions">
            <h3>Test Navigation</h3>
            <div className="button-grid">
              <button
                className="test-btn primary"
                onClick={() => navigateTo("home")}
              >
                🏠 Go to Home
              </button>
              <button
                className="test-btn secondary"
                onClick={() => navigateTo("login")}
              >
                🔐 Go to Login
              </button>
              <button
                className="test-btn secondary"
                onClick={() => navigateTo("signup")}
              >
                📝 Go to Sign Up
              </button>
            </div>
          </div>

          {isAuthenticated && (
            <div className="logout-section">
              <h3>Quick Logout Test</h3>
              <p>Test the logout functionality directly:</p>
              <button className="test-btn danger" onClick={handleQuickLogout}>
                🚪 Quick Logout
              </button>
            </div>
          )}

          <div className="navbar-demo">
            <h3>🧭 Navbar Behavior Demo</h3>
            <p>The navbar should show:</p>
            <ul>
              <li>
                <strong>When NOT logged in:</strong> Home, Browse, About,{" "}
                <span className="highlight">Sign In</span>
              </li>
              <li>
                <strong>When logged in:</strong> Home, Browse, About,{" "}
                <span className="highlight">Logout</span>
              </li>
            </ul>
            <p>Look at the navbar above to see it in action!</p>
          </div>

          <div className="localStorage-debug">
            <h3>🔍 LocalStorage Debug</h3>
            <div className="debug-grid">
              <div className="debug-item">
                <strong>token:</strong>{" "}
                {localStorage.getItem("token") || "null"}
              </div>
              <div className="debug-item">
                <strong>token_type:</strong>{" "}
                {localStorage.getItem("token_type") || "null"}
              </div>
              <div className="debug-item">
                <strong>expires_in:</strong>{" "}
                {localStorage.getItem("expires_in") || "null"}
              </div>
              <div className="debug-item">
                <strong>user:</strong> {localStorage.getItem("user") || "null"}
              </div>
            </div>
            <button
              className="test-btn warning"
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
            >
              🗑️ Clear All LocalStorage
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TestPage;
