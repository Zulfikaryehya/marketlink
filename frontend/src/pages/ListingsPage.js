import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { listingApi } from "../services/listingApi";
import { useAuth } from "../contexts/AuthContext";

const ListingsPage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

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

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      const result = await listingApi.delete(id);
      if (result.success) {
        alert("Listing deleted successfully!");
        fetchListings(); // Refresh the list
      } else {
        alert(`Error: ${result.error}`);
      }
    }
  };

  if (loading) return <div>Loading listings...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>📋 All Listings</h1>
        {isAuthenticated && (
          <button
            onClick={() => navigate("/listings/create")}
            style={{
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
          >
            ➕ Create New Listing
          </button>
        )}
      </div>

      {error && (
        <div
          style={{
            color: "red",
            marginBottom: "20px",
            padding: "10px",
            border: "1px solid red",
            borderRadius: "5px",
          }}
        >
          Error: {error}
        </div>
      )}

      {listings.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
          <h3>No listings found</h3>
          <p>Be the first to create a listing!</p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          {listings.map((listing) => (
            <div
              key={listing.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "15px",
                backgroundColor: "#f9f9f9",
              }}
            >
              <h3 style={{ margin: "0 0 10px 0", color: "#333" }}>
                {listing.title}
              </h3>
              <p style={{ margin: "5px 0", color: "#666" }}>
                {listing.description}
              </p>
              <p style={{ margin: "5px 0" }}>
                <strong>Price:</strong> ${listing.price}
              </p>
              <p style={{ margin: "5px 0" }}>
                <strong>Category:</strong> {listing.category}
              </p>
              <p style={{ margin: "5px 0" }}>
                <strong>Condition:</strong> {listing.condition}
              </p>
              <p style={{ margin: "5px 0", fontSize: "12px", color: "#888" }}>
                <strong>Created:</strong>{" "}
                {new Date(listing.created_at).toLocaleDateString()}
              </p>

              <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
                <button
                  onClick={() => navigate(`/listings/${listing.id}`)}
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                    borderRadius: "3px",
                    cursor: "pointer",
                  }}
                >
                  👁️ View
                </button>
                {isAuthenticated && (
                  <>
                    <button
                      onClick={() => navigate(`/listings/${listing.id}/edit`)}
                      style={{
                        padding: "5px 10px",
                        backgroundColor: "#ffc107",
                        color: "black",
                        border: "none",
                        borderRadius: "3px",
                        cursor: "pointer",
                      }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(listing.id)}
                      style={{
                        padding: "5px 10px",
                        backgroundColor: "#dc3545",
                        color: "white",
                        border: "none",
                        borderRadius: "3px",
                        cursor: "pointer",
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: "40px", textAlign: "center" }}>
        <h3>🧪 API Test Actions</h3>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={fetchListings}
            style={{
              padding: "10px 15px",
              backgroundColor: "#17a2b8",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
          >
            🔄 Refresh Listings
          </button>
          <button
            onClick={() => console.log("Current listings:", listings)}
            style={{
              padding: "10px 15px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
          >
            🖥️ Log to Console
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListingsPage;
