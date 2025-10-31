import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { listingApi } from "../services/listingApi";
import {
  FaCamera,
  FaPlus,
  FaSync,
  FaSearch,
  FaShoppingBag,
  FaTimes,
  FaEdit,
  FaExclamationCircle,
  FaUserPlus,
  FaSignInAlt,
} from "react-icons/fa";
import "../styles/HomePage.css";

const HomePage = () => {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const result = await listingApi.getAll();
      if (result.success) {
        setListings(result.data);
        setError(null);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Failed to load listings");
    } finally {
      setLoading(false);
    }
  };
  if (loading || authLoading) {
    return (
      <div className="home-page">
        <main className="home-main">
          <div className="loading">Loading MarketLink...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="home-page">
      <main className="home-main">
        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-content">
            <h1>Welcome to MarketLink</h1>
            <p className="hero-subtitle">
              {isAuthenticated
                ? `Hello ${
                    user?.name || "User"
                  }! Discover amazing items in our marketplace.`
                : "Your marketplace connection platform - Buy, sell, and discover amazing items."}
            </p>{" "}
            <div className="hero-actions">
              {isAuthenticated ? (
                <button
                  className="btn-primary hero-btn"
                  onClick={() => navigate("/listings/create")}
                >
                  <FaPlus /> Sell Something
                </button>
              ) : (
                <div className="auth-buttons">
                  <button
                    className="btn-primary hero-btn"
                    onClick={() => navigate("/signup")}
                  >
                    <FaUserPlus /> Join MarketLink
                  </button>
                  <button
                    className="btn-secondary hero-btn"
                    onClick={() => navigate("/login")}
                  >
                    <FaSignInAlt /> Sign In
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Listings Section */}{" "}
        <div className="listings-section">
          <div className="section-header">
            <h2>
              <FaShoppingBag /> Latest Listings
            </h2>
            <div className="header-actions">
              <button onClick={fetchListings} className="refresh-btn">
                <FaSync /> Refresh
              </button>
              {isAuthenticated && (
                <button
                  onClick={() => navigate("/listings/create")}
                  className="create-btn"
                >
                  <FaPlus /> Add Listing
                </button>
              )}
            </div>
          </div>{" "}
          {error && (
            <div className="error-message">
              <p>
                <FaTimes /> {error}
              </p>
              <button onClick={fetchListings} className="retry-btn">
                <FaSync /> Try Again
              </button>
            </div>
          )}{" "}
          {listings.length === 0 && !error ? (
            <div className="no-listings">
              <h3>
                <FaSearch /> No listings found
              </h3>
              <p>Be the first to create a listing!</p>
              {isAuthenticated && (
                <button
                  onClick={() => navigate("/listings/create")}
                  className="btn-primary"
                >
                  <FaPlus /> Create First Listing
                </button>
              )}
            </div>
          ) : (
            <div className="listings-grid">
              {listings.slice(0, 10).map((listing) => (
                <div
                  key={listing.id}
                  className="listing-card"
                  onClick={() => navigate(`/listings/${listing.id}`)}
                >
                  {listing.images && listing.images.length > 0 ? (
                    <div className="listing-image">
                      <img
                        src={listing.images[0]}
                        alt={listing.title}
                        loading="lazy"
                      />
                      {listing.images.length > 1 && (
                        <div className="image-count">
                          +{listing.images.length - 1} more
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="listing-no-image">
                      <FaCamera />
                      <span>No Image</span>
                    </div>
                  )}
                  <div className="listing-content">
                    <h3 className="listing-title">{listing.title}</h3>
                    <p className="listing-description">
                      {listing.description.length > 80
                        ? listing.description.substring(0, 80) + "..."
                        : listing.description}
                    </p>

                    <div className="listing-details">
                      <div className="listing-price">${listing.price}</div>
                      <div className="listing-meta">
                        <span className="listing-category">
                          {listing.category}
                        </span>
                        <span className="listing-condition">
                          {listing.condition}
                        </span>
                      </div>
                    </div>

                    <div className="listing-footer">
                      <span className="listing-date">
                        {new Date(listing.created_at).toLocaleDateString()}
                      </span>{" "}
                      {isAuthenticated && user?.id === listing.user_id && (
                        <div className="listing-actions">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/listings/${listing.id}/edit`);
                            }}
                            className="edit-btn"
                          >
                            <FaEdit />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}{" "}
            </div>
          )}{" "}
          {/* Show More Items Button */}
          {listings.length > 10 && (
            <div className="view-all-section">
              <button
                onClick={() => navigate("/listings")}
                className="view-all-btn"
              >
                Show More Items ({listings.length} total)
              </button>
            </div>
          )}
        </div>
        {/* Call to Action Section */}
        {!isAuthenticated && listings.length > 0 && (
          <div className="cta-section">
            <div className="cta-content">
              <h3>Ready to start selling?</h3>
              <p>
                Join thousands of users buying and selling on MarketLink
              </p>{" "}
              <div className="cta-buttons">
                <button
                  onClick={() => navigate("/signup")}
                  className="btn-primary"
                >
                  <FaUserPlus /> Create Account
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="btn-secondary"
                >
                  <FaSignInAlt /> Sign In
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;
