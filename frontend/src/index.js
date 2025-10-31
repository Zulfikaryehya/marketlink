import HomePage from "./pages/HomePage";
import SignupPage from "./pages/auth/SignupPage";
import LoginPage from "./pages/auth/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import ListingsPage from "./pages/ListingsPage";
import ListingDetailPage from "./pages/ListingDetailPage";
import EditListingPage from "./pages/EditListingPage";
import ProfilePage from "./pages/ProfilePage";
import Layout from "./components/Layout";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CreateListingPageClean from "./pages/CreateListingPageClean";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "react-hot-toast";
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Layout>
        <HomePage />
      </Layout>
    ),
  },
  {
    path: "/signup",
    element: (
      <Layout>
        <SignupPage />
      </Layout>
    ),
  },
  {
    path: "/login",
    element: (
      <Layout>
        <LoginPage />
      </Layout>
    ),
  },
  {
    path: "/listings",
    element: (
      <Layout>
        <ListingsPage />
      </Layout>
    ),
  },
  {
    path: "/listings/create",
    element: (
      <Layout>
        <CreateListingPageClean />
      </Layout>
    ),
  },
  {
    path: "/listings/:id",
    element: (
      <Layout>
        <ListingDetailPage />
      </Layout>
    ),
  },
  {
    path: "/listings/:id/edit",
    element: (
      <Layout>
        <EditListingPage />
      </Layout>
    ),
  },
  {
    path: "/profile",
    element: (
      <Layout>
        <ProfilePage />
      </Layout>
    ),
  },
  {
    path: "/profile/:userId",
    element: (
      <Layout>
        <ProfilePage />
      </Layout>
    ),
  },

  {
    path: "*",
    element: (
      <Layout>
        <NotFoundPage />
      </Layout>
    ),
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster />
    </AuthProvider>
  </React.StrictMode>
);
