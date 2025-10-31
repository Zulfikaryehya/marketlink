import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { listingApi } from "../services/listingApi";
import { useAuth } from "../contexts/AuthContext";
import AccessDenied from "../components/listing/AccessDenied";
import ListingHeader from "../components/listing/ListingHeader";
import ErrorMessage from "../components/listing/ErrorMessage";
import ImageUploadSection from "../components/listing/ImageUploadSection";
import ListingFormFields from "../components/listing/ListingFormFields";
import FormActions from "../components/listing/FormActions";
import LoadingSpinner from "../components/listing/LoadingSpinner";
import "../styles/CreateListingPage.css";

const EditListingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    condition: "",
    location: "",
    images: [],
  });

  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    if (isAuthenticated && id) {
      fetchListing();
    }
  }, [id, isAuthenticated]);

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <AccessDenied />;
  }

  const fetchListing = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await listingApi.getById(id);
      if (result.success) {
        const listing = result.data;
        setFormData({
          title: listing.title || "",
          description: listing.description || "",
          price: listing.price || "",
          category: listing.category || "",
          condition: listing.condition || "New",
          location: listing.location || "",
          images: listing.images || [],
        });
      } else {
        setError(result.error || "Failed to load listing");
      }
    } catch (err) {
      console.error("Error fetching listing:", err);
      setError("Failed to load listing");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRemoveExistingImage = (index) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData((prev) => ({
      ...prev,
      images: newImages,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Use updateWithImages if new images are selected, otherwise use regular update
      const result =
        selectedImages.length > 0
          ? await listingApi.updateWithImages(id, formData, selectedImages)
          : await listingApi.update(id, formData);

      if (result.success) {
        // Clean up image previews
        imagePreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
        navigate(`/listings/${id}`);
      } else {
        setError(result.error || "Failed to update listing");
      }
    } catch (error) {
      console.error("Error updating listing:", error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat();
        setError(errorMessages.join(", "));
      } else {
        setError("Failed to update listing. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Clean up any preview URLs before navigating
    imagePreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
    navigate(`/listings/${id}`);
  };

  const handleBack = () => {
    // Clean up any preview URLs before navigating
    imagePreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
    navigate(`/listings/${id}`);
  };

  // Loading state
  if (loading) {
    return <LoadingSpinner message="Loading listing..." />;
  }

  // Error state (when listing couldn't be loaded)
  if (error && !formData.title) {
    return (
      <div className="create-listing-page">
        <div className="create-listing-container">
          <ListingHeader
            title="Error Loading Listing"
            onBack={() => navigate("/listings")}
          />
          <div className="error-container">
            <ErrorMessage error={error} />
            <div className="form-actions">
              <button
                onClick={() => navigate("/listings")}
                className="cancel-btn"
              >
                ← Back to Listings
              </button>
              <button onClick={fetchListing} className="submit-btn">
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="create-listing-page">
      <div className="create-listing-container">
        <ListingHeader title="Edit Listing" onBack={handleBack} />

        <form onSubmit={handleSubmit} className="listing-form">
          <ErrorMessage error={error} />

          <ImageUploadSection
            selectedImages={selectedImages}
            setSelectedImages={setSelectedImages}
            imagePreviews={imagePreviews}
            setImagePreviews={setImagePreviews}
            existingImages={formData.images}
            onRemoveExistingImage={handleRemoveExistingImage}
            isEditMode={true}
          />

          <ListingFormFields
            formData={formData}
            handleInputChange={handleInputChange}
            isEditMode={true}
          />

          <FormActions
            isSubmitting={isSubmitting}
            onCancel={handleCancel}
            submitText="Update Listing"
            submittingText="Updating..."
            formData={formData}
            cancelText="Cancel"
          />
        </form>
      </div>
    </div>
  );
};

export default EditListingPage;
