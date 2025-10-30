import React, { useState } from "react";
import "../styles/NavBar.css";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const { isAuthenticated, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
            </li>
            <li className="nav-item">
              {!loading && (
                <>
                  {" "}
                  {isAuthenticated ? (
                    <button
                      onClick={handleLogout}
                      className="nav-link logout-btn"
                    >
                      Logout
                    </button>
                  ) : (
                    <a
                      href="#login"
                      onClick={(e) => handleNavigation(e, "login")}
                      className="nav-link"
                    >
                      Sign In
                    </a>
                  )}
                </>
              )}
            </li>{" "}
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
                </a>
                <div className="mobile-nav-divider"></div>
                {!loading && (
                  <>
                    {isAuthenticated ? (
                      <button
                        onClick={handleMobileLogout}
                        className="mobile-nav-link logout-mobile"
                      >
                        🚪 Logout
                      </button>
                    ) : (
                      <a
                        href="#login"
                        onClick={(e) => handleNavigation(e, "login")}
                        className="mobile-nav-link signin-mobile"
                      >
                        🔐 Sign In
                      </a>
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
