import React, { useState } from "react";
import { FaImage, FaPlus, FaTimes } from "react-icons/fa";

const ImageUploadSection = ({
  selectedImages,
  setSelectedImages,
  imagePreviews,
  setImagePreviews,
  existingImages,
  onRemoveExistingImage,
  isEditMode = false,
}) => {
  const [dragActive, setDragActive] = useState(false);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);

    // Create preview URLs
    const previews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name,
    }));
    setImagePreviews(previews);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      setSelectedImages(files);

      // Create preview URLs
      const previews = files.map((file) => ({
        file,
        url: URL.createObjectURL(file),
        name: file.name,
      }));
      setImagePreviews(previews);
    }
  };

  const removeNewImage = (index) => {
    const newImages = [...selectedImages];
    const newPreviews = [...imagePreviews];

    // Revoke the URL to prevent memory leaks
    URL.revokeObjectURL(newPreviews[index].url);

    newImages.splice(index, 1);
    newPreviews.splice(index, 1);

    setSelectedImages(newImages);
    setImagePreviews(newPreviews);
  };

  return (
    <div className="form-section">
      <div className="section-header">
        <FaImage className="section-icon" />
        <h2>Product Images</h2>
      </div>

      <div className="image-upload-section">
        {/* Existing Images (Edit Mode Only) */}
        {isEditMode && existingImages && existingImages.length > 0 && (
          <div className="existing-images">
            <h3>Current Images</h3>
            <div className="image-previews">
              {existingImages.map((image, index) => (
                <div key={index} className="image-preview existing">
                  <img src={image} alt={`Existing ${index + 1}`} />
                  <button
                    type="button"
                    onClick={() => onRemoveExistingImage(index)}
                    className="remove-image-btn"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Area */}
        <div
          className={`upload-area ${dragActive ? "drag-active" : ""}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="upload-content">
            <FaImage className="upload-icon" />
            <h3>{isEditMode ? "Add New Images" : "Upload Product Images"}</h3>
            <p>Drag & drop files or click to upload</p>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="file-input"
              id="image-upload"
            />
            <label htmlFor="image-upload" className="upload-btn">
              <FaPlus />
              Choose Files
            </label>
          </div>
        </div>

        {/* New Image Previews */}
        {imagePreviews.length > 0 && (
          <div className="new-images">
            <h3>{isEditMode ? "New Images to Add" : "Selected Images"}</h3>
            <div className="image-previews">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="image-preview new">
                  <img src={preview.url} alt={`Preview ${index + 1}`} />
                  <button
                    type="button"
                    onClick={() => removeNewImage(index)}
                    className="remove-image-btn"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploadSection;
