import React from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { AuthProvider } from "../contexts/AuthContext";
import "../styles/Layout.css";

const Layout = ({ children }) => {
  return (
    <AuthProvider>
      <div className="layout-wrapper">
        <NavBar />
        <main className="main-content">{children}</main>
        <Footer />
      </div>
    </AuthProvider>
  );
};

export default Layout;
