import HomePage from "./pages/HomePage";
import SignupPage from "./pages/auth/SignupPage";
import LoginPage from "./pages/auth/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import TestPage from "./pages/TestPage";
import ListingsPage from "./pages/ListingsPage";
import CreateListingPage from "./pages/CreateListingPage";
import ListingDetailPage from "./pages/ListingDetailPage";
import EditListingPage from "./pages/EditListingPage";
import Layout from "./components/Layout";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

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
    path: "/test",
    element: (
      <Layout>
        <TestPage />
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
        <CreateListingPage />
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
    <RouterProvider router={router} />
  </React.StrictMode>
);
