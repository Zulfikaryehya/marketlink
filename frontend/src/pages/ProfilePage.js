import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaComment } from "react-icons/fa";
import { listingApi } from "../services/listingApi";
import { userApi } from "../services/userApi";
import "../styles/ProfilePageNew.css";

const ProfilePage = () => {
  console.log("ProfilePage component rendering...");

  const {
    user: currentUser,
    isAuthenticated,
    loading: authLoading,
  } = useAuth();
  const navigate = useNavigate();
  const { userId } = useParams(); // Get userId from URL params

  console.log("ProfilePage auth state:", {
    currentUser,
    isAuthenticated,
    authLoading,
  });
  // State management
  const [profileUser, setProfileUser] = useState(null);
  const [userListings, setUserListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("listings");

  // Determine if viewing own profile or another user's profile
  const isOwnProfile =
    !userId || (currentUser && currentUser.id === parseInt(userId));
  const targetUserId = isOwnProfile ? currentUser?.id : userId;

  console.log("ProfilePage calculated values:", { isOwnProfile, targetUserId }); // Fetch profile data and listings
  useEffect(() => {
    console.log("ProfilePage useEffect:", {
      authLoading,
      isOwnProfile,
      isAuthenticated,
      targetUserId,
      currentUser,
      userId,
    });
    // Debug: Add an alert to see if useEffect is running
    // alert(`ProfilePage loaded: authLoading=${authLoading}, isAuthenticated=${isAuthenticated}, currentUser=${currentUser?.name}`);

    if (!authLoading) {
      console.log("Auth loading complete, processing profile logic...");

      if (isOwnProfile && !isAuthenticated) {
        console.log("Not authenticated, redirecting to login");
        navigate("/login");
        return;
      }

      if (isOwnProfile && isAuthenticated) {
        console.log("Own profile - setting current user as profile user");
        if (currentUser) {
          setProfileUser(currentUser);
          setLoading(false);
          if (currentUser.id) {
            fetchUserListings();
          }
        } else {
          console.log("Current user is null, setting error");
          setError("User data not available. Please try logging in again.");
          setLoading(false);
        }
      } else if (!isOwnProfile && targetUserId) {
        console.log(
          "Other user's profile - fetching data for userId:",
          targetUserId
        );
        fetchProfileData();
        fetchUserListings();
      } else {
        console.log("No valid conditions met, setting error");
        setError("Invalid profile request");
        setLoading(false);
      }
    } else {
      console.log("Still loading auth...");
    }
  }, [
    targetUserId,
    isOwnProfile,
    isAuthenticated,
    authLoading,
    currentUser,
    navigate,
  ]);
  const fetchProfileData = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log("Fetching profile for userId:", userId);
      const result = await userApi.getById(userId);
      console.log("Profile fetch result:", result);

      if (result.success) {
        setProfileUser(result.data);
        setError(null);
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to load user profile");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserListings = async () => {
    if (!targetUserId) return;

    try {
      const result = await listingApi.getUserListings(targetUserId);
      if (result.success) {
        setUserListings(result.data);
      } else {
        console.error("Failed to fetch user listings:", result.error);
      }
    } catch (err) {
      console.error("Failed to fetch user listings:", err);
    }
  };

  const handleStartChat = () => {
    // TODO: Implement chat functionality
    alert("Chat functionality coming soon!");
  };

  if (authLoading || loading) {
    return (
      <div className="profile-page">
        <div className="profile-loading">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="profile-page">
        <div className="profile-error">
          <h3>Error Loading Profile</h3>
          <p>{error}</p>
          <button onClick={() => navigate(-1)} className="btn-back">
            <FaArrowLeft /> Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="profile-page">
        <div className="profile-loading">
          <div className="loading-spinner"></div>
          <p>Loading profile data...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Back Button */}
        <button onClick={() => navigate(-1)} className="btn-back">
          <FaArrowLeft /> Back
        </button>

        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-left">
            <div className="profile-avatar">
              <div className="avatar-circle">
                <span>{profileUser.name?.charAt(0)?.toUpperCase() || "U"}</span>
              </div>
            </div>
            <div className="profile-info">
              <h1 className="profile-name">{profileUser.name}</h1>
              <p className="profile-member-since">
                Member since{" "}
                {new Date(profileUser.created_at).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Chat Button - Only show if viewing another user's profile */}
          {!isOwnProfile && (
            <button className="btn-start-chat" onClick={handleStartChat}>
              <FaComment /> Start Chat
            </button>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="profile-tabs">
          <button
            className={`tab ${activeTab === "listings" ? "active" : ""}`}
            onClick={() => setActiveTab("listings")}
          >
            Listings
          </button>
          <button
            className={`tab ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            Orders
          </button>
          <button
            className={`tab ${activeTab === "reviews" ? "active" : ""}`}
            onClick={() => setActiveTab("reviews")}
          >
            Reviews
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === "listings" && (
            <div className="listings-grid">
              {userListings.length === 0 ? (
                <div className="no-listings">
                  <div className="no-listings-content">
                    <h3>No listings yet</h3>
                    <p>
                      {isOwnProfile
                        ? "Start selling by creating your first listing!"
                        : `${profileUser.name} hasn't posted any listings yet.`}
                    </p>
                    {isOwnProfile && (
                      <button
                        onClick={() => navigate("/listings/create")}
                        className="btn-create-listing"
                      >
                        Create Your First Listing
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                userListings.map((listing) => (
                  <div
                    key={listing.id}
                    className="listing-card"
                    onClick={() => navigate(`/listings/${listing.id}`)}
                  >
                    <div className="listing-image">
                      <img
                        src={
                          listing.images && listing.images.length > 0
                            ? listing.images[0]
                            : "https://via.placeholder.com/200x200?text=No+Image"
                        }
                        alt={listing.title}
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/200x200?text=No+Image";
                        }}
                      />
                      <div className="listing-status">
                        <span
                          className={`status-badge ${
                            listing.status || "available"
                          }`}
                        >
                          Available
                        </span>
                      </div>
                    </div>
                    <div className="listing-details">
                      <h3 className="listing-title">{listing.title}</h3>
                      <p className="listing-price">
                        ${parseFloat(listing.price).toFixed(2)}
                      </p>
                      <p className="listing-condition">{listing.condition}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "orders" && (
            <div className="orders-content">
              <div className="coming-soon">
                <h3>Orders Coming Soon</h3>
                <p>
                  Order history and management features will be available soon.
                </p>
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="reviews-content">
              <div className="coming-soon">
                <h3>Reviews Coming Soon</h3>
                <p>User reviews and ratings will be available soon.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
