import React, { useState } from "react";
import { listingApi } from "../services/listingApi";

const ListingApiTestPage = () => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [testId, setTestId] = useState("1");
  const [testData, setTestData] = useState({
    title: "Test Listing",
    description: "This is a test listing created from the API test page",
    price: "99.99",
    category: "Electronics",
    condition: "new",
  });

  const runTest = async (testName, apiCall) => {
    setLoading(true);
    try {
      const start = Date.now();
      const result = await apiCall();
      const duration = Date.now() - start;

      setResponse({
        test: testName,
        success: result.success,
        data: result.data || result.error,
        duration: `${duration}ms`,
        timestamp: new Date().toLocaleTimeString(),
      });
    } catch (error) {
      setResponse({
        test: testName,
        success: false,
        data: error.message,
        duration: "Error",
        timestamp: new Date().toLocaleTimeString(),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
      <h1>🧪 Listing API Test Console</h1>
      <p>
        Test all your listing API endpoints here. Make sure your Laravel backend
        is running on port 8000.
      </p>

      {/* Test Controls */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "8px",
          }}
        >
          <h3>📝 Test Data</h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <div>
              <label style={{ display: "block", fontWeight: "bold" }}>
                Test ID:
              </label>
              <input
                type="number"
                value={testId}
                onChange={(e) => setTestId(e.target.value)}
                style={{ width: "100px", padding: "5px" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontWeight: "bold" }}>
                Title:
              </label>
              <input
                type="text"
                value={testData.title}
                onChange={(e) =>
                  setTestData({ ...testData, title: e.target.value })
                }
                style={{ width: "100%", padding: "5px" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontWeight: "bold" }}>
                Price:
              </label>
              <input
                type="number"
                value={testData.price}
                onChange={(e) =>
                  setTestData({ ...testData, price: e.target.value })
                }
                style={{ width: "100px", padding: "5px" }}
              />
            </div>
          </div>
        </div>

        <div
          style={{
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "8px",
          }}
        >
          <h3>🎯 API Endpoints</h3>
          <div style={{ fontSize: "12px", fontFamily: "monospace" }}>
            <p>GET /api/listings</p>
            <p>GET /api/listings/{"{id}"}</p>
            <p>POST /api/listings</p>
            <p>PUT /api/listings/{"{id}"}</p>
            <p>DELETE /api/listings/{"{id}"}</p>
          </div>
        </div>
      </div>

      {/* Test Buttons */}
      <div style={{ marginBottom: "30px" }}>
        <h3>🚀 Run Tests</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "10px",
          }}
        >
          <button
            onClick={() =>
              runTest("GET All Listings", () => listingApi.getAll())
            }
            disabled={loading}
            style={{
              padding: "10px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
          >
            📋 GET All Listings
          </button>

          <button
            onClick={() =>
              runTest(`GET Listing #${testId}`, () =>
                listingApi.getById(testId)
              )
            }
            disabled={loading}
            style={{
              padding: "10px",
              backgroundColor: "#17a2b8",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
          >
            👁️ GET Listing #{testId}
          </button>

          <button
            onClick={() =>
              runTest("CREATE Listing", () => listingApi.create(testData))
            }
            disabled={loading}
            style={{
              padding: "10px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
          >
            ➕ CREATE Listing
          </button>

          <button
            onClick={() =>
              runTest(`UPDATE Listing #${testId}`, () =>
                listingApi.update(testId, testData)
              )
            }
            disabled={loading}
            style={{
              padding: "10px",
              backgroundColor: "#ffc107",
              color: "black",
              border: "none",
              borderRadius: "5px",
            }}
          >
            ✏️ UPDATE Listing #{testId}
          </button>

          <button
            onClick={() =>
              runTest(`DELETE Listing #${testId}`, () =>
                listingApi.delete(testId)
              )
            }
            disabled={loading}
            style={{
              padding: "10px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
          >
            🗑️ DELETE Listing #{testId}
          </button>
        </div>
      </div>

      {/* Response Display */}
      {loading && (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <h3>🔄 Running test...</h3>
        </div>
      )}

      {response && !loading && (
        <div style={{ marginTop: "20px" }}>
          <h3>📊 Test Result</h3>
          <div
            style={{
              padding: "20px",
              border: `2px solid ${response.success ? "#28a745" : "#dc3545"}`,
              borderRadius: "8px",
              backgroundColor: response.success ? "#f8fff9" : "#fff8f8",
            }}
          >
            <div
              style={{
                marginBottom: "15px",
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "10px",
              }}
            >
              <div>
                <strong>Test:</strong> {response.test}
              </div>
              <div>
                <strong>Status:</strong>
                <span
                  style={{
                    color: response.success ? "#28a745" : "#dc3545",
                    marginLeft: "5px",
                  }}
                >
                  {response.success ? "✅ SUCCESS" : "❌ FAILED"}
                </span>
              </div>
              <div>
                <strong>Duration:</strong> {response.duration}
              </div>
              <div>
                <strong>Time:</strong> {response.timestamp}
              </div>
            </div>

            <div>
              <strong>Response Data:</strong>
              <pre
                style={{
                  backgroundColor: "#f1f1f1",
                  padding: "15px",
                  borderRadius: "5px",
                  overflow: "auto",
                  marginTop: "10px",
                  fontSize: "12px",
                }}
              >
                {JSON.stringify(response.data, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Quick Links */}
      <div
        style={{
          marginTop: "40px",
          padding: "20px",
          backgroundColor: "#f8f9fa",
          borderRadius: "5px",
        }}
      >
        <h3>🔗 Quick Navigation</h3>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <a
            href="/listings"
            style={{
              padding: "8px 15px",
              backgroundColor: "#007bff",
              color: "white",
              textDecoration: "none",
              borderRadius: "5px",
            }}
          >
            📋 View All Listings
          </a>
          <a
            href="/listings/create"
            style={{
              padding: "8px 15px",
              backgroundColor: "#28a745",
              color: "white",
              textDecoration: "none",
              borderRadius: "5px",
            }}
          >
            ➕ Create Listing
          </a>
          <a
            href="/test"
            style={{
              padding: "8px 15px",
              backgroundColor: "#17a2b8",
              color: "white",
              textDecoration: "none",
              borderRadius: "5px",
            }}
          >
            🧪 Auth Test Page
          </a>
        </div>
      </div>
    </div>
  );
};

export default ListingApiTestPage;
