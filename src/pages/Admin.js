import React, { useState, useEffect } from "react";
import { getProperties, deleteProperty } from "../services/propertyService";
import PropertyForm from "../components/PropertyForm";
import "./Admin.css";

const Admin = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [selectedTab, setSelectedTab] = useState("Residential");
  const [editProperty, setEditProperty] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch properties from API
  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true);
      setError("");
      try {
        const { data } = await getProperties();
        const properties = data?.properties || []; // Access properties from the response
        setProperties(properties); // Update the main properties state
        setFilteredProperties(
          properties.filter((property) => property.type === selectedTab) || []
        );
      } catch (err) {
        setError("Failed to fetch properties. Please try again later.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, [refresh, selectedTab]);

  // Handle tab change for filtering
  const handleTabChange = (tab) => {
    setSelectedTab(tab);
    setFilteredProperties(
      properties.filter((property) => property.type === tab)
    );
  };

  // Handle delete property
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        await deleteProperty(id);
        setProperties(properties.filter((property) => property._id !== id));
        setFilteredProperties(
          filteredProperties.filter((property) => property._id !== id)
        );
      } catch (err) {
        setError("Failed to delete property. Please try again.");
        console.error(err);
      }
    }
  };

  return (
    <div className="admin-panel">
      <h1 className="property-heading">Admin Panel</h1>

      {/* Display Error Message */}
      {error && <div className="error-message">{error}</div>}

      {/* Property Form */}
      <PropertyForm
        propertyId={editProperty?._id}
        onSubmitSuccess={() => {
          setRefresh(!refresh);
          setEditProperty(null);
        }}
        onCancel={() => setEditProperty(null)} // Clear editing state
      />

      <hr />

      {/* Tabs for Segmentation */}
      <div className="tabsss">
        {["Residential", "Rent", "Land"].map((tab) => (
          <button
            key={tab}
            className={`tab-button ${selectedTab === tab ? "active" : ""}`}
            onClick={() => handleTabChange(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Property List */}
      {isLoading ? (
        <div className="loading"></div>
      ) : filteredProperties.length > 0 ? (
        <div className="property-admin-list">
          {filteredProperties.map((property) => (
            <div key={property?._id} className="property-admin-card">
              <div className="property-images">
                {property?.images?.map((image, index) => (
                  <img
                    key={index}
                    src={image?.url}
                    alt={property?.title || "Property"}
                    className="property-image"
                  />
                ))}
              </div>
              <h3>{property?.title || "N/A"}</h3>
              <p>Type: {property?.type || "N/A"}</p>
              <p>Price: ₹{property?.price?.toLocaleString() || "N/A"}</p>
              <p>Location: {property?.location || "N/A"}</p>
              <p>Local Address: {property?.localAddress || "N/A"}</p>
              <p
                className={`property-status ${
                  property?.status === "Available" ? "available" : "sold"
                }`}
              >
                Status: {property?.status || "N/A"}
              </p>

              <p>Area: {property?.area || "N/A"}</p>
              <div className="admin-actions">
                <button onClick={() => setEditProperty(property)}>Edit</button>
                <button onClick={() => handleDelete(property?._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-properties">No properties found.</div>
      )}
    </div>
  );
};

export default Admin;
