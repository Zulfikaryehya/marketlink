import React from "react";
import {
  FaTag,
  FaDollarSign,
  FaMapMarkerAlt,
  FaClipboardList,
  FaInfoCircle,
} from "react-icons/fa";

const ListingFormFields = ({
  formData,
  handleInputChange,
  isEditMode = false,
}) => {
  const categories = [
    "Electronics",
    "Fashion & Apparel",
    "Home & Furniture",
    "Vehicles",
    "Books & Education",
    "Sports & Recreation",
    "Health & Beauty",
    "Collectibles & Art",
  ];

  const conditions = ["New", "Like New", "Good", "Fair", "Poor", "Used"];

  return (
    <div className="form-section">
      <div className="section-header">
        <FaClipboardList className="section-icon" />
        <h2>Basic Information</h2>
      </div>

      <div className="form-grid">
        <div className="form-group full-width">
          <label htmlFor="title">Product Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter a descriptive title"
            required
            maxLength="255"
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe your product in detail..."
            required
            rows="4"
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">
            <FaTag className="label-icon" />
            Category *
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="condition">
            <FaInfoCircle className="label-icon" />
            Condition *
          </label>
          <select
            id="condition"
            name="condition"
            value={formData.condition}
            onChange={handleInputChange}
            required
          >
            <option value="">Select condition</option>
            {conditions.map((condition) => (
              <option key={condition} value={condition}>
                {condition}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="price">
            <FaDollarSign className="label-icon" />
            Price *
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="0.00"
            min="0"
            step="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">
            <FaMapMarkerAlt className="label-icon" />
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location || ""}
            onChange={handleInputChange}
            placeholder="City, State/Province"
            maxLength="255"
          />
        </div>
      </div>
    </div>
  );
};

export default ListingFormFields;
