import React from "react";
import NavBar from "../components/NavBar";
import { AuthProvider } from "../contexts/AuthContext";

const Layout = ({ children }) => {
  return (
    <AuthProvider>
      <NavBar />
      {children}
    </AuthProvider>
  );
};

export default Layout;
