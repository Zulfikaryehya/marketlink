import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { listingApi } from "../services/listingApi";
import { useAuth } from "../contexts/AuthContext";

const EditListingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    condition: "new",
    images: [],
  });
  const [newImages, setNewImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchListing();
    }
  }, [id, isAuthenticated]);

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>🔒 Access Denied</h2>
        <p>You must be logged in to edit a listing.</p>
        <button
          onClick={() => navigate("/login")}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Go to Login
        </button>
      </div>
    );
  }

  const fetchListing = async () => {
    setLoading(true);
    try {
      const result = await listingApi.getById(id);
      if (result.success) {
        const listing = result.data;
        setFormData({
          title: listing.title || "",
          description: listing.description || "",
          price: listing.price || "",
          category: listing.category || "",
          condition: listing.condition || "new",
          images: listing.images || [],
        });
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
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(files);

    // Create preview URLs for new images
    const previews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      isNew: true,
    }));
    setImagePreviews(previews);
  };

  const removeExistingImage = (index) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData((prev) => ({
      ...prev,
      images: newImages,
    }));
  };

  const removeNewImage = (index) => {
    const newImagesList = [...newImages];
    const newPreviews = [...imagePreviews];

    // Revoke the URL to prevent memory leaks
    URL.revokeObjectURL(newPreviews[index].url);

    newImagesList.splice(index, 1);
    newPreviews.splice(index, 1);

    setNewImages(newImagesList);
    setImagePreviews(newPreviews);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      // Use updateWithImages if new images are selected, otherwise use regular update
      const result =
        newImages.length > 0
          ? await listingApi.updateWithImages(id, formData, newImages)
          : await listingApi.update(id, formData);

      if (result.success) {
        alert("Listing updated successfully!");
        // Clean up image previews
        imagePreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
        navigate(`/listings/${id}`);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Failed to update listing");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h3>Loading listing...</h3>
      </div>
    );
  }

  if (error && !formData.title) {
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

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => navigate(`/listings/${id}`)}
          style={{
            padding: "8px 15px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "5px",
            marginRight: "10px",
          }}
        >
          ← Back to Listing
        </button>
        <button
          onClick={() => navigate("/listings")}
          style={{
            padding: "8px 15px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          All Listings
        </button>
      </div>

      <h1>✏️ Edit Listing</h1>

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

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "15px" }}
      >
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
            }}
          >
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Enter listing title"
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "5px",
            }}
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
            }}
          >
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Enter listing description"
            rows={5}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "5px",
              resize: "vertical",
            }}
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
            }}
          >
            Price *
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            placeholder="0.00"
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "5px",
            }}
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
            }}
          >
            Category *
          </label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            placeholder="e.g., Electronics, Furniture, Clothing"
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "5px",
            }}
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
            }}
          >
            Condition *
          </label>
          <select
            name="condition"
            value={formData.condition}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "5px",
            }}
          >
            {" "}
            <option value="new">New</option>
            <option value="like-new">Like New</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
            <option value="poor">Poor</option>
          </select>
        </div>

        {/* Image Management Section */}
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "10px",
              fontWeight: "bold",
            }}
          >
            📸 Manage Images
          </label>

          {/* Existing Images */}
          {formData.images && formData.images.length > 0 && (
            <div style={{ marginBottom: "15px" }}>
              <h4 style={{ margin: "0 0 10px 0" }}>Current Images:</h4>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                  gap: "10px",
                }}
              >
                {formData.images.map((image, index) => (
                  <div
                    key={index}
                    style={{
                      position: "relative",
                      border: "1px solid #ddd",
                      borderRadius: "5px",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={image}
                      alt={`Existing ${index + 1}`}
                      style={{
                        width: "100%",
                        height: "120px",
                        objectFit: "cover",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(index)}
                      style={{
                        position: "absolute",
                        top: "5px",
                        right: "5px",
                        backgroundColor: "#dc3545",
                        color: "white",
                        border: "none",
                        borderRadius: "50%",
                        width: "25px",
                        height: "25px",
                        fontSize: "12px",
                        cursor: "pointer",
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add New Images */}
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "normal",
              }}
            >
              Add New Images:
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "5px",
                backgroundColor: "#f8f9fa",
              }}
            />
            <p style={{ fontSize: "12px", color: "#666", margin: "5px 0" }}>
              Select new images to add (JPG, PNG, etc.)
            </p>
          </div>

          {/* New Image Previews */}
          {imagePreviews.length > 0 && (
            <div style={{ marginTop: "10px" }}>
              <h4 style={{ margin: "10px 0 5px 0" }}>New Images to Add:</h4>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                  gap: "10px",
                }}
              >
                {imagePreviews.map((preview, index) => (
                  <div
                    key={index}
                    style={{
                      position: "relative",
                      border: "1px solid #28a745",
                      borderRadius: "5px",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={preview.url}
                      alt={`New Preview ${index + 1}`}
                      style={{
                        width: "100%",
                        height: "120px",
                        objectFit: "cover",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      style={{
                        position: "absolute",
                        top: "5px",
                        right: "5px",
                        backgroundColor: "#dc3545",
                        color: "white",
                        border: "none",
                        borderRadius: "50%",
                        width: "25px",
                        height: "25px",
                        fontSize: "12px",
                        cursor: "pointer",
                      }}
                    >
                      ×
                    </button>
                    <div
                      style={{
                        padding: "5px",
                        fontSize: "10px",
                        backgroundColor: "#e8f5e8",
                      }}
                    >
                      {preview.name.length > 15
                        ? preview.name.substring(0, 15) + "..."
                        : preview.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
          <button
            type="submit"
            disabled={saving}
            style={{
              padding: "12px 30px",
              backgroundColor: saving ? "#ccc" : "#28a745",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: saving ? "not-allowed" : "pointer",
              flex: 1,
            }}
          >
            {saving ? "Updating..." : "✅ Update Listing"}
          </button>

          <button
            type="button"
            onClick={() => navigate(`/listings/${id}`)}
            style={{
              padding: "12px 30px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
          >
            ❌ Cancel
          </button>
        </div>
      </form>

      <div
        style={{
          marginTop: "40px",
          padding: "15px",
          backgroundColor: "#f8f9fa",
          borderRadius: "5px",
        }}
      >
        <h4>🧪 Testing Info</h4>
        <p>
          <strong>API Endpoint:</strong> PUT /api/listings/{id}
        </p>
        <p>
          <strong>Listing ID:</strong> {id}
        </p>
        <p>
          <strong>Current Form Data:</strong>
        </p>
        <pre
          style={{
            backgroundColor: "#e9ecef",
            padding: "10px",
            borderRadius: "3px",
            fontSize: "12px",
          }}
        >
          {JSON.stringify(formData, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default EditListingPage;
