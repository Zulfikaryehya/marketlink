import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiEdit, FiTrash2, FiArrowLeft } from "react-icons/fi";
import { listingApi } from "../services/listingApi";
import { commentApi } from "../services/commentApi";
import { useAuth } from "../contexts/AuthContext";
import "../styles/ListingDetailPage.css";

const ListingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  // Listing state
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  // Comments state
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState(null);

  // Related products state
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(false);
  useEffect(() => {
    fetchListing();
    fetchComments();
  }, [id]);
  const fetchListing = async () => {
    setLoading(true);
    try {
      const result = await listingApi.getById(id);
      if (result.success) {
        setListing(result.data);
        setError(null);
        // Fetch related products based on the same category
        fetchRelatedProducts(result.data.category);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Failed to load listing");
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async (category) => {
    if (!category) return;

    setRelatedLoading(true);
    try {
      const result = await listingApi.getByCategory(category, id, 4);
      if (result.success) {
        setRelatedProducts(result.data);
      }
    } catch (err) {
      console.error("Failed to load related products:", err);
    } finally {
      setRelatedLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const result = await commentApi.getByListing(id);
      if (result.success) {
        setComments(result.data);
      }
    } catch (err) {
      console.error("Failed to load comments:", err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !isAuthenticated) return;

    setCommentLoading(true);
    setCommentError(null);

    try {
      const result = await commentApi.create(id, { body: newComment });
      if (result.success) {
        setComments([result.data.comment, ...comments]);
        setNewComment("");
      } else {
        setCommentError(result.error);
      }
    } catch (err) {
      setCommentError("Failed to add comment");
    } finally {
      setCommentLoading(false);
    }
  };
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?"))
      return;

    try {
      const result = await commentApi.delete(commentId);
      if (result.success) {
        setComments(comments.filter((comment) => comment.id !== commentId));
      } else {
        console.error("Failed to delete comment:", result.error);
        alert(`Error deleting comment: ${result.error}`);
      }
    } catch (err) {
      console.error("Failed to delete comment:", err);
      alert("Failed to delete comment. Please try again.");
    }
  };
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      const result = await listingApi.delete(id);
      if (result.success) {
        navigate("/listings");
      } else {
        alert(`Error: ${result.error}`);
      }
    }
  };
  if (loading) {
    return (
      <div className="listing-detail-loading">
        <div className="loading-spinner"></div>
        <p>Loading listing details...</p>
      </div>
    );
  }
  if (error || !listing) {
    return (
      <div className="listing-detail-error">
        <h3>Error Loading Listing</h3>
        <p>{error || "Listing not found"}</p>
        <button onClick={() => navigate("/listings")} className="btn-back">
          <FiArrowLeft /> Back to Listings
        </button>
      </div>
    );
  }
  return (
    <div className="listing-detail-page">
      <div className="listing-detail-container">
        {/* Back Button */}
        <button onClick={() => navigate("/listings")} className="btn-back">
          ← Back to Listings
        </button>
        <div className="listing-detail-content">
          {/* Left Side - Images */}
          <div className="listing-images-section">
            {listing.images && listing.images.length > 0 ? (
              <>
                {/* Main Image */}
                <div className="main-image-container">
                  <img
                    src={listing.images[selectedImageIndex]}
                    alt={listing.title}
                    className="main-image"
                  />
                </div>

                {/* Image Thumbnails */}
                {listing.images.length > 1 && (
                  <div className="image-thumbnails">
                    {listing.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${listing.title} ${index + 1}`}
                        className={`thumbnail ${
                          index === selectedImageIndex ? "active" : ""
                        }`}
                        onClick={() => setSelectedImageIndex(index)}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="no-image">
                <div className="no-image-placeholder">
                  <span>📷</span>
                  <p>No images available</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Side - Details */}
          <div className="listing-details-section">
            <div className="listing-header">
              <h1 className="listing-title">{listing.title}</h1>
              <div className="listing-price">
                ${parseFloat(listing.price).toFixed(2)}
              </div>
            </div>
            <div className="listing-description">
              <h3>Description</h3>
              <p>{listing.description}</p>
            </div>
            <div className="listing-details-grid">
              <div className="detail-item">
                <span className="detail-label">Condition:</span>
                <span className="detail-value condition-badge">
                  {listing.condition}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Category:</span>
                <span className="detail-value">{listing.category}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Posted:</span>
                <span className="detail-value">
                  {new Date(listing.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
            {/* Seller Info */}
            <div className="seller-section">
              <div className="seller-header">
                <div className="seller-avatar">
                  <span>
                    {listing.seller?.name?.charAt(0) ||
                      user?.name?.charAt(0) ||
                      "S"}
                  </span>
                </div>
                <div className="seller-info">
                  <p className="seller-label">Sold by</p>
                  <p className="seller-name">
                    {listing.seller?.name || user?.name || "Seller"}
                  </p>
                  <div className="seller-rating">
                    <span>⭐⭐⭐⭐⭐</span>
                    <span className="reviews-count">(0% reviews)</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Action Buttons */}
            <div className="action-buttons">
              <button className="btn-add-to-cart">Add to Cart</button>
              <button className="btn-chat-seller">Chat with Seller</button>
            </div>{" "}
            {/* Admin Actions - Only show for listing owner */}
            {isAuthenticated && user?.id === listing.user_id && (
              <div className="admin-actions">
                <button
                  onClick={() => navigate(`/listings/${listing.id}/edit`)}
                  className="btn-edit"
                >
                  <FiEdit /> Edit Listing
                </button>
                <button onClick={handleDelete} className="btn-delete">
                  <FiTrash2 /> Delete Listing
                </button>
              </div>
            )}
          </div>
        </div>
        {/* About the Seller Section
        <div className="about-seller-section">
          <h3>About the Seller</h3>
          <div className="seller-details">
            <div className="seller-avatar-large">
              <span>
                {listing.seller?.name?.charAt(0) ||
                  user?.name?.charAt(0) ||
                  "S"}
              </span>
            </div>
            <div className="seller-description">
              <h4>{listing.seller?.name || user?.name || "Seller"}</h4>
              <p className="seller-location">
                {listing.seller?.location || "San Francisco, CA"}
              </p>
              <div className="seller-stats">
                <span>⭐⭐⭐⭐⭐ (0% reviews)</span>
              </div>
              <p className="seller-bio">
                A fashion enthusiast and collector of vintage items. All pieces
                are carefully selected and maintained. Happy to answer any
                questions!
              </p>
            </div>
          </div>
        </div> */}
        {/* Comments Section */}
        <div className="comments-section">
          <h3 className="comments-title">Comments ({comments.length})</h3>
          {/* Add Comment Form */}
          {isAuthenticated ? (
            <form onSubmit={handleAddComment} className="comment-form">
              <div className="comment-input-container">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="comment-input"
                  rows={3}
                  disabled={commentLoading}
                />
                <button
                  type="submit"
                  className="btn-submit-comment"
                  disabled={!newComment.trim() || commentLoading}
                >
                  {commentLoading ? "Posting..." : "Post Comment"}
                </button>
              </div>
              {commentError && (
                <div className="comment-error">{commentError}</div>
              )}
            </form>
          ) : (
            <div className="login-to-comment">
              <p>
                Please{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="login-link"
                >
                  log in
                </button>{" "}
                to leave a comment.
              </p>
            </div>
          )}
          {/* Comments List */}
          <div className="comments-list">
            {comments.length === 0 ? (
              <div className="no-comments">
                <p>No comments yet. Be the first to comment!</p>
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="comment-item">
                  <div className="comment-avatar">
                    <span>{comment.user?.name?.charAt(0) || "U"}</span>
                  </div>
                  <div className="comment-content">
                    <div className="comment-header">
                      <span className="comment-author">
                        {comment.user?.name || "Anonymous"}
                      </span>
                      <span className="comment-date">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                      {isAuthenticated && user?.id === comment.user_id && (
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="btn-delete-comment"
                        >
                          <FiTrash2 />
                        </button>
                      )}
                    </div>
                    <p className="comment-body">{comment.body}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>{" "}
        {/* Related Products Section */}
        <div className="related-products-section">
          <h3>Related Products</h3>
          {relatedLoading ? (
            <div className="loading-state">Loading related products...</div>
          ) : relatedProducts.length > 0 ? (
            <div className="related-products-grid">
              {relatedProducts.map((product) => (
                <div
                  key={product.id}
                  className="related-product"
                  onClick={() => navigate(`/listings/${product.id}`)}
                >
                  <img
                    src={
                      product.images && product.images.length > 0
                        ? product.images[0]
                        : "https://via.placeholder.com/150x150"
                    }
                    alt={product.title}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/150x150";
                    }}
                  />
                  <h4>{product.title}</h4>
                  <p>${parseFloat(product.price).toFixed(2)}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-related-products">
              <p>No related products found in this category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingDetailPage;
