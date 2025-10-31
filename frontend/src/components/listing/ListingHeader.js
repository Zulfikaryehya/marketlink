import React from "react";
import { FaArrowLeft } from "react-icons/fa";

const ListingHeader = ({ title, onBack, backText = "Back" }) => {
  return (
    <div className="page-header">
      <button className="back-btn" onClick={onBack} type="button">
        <FaArrowLeft />
      </button>
      <h1>{title}</h1>
    </div>
  );
};

export default ListingHeader;
