import React from "react";
import "../styles/NavBar.css";
import { useAuth } from "../contexts/AuthContext";
import { useNavigation } from "../contexts/NavigationContext";

const NavBar = () => {
  const { isAuthenticated, logout, loading } = useAuth();
  const { navigateTo } = useNavigation();

  const handleLogout = async () => {
    await logout();
    navigateTo("home"); // Navigate to home after logout
  };

  const handleNavigation = (e, page) => {
    e.preventDefault();
    navigateTo(page);
  };
  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo Section */}
        <div className="navbar-logo">
          <div className="logo-icon">
            <div className="diamond-shape"></div>
          </div>
          <span className="logo-text">MarketLink</span>
        </div>{" "}
        {/* Navigation Items */}
        <div className="navbar-menu">
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
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
