import React, { useState, useEffect } from "react";
import "../styles/NavBar.css";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const { user } = useAuth();
  const userId = user?.id;
  const { isAuthenticated, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Manage body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add("mobile-menu-open");
    } else {
      document.body.classList.remove("mobile-menu-open");
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove("mobile-menu-open");
    };
  }, [isMobileMenuOpen]);

  const handleLogout = async () => {
    await logout();
    navigate("/"); // Navigate to home after logout
  };
  const handleNavigation = (e, page) => {
    e.preventDefault();
    const routeMap = {
      home: "/",
      login: "/login",
      signup: "/signup",
      test: "/test",
      browse: "/listings",
      about: "/about",
      profile: `/profile/${user?.id}`, // Fallback to localStorage
    };
    navigate(routeMap[page] || "/");
    setIsMobileMenuOpen(false); // Close mobile menu on navigation
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileLogout = async () => {
    await logout();
    navigate("/");
    setIsMobileMenuOpen(false); // Close mobile menu after logout
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo Section */}{" "}
        <div
          className="navbar-logo"
          onClick={(e) => handleNavigation(e, "home")}
        >
          <div className="logo-icon">
            <div className="diamond-shape"></div>
          </div>
          <span className="logo-text">MarketLink</span>
        </div>
        {/* Mobile Menu Button */}
        <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
          <span
            className={`hamburger-line ${isMobileMenuOpen ? "open" : ""}`}
          ></span>
          <span
            className={`hamburger-line ${isMobileMenuOpen ? "open" : ""}`}
          ></span>
          <span
            className={`hamburger-line ${isMobileMenuOpen ? "open" : ""}`}
          ></span>
        </button>
        {/* Navigation Items */}
        <div className={`navbar-menu ${isMobileMenuOpen ? "mobile-open" : ""}`}>
          <ul className="navbar-nav">
            <li className="nav-item">
              {" "}
              <a
                href="#home"
                onClick={(e) => handleNavigation(e, "home")}
                className="nav-link"
              >
                Home
              </a>
            </li>
            <li className="nav-item">
              {" "}
              <a
                href="#browse"
                onClick={(e) => handleNavigation(e, "browse")}
                className="nav-link"
              >
                Browse
              </a>
            </li>{" "}
            <li className="nav-item">
              {" "}
              <a
                href="#about"
                onClick={(e) => handleNavigation(e, "about")}
                className="nav-link"
              >
                About
              </a>
            </li>{" "}
            <li className="nav-item auth-section">
              {!loading && (
                <>
                  {isAuthenticated ? (
                    <div className="authenticated-nav">
                      <button
                        onClick={(e) => handleNavigation(e, "profile")}
                        className="profile-btn"
                        title="Profile"
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                      </button>
                      <button
                        onClick={handleLogout}
                        className="logout-btn modern-btn"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="logout-icon"
                        >
                          <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  ) : (
                    <div className="unauthenticated-nav">
                      <a
                        href="#login"
                        onClick={(e) => handleNavigation(e, "login")}
                        className="signin-btn modern-btn"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="signin-icon"
                        >
                          <path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z" />
                        </svg>
                        Sign In
                      </a>
                      <a
                        href="#signup"
                        onClick={(e) => handleNavigation(e, "signup")}
                        className="signup-btn modern-btn"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="signup-icon"
                        >
                          <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                        Join Now
                      </a>
                    </div>
                  )}
                </>
              )}
            </li>
          </ul>
        </div>
        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="mobile-menu-overlay" onClick={toggleMobileMenu}>
            <div
              className="mobile-menu-content"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mobile-menu-header">
                <div className="mobile-logo">
                  <div className="logo-icon">
                    <div className="diamond-shape"></div>
                  </div>
                  <span className="logo-text">MarketLink</span>
                </div>
                {/* <button
                  className="close-mobile-menu"
                  onClick={toggleMobileMenu}
                >
                  ×
                </button> */}
              </div>

              <nav className="mobile-nav">
                <a
                  href="#home"
                  onClick={(e) => handleNavigation(e, "home")}
                  className="mobile-nav-link"
                >
                  🏠 Home
                </a>
                <a
                  href="#browse"
                  onClick={(e) => handleNavigation(e, "browse")}
                  className="mobile-nav-link"
                >
                  🔍 Browse
                </a>
                <a
                  href="#about"
                  onClick={(e) => handleNavigation(e, "about")}
                  className="mobile-nav-link"
                >
                  ℹ️ About
                </a>{" "}
                <div className="mobile-nav-divider"></div>
                {!loading && (
                  <>
                    {isAuthenticated ? (
                      <>
                        <a
                          href="#profile"
                          onClick={(e) => handleNavigation(e, "profile")}
                          className="mobile-nav-link profile-mobile"
                        >
                          👤 Profile
                        </a>
                        <button
                          onClick={handleMobileLogout}
                          className="mobile-nav-link logout-mobile"
                        >
                          🚪 Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <a
                          href="#login"
                          onClick={(e) => handleNavigation(e, "login")}
                          className="mobile-nav-link signin-mobile"
                        >
                          🔐 Sign In
                        </a>
                        <a
                          href="#signup"
                          onClick={(e) => handleNavigation(e, "signup")}
                          className="mobile-nav-link signup-mobile"
                        >
                          ✨ Join Now
                        </a>
                      </>
                    )}
                  </>
                )}
              </nav>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
