import React from "react";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import SignUpPage from "./pages/auth/SignupPage";
import TestPage from "./pages/TestPage";
import NotFoundPage from "./pages/NotFoundPage";
import { AuthProvider } from "./contexts/AuthContext";
import {
  NavigationProvider,
  useNavigation,
} from "./contexts/NavigationContext";
// import "./App.css";

function AppContent() {
  const { currentPage } = useNavigation();
  const renderPage = () => {
    switch (currentPage) {
      case "login":
        return <LoginPage />;
      case "signup":
        return <SignUpPage />;
      case "test":
        return <TestPage />;
      case "404":
      case "not-found":
        return <NotFoundPage />;
      default:
        return <HomePage />;
    }
  };

  return <div className="App">{renderPage()}</div>;
}

function App() {
  return (
    <AuthProvider>
      <NavigationProvider>
        <AppContent />
      </NavigationProvider>
    </AuthProvider>
  );
}

export default App;
