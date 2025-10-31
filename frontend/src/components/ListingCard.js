import React from "react";
import { useNavigate } from "react-router-dom";
import { FaImage } from "react-icons/fa";
import "./ListingCard.css";

const ListingCard = ({ listing }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/listings/${listing.id}`);
  };

  return (
    <div className="listing-card" onClick={handleCardClick}>
      {/* Image Section */}
      <div className="listing-image-container">
        {listing.images && listing.images.length > 0 ? (
          <img
            src={listing.images[0]}
            alt={listing.title}
            className="listing-image"
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/300x200?text=No+Image";
            }}
          />
        ) : (
          <div className="no-image-placeholder">
            <FaImage />
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="listing-content">
        <h3 className="listing-title">{listing.title}</h3>

        <div className="listing-price">
          ${parseFloat(listing.price).toFixed(2)}
        </div>
        <div className="listing-posted-by">
          Posted by {listing.user?.name || listing.user_name || "Unknown User"}
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
