import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { listingApi } from "../services/listingApi";
import { useAuth } from "../contexts/AuthContext";
import AccessDenied from "../components/listing/AccessDenied";
import ListingHeader from "../components/listing/ListingHeader";
import ErrorMessage from "../components/listing/ErrorMessage";
import ImageUploadSection from "../components/listing/ImageUploadSection";
import ListingFormFields from "../components/listing/ListingFormFields";
import FormActions from "../components/listing/FormActions";
import toast from "react-hot-toast";
import "../styles/CreateListingPage.css";

const CreateListingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    condition: "",
    location: "",
  });

  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <AccessDenied />;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Use createWithImages if images are selected, otherwise use regular create
      const result =
        selectedImages.length > 0
          ? await listingApi.createWithImages(formData, selectedImages)
          : await listingApi.create(formData);
      if (result.success) {
        // Clean up image previews
        imagePreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
        toast.success("Listing created successfully!", {
          duration: 4000,
          position: "top-center",
          style: {
            background: "#10b981",
            color: "white",
            fontWeight: "500",
          },
        });
        navigate("/listings");
      } else {
        setError(result.error || "Failed to create listing");
        toast.error("Failed to create listing", {
          duration: 4000,
          position: "top-center",
          style: {
            background: "#ef4444",
            color: "white",
            fontWeight: "500",
          },
        });
      }
    } catch (error) {
      console.error("Error creating listing:", error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat();
        setError(errorMessages.join(", "));
      } else {
        setError("Failed to create listing. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Clean up any preview URLs before navigating
    imagePreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
    navigate("/listings");
  };

  const handleBack = () => {
    // Clean up any preview URLs before navigating
    imagePreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
    navigate(-1);
  };

  return (
    <div className="create-listing-page">
      <div className="create-listing-container">
        <ListingHeader title="Create New Listing" onBack={handleBack} />

        <form onSubmit={handleSubmit} className="listing-form">
          <ErrorMessage error={error} />

          <ImageUploadSection
            selectedImages={selectedImages}
            setSelectedImages={setSelectedImages}
            imagePreviews={imagePreviews}
            setImagePreviews={setImagePreviews}
            isEditMode={false}
          />

          <ListingFormFields
            formData={formData}
            handleInputChange={handleInputChange}
            isEditMode={false}
          />

          <FormActions
            isSubmitting={isSubmitting}
            onCancel={handleCancel}
            submitText="Create Listing"
            submittingText="Creating..."
            formData={formData}
            cancelText="Cancel"
          />
        </form>
      </div>
    </div>
  );
};

export default CreateListingPage;
