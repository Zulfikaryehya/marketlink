import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/ProfilePage.css";

const ProfilePage = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-loading">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar">
            <div className="avatar-circle">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          </div>
          <div className="profile-info">
            <h1>Welcome, {user?.name || "User"}!</h1>
            <p className="profile-email">{user?.email}</p>
          </div>
        </div>

        {/* Profile Content */}
        <div className="profile-content">
          <div className="profile-section">
            <h2>🏗️ Profile Page Coming Soon</h2>
            <p>We're building an amazing profile experience for you!</p>

            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">👤</div>
                <h3>Personal Info</h3>
                <p>Update your profile details and preferences</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">🛍️</div>
                <h3>My Listings</h3>
                <p>Manage your active and past listings</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">💬</div>
                <h3>Messages</h3>
                <p>Chat with buyers and sellers</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">⭐</div>
                <h3>Favorites</h3>
                <p>Keep track of items you love</p>
              </div>
            </div>

            <div className="quick-actions">
              <button
                onClick={() => navigate("/listings/create")}
                className="action-btn primary"
              >
                ➕ Create New Listing
              </button>
              <button
                onClick={() => navigate("/listings")}
                className="action-btn secondary"
              >
                🔍 Browse Listings
              </button>
              <button
                onClick={() => navigate("/")}
                className="action-btn secondary"
              >
                🏠 Go Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
