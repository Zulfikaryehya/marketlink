import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaTimes, FaHome } from "react-icons/fa";
import "../styles/NotFoundPage.css";

const NotFoundPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to listings page with search query
      navigate(`/listings?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleReturnHome = () => {
    navigate("/");
  };

  return (
    <div className="not-found-page">
      <div className="not-found-container">
        {/* Icon Section */}
        <div className="not-found-icon">
          <div className="search-icon-wrapper">
            <FaSearch className="search-icon" />
            <FaTimes className="x-icon" />
          </div>
        </div>

        {/* Content Section */}
        <div className="not-found-content">
          <h1 className="not-found-title">Oops! Page Not Found.</h1>
          <p className="not-found-description">
            We can't seem to find the page you're looking for. Try searching or
            go back to the homepage.
          </p>

          {/* Search Section */}
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-wrapper">
              <FaSearch className="search-input-icon" />
              <input
                type="text"
                placeholder="Search for items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </form>

          {/* Return Button */}
          <button onClick={handleReturnHome} className="return-home-btn">
            <FaHome />
            Return to Homepage
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
