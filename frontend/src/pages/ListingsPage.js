import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { listingApi } from "../services/listingApi";
import { useAuth } from "../contexts/AuthContext";
import {
  FaPlus,
  FaChevronDown,
  FaSpinner,
  FaFilter,
  FaTimes,
} from "react-icons/fa";
import ListingCard from "../components/ListingCard";
import LoadingSpinner from "../components/listing/LoadingSpinner";
import "../styles/ListingsPage.css";

const ListingsPage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [searchParams] = useSearchParams();
  // Filter and sort states
  const [filters, setFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    condition: "",
    sortBy: "newest",
    searchTerm: "",
  });

  // Available categories - you can fetch these from API or define statically
  const categories = [
    "Electronics",
    "Clothing",
    "Books",
    "Sports",
    "Home & Garden",
    "Automotive",
    "Toys & Games",
    "Health & Beauty",
    "Other",
  ];
  const conditions = ["New", "Like New", "Good", "Fair", "Poor"]; // Pagination state
  const [itemsPerPage] = useState(12); // 4 items per row × 3 rows initially
  const [visibleItems, setVisibleItems] = useState(12);
  const [showMoreLoading, setShowMoreLoading] = useState(false);

  // Filter visibility state
  const [showFilters, setShowFilters] = useState(false);
  useEffect(() => {
    fetchListings();
  }, []);
  // Reset visible items when filters change
  useEffect(() => {
    setVisibleItems(12);
  }, [filters]);

  // Handle search from URL params (e.g., from 404 page)
  useEffect(() => {
    const searchQuery = searchParams.get("search");
    if (searchQuery) {
      setFilters((prev) => ({
        ...prev,
        searchTerm: searchQuery,
      }));
    }
  }, [searchParams]);
  const fetchListings = async () => {
    setLoading(true);
    try {
      const result = await listingApi.getAll();
      if (result.success) {
        setListings(result.data);
        setError(null);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Failed to load listings");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      const result = await listingApi.delete(id);
      if (result.success) {
        alert("Listing deleted successfully!");
        fetchListings(); // Refresh the list
      } else {
        alert(`Error: ${result.error}`);
      }
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  const clearFilters = () => {
    setFilters({
      category: "",
      minPrice: "",
      maxPrice: "",
      condition: "",
      sortBy: "newest",
      searchTerm: "",
    });
    setVisibleItems(12); // Reset visible items when filters change
  };
  const handleShowMore = async () => {
    setShowMoreLoading(true);
    // Simulate loading delay for better UX
    setTimeout(() => {
      setVisibleItems((prev) => prev + 12);
      setShowMoreLoading(false);
    }, 500);
  };
  // Filter and sort listings
  const filteredAndSortedListings = useMemo(() => {
    let filtered = [...listings];

    // Apply search filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (listing) =>
          listing.title?.toLowerCase().includes(searchLower) ||
          listing.description?.toLowerCase().includes(searchLower) ||
          listing.category?.toLowerCase().includes(searchLower)
      );
    }

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(
        (listing) =>
          listing.category?.toLowerCase() === filters.category.toLowerCase()
      );
    }

    // Apply condition filter
    if (filters.condition) {
      filtered = filtered.filter(
        (listing) =>
          listing.condition?.toLowerCase() === filters.condition.toLowerCase()
      );
    }

    // Apply price range filter
    if (filters.minPrice) {
      filtered = filtered.filter(
        (listing) => parseFloat(listing.price) >= parseFloat(filters.minPrice)
      );
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(
        (listing) => parseFloat(listing.price) <= parseFloat(filters.maxPrice)
      );
    }

    // Apply sorting
    switch (filters.sortBy) {
      case "newest":
        filtered.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        break;
      case "oldest":
        filtered.sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at)
        );
        break;
      case "price_low":
        filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case "price_high":
        filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case "title":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    return filtered;
  }, [listings, filters]);
  if (loading) {
    return (
      <div className="listings-page">
        <LoadingSpinner message="Loading listings..." />
      </div>
    );
  }
  return (
    <div className="listings-page">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">🛍️ Browse Listings</h1>
        <div className="header-actions">
          {isAuthenticated && (
            <button
              onClick={() => navigate("/listings/create")}
              className="create-btn"
            >
              <FaPlus /> Create New Listing
            </button>
          )}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="filter-toggle-btn"
          >
            <FaFilter />
            {showFilters ? "Hide Filters" : "Show Filters"}
            <FaChevronDown
              className={`filter-toggle-arrow ${showFilters ? "rotated" : ""}`}
            />
          </button>{" "}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="error-container">
          <h3 className="error-title">Error Loading Listings</h3>
          <p className="error-message">{error}</p>
          <button onClick={fetchListings} className="create-btn">
            <FaSpinner /> Try Again
          </button>
        </div>
      )}
      {/* Collapsible Filters Section */}
      {showFilters && (
        <div className="filters-section">
          <div className="filters-header">
            <h3 className="filters-title">Filter Options</h3>
            <button
              onClick={() => setShowFilters(false)}
              className="filters-close-btn"
            >
              <FaTimes />
            </button>
          </div>{" "}
          <div className="filters-grid">
            {/* Category Filter */}
            <div className="filter-group">
              <label className="filter-label">Category</label>
              <select
                className="filter-select"
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Condition Filter */}
            <div className="filter-group">
              <label className="filter-label">Condition</label>
              <select
                className="filter-select"
                value={filters.condition}
                onChange={(e) =>
                  handleFilterChange("condition", e.target.value)
                }
              >
                <option value="">Any Condition</option>
                {conditions.map((condition) => (
                  <option key={condition} value={condition}>
                    {condition}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div className="filter-group">
              <label className="filter-label">Price Range</label>
              <div className="price-range-group">
                <input
                  type="number"
                  placeholder="Min $"
                  className="filter-input price-input"
                  value={filters.minPrice}
                  onChange={(e) =>
                    handleFilterChange("minPrice", e.target.value)
                  }
                />
                <span>to</span>
                <input
                  type="number"
                  placeholder="Max $"
                  className="filter-input price-input"
                  value={filters.maxPrice}
                  onChange={(e) =>
                    handleFilterChange("maxPrice", e.target.value)
                  }
                />
              </div>
            </div>

            {/* Sort By */}
            <div className="filter-group">
              <label className="filter-label">Sort By</label>
              <select
                className="filter-select"
                value={filters.sortBy}
                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="title">Title A-Z</option>
              </select>
            </div>
          </div>
          {/* Filter Actions */}
          <div className="filter-actions">
            <button onClick={clearFilters} className="clear-filters-btn">
              Clear All Filters
            </button>{" "}
            <button
              onClick={() => setShowFilters(false)}
              className="apply-filters-btn"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Results Info */}
      <div className="results-info">
        <div className="results-count">
          {filteredAndSortedListings.length}{" "}
          {filteredAndSortedListings.length === 1 ? "listing" : "listings"}{" "}
          found
        </div>{" "}
        {/* Active Filters Display */}
        {(filters.searchTerm ||
          filters.category ||
          filters.condition ||
          filters.minPrice ||
          filters.maxPrice) && (
          <div className="active-filters">
            <span className="active-filters-label">Active filters:</span>
            {filters.searchTerm && (
              <span className="filter-tag">Search: "{filters.searchTerm}"</span>
            )}
            {filters.category && (
              <span className="filter-tag">{filters.category}</span>
            )}
            {filters.condition && (
              <span className="filter-tag">{filters.condition}</span>
            )}
            {filters.minPrice && (
              <span className="filter-tag">Min: ${filters.minPrice}</span>
            )}
            {filters.maxPrice && (
              <span className="filter-tag">Max: ${filters.maxPrice}</span>
            )}
            <button onClick={clearFilters} className="clear-all-btn">
              <FaTimes /> Clear All
            </button>
          </div>
        )}
      </div>
      {filteredAndSortedListings.length === 0 ? (
        <div className="no-listings-container">
          <div className="no-listings-icon">📦</div>{" "}
          <h3 className="no-listings-title">No listings found</h3>
          <p className="no-listings-text">
            {listings.length === 0
              ? "Be the first to create a listing!"
              : "Try adjusting your filters to see more results."}
          </p>
          {isAuthenticated && listings.length === 0 && (
            <button
              onClick={() => navigate("/listings/create")}
              className="create-btn"
            >
              {" "}
              <FaPlus /> Create Your First Listing
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="listings-grid">
            {filteredAndSortedListings.slice(0, visibleItems).map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>

          {/* Show More Button */}
          {visibleItems < filteredAndSortedListings.length && (
            <div className="show-more-container">
              <button
                onClick={handleShowMore}
                className="show-more-btn"
                disabled={showMoreLoading}
              >
                {showMoreLoading ? (
                  <>
                    <FaSpinner className="show-more-spinner" />
                    Loading more...
                  </>
                ) : (
                  <>
                    <FaChevronDown />
                    Show More ({filteredAndSortedListings.length -
                      visibleItems}{" "}
                    remaining)
                  </>
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ListingsPage;
