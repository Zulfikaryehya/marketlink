import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { listingApi } from "../services/listingApi";
import { useAuth } from "../contexts/AuthContext";

const ListingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    setLoading(true);
    try {
      const result = await listingApi.getById(id);
      if (result.success) {
        setListing(result.data);
        setError(null);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Failed to load listing");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      const result = await listingApi.delete(id);
      if (result.success) {
        alert("Listing deleted successfully!");
        navigate("/listings");
      } else {
        alert(`Error: ${result.error}`);
      }
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h3>Loading listing details...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <div style={{ color: "red", marginBottom: "20px" }}>
          <h3>Error Loading Listing</h3>
          <p>{error}</p>
        </div>
        <button
          onClick={() => navigate("/listings")}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          ← Back to Listings
        </button>
      </div>
    );
  }

  if (!listing) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h3>Listing not found</h3>
        <button
          onClick={() => navigate("/listings")}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          ← Back to Listings
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      {/* Navigation */}
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => navigate("/listings")}
          style={{
            padding: "8px 15px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "5px",
            marginRight: "10px",
          }}
        >
          ← Back to Listings
        </button>
      </div>

      {/* Listing Details */}
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "30px",
          backgroundColor: "#f9f9f9",
        }}
      >
        <h1 style={{ margin: "0 0 20px 0", color: "#333" }}>{listing.title}</h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            marginBottom: "20px",
          }}
        >
          <div>
            <h3 style={{ margin: "0 0 10px 0", color: "#555" }}>💰 Price</h3>
            <p
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                color: "#28a745",
                margin: "0",
              }}
            >
              ${parseFloat(listing.price).toFixed(2)}
            </p>
          </div>

          <div>
            <h3 style={{ margin: "0 0 10px 0", color: "#555" }}>📂 Category</h3>
            <p style={{ margin: "0", fontSize: "16px" }}>{listing.category}</p>
          </div>

          <div>
            <h3 style={{ margin: "0 0 10px 0", color: "#555" }}>
              🔧 Condition
            </h3>
            <p
              style={{
                margin: "0",
                fontSize: "16px",
                textTransform: "capitalize",
              }}
            >
              {listing.condition}
            </p>
          </div>

          <div>
            <h3 style={{ margin: "0 0 10px 0", color: "#555" }}>📅 Posted</h3>
            <p style={{ margin: "0", fontSize: "16px" }}>
              {new Date(listing.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <h3 style={{ margin: "0 0 10px 0", color: "#555" }}>
            📝 Description
          </h3>
          <p
            style={{
              margin: "0",
              fontSize: "16px",
              lineHeight: "1.6",
              whiteSpace: "pre-wrap",
            }}
          >
            {listing.description}
          </p>
        </div>

        {/* Action Buttons */}
        {isAuthenticated && (
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "30px",
              borderTop: "1px solid #eee",
              paddingTop: "20px",
            }}
          >
            <button
              onClick={() => navigate(`/listings/${listing.id}/edit`)}
              style={{
                padding: "10px 20px",
                backgroundColor: "#ffc107",
                color: "black",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              ✏️ Edit Listing
            </button>
            <button
              onClick={handleDelete}
              style={{
                padding: "10px 20px",
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              🗑️ Delete Listing
            </button>
          </div>
        )}
      </div>

      {/* API Testing Section */}
      <div
        style={{
          marginTop: "40px",
          padding: "20px",
          backgroundColor: "#f8f9fa",
          borderRadius: "5px",
        }}
      >
        <h3>🧪 API Testing Info</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          <div>
            <p>
              <strong>API Endpoint:</strong> GET /api/listings/{id}
            </p>
            <p>
              <strong>Listing ID:</strong> {listing.id}
            </p>
            <p>
              <strong>User ID:</strong> {listing.user_id}
            </p>
          </div>
          <div>
            <p>
              <strong>Created:</strong> {listing.created_at}
            </p>
            <p>
              <strong>Updated:</strong> {listing.updated_at}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              {listing.is_active ? "Active" : "Inactive"}
            </p>
          </div>
        </div>

        <div style={{ marginTop: "15px" }}>
          <button
            onClick={() => console.log("Full listing object:", listing)}
            style={{
              padding: "8px 15px",
              backgroundColor: "#17a2b8",
              color: "white",
              border: "none",
              borderRadius: "5px",
              marginRight: "10px",
            }}
          >
            🖥️ Log to Console
          </button>
          <button
            onClick={fetchListing}
            style={{
              padding: "8px 15px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
          >
            🔄 Refresh Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListingDetailPage;
