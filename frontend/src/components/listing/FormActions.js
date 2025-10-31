import React from "react";
import { FaCheck } from "react-icons/fa";

const FormActions = ({
  isSubmitting,
  onCancel,
  submitText = "Create Listing",
  submittingText = "Creating...",
  formData,
  cancelText = "Cancel",
}) => {
  const isFormValid =
    formData.title &&
    formData.description &&
    formData.price &&
    formData.category &&
    formData.condition;

  return (
    <div className="form-actions">
      <button
        type="button"
        onClick={onCancel}
        className="cancel-btn"
        disabled={isSubmitting}
      >
        {cancelText}
      </button>
      <button
        type="submit"
        disabled={isSubmitting || !isFormValid}
        className="submit-btn"
      >
        {isSubmitting ? (
          submittingText
        ) : (
          <>
            <FaCheck /> {submitText}
          </>
        )}
      </button>
    </div>
  );
};

export default FormActions;
