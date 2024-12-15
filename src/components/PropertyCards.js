import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProperties } from "../services/propertyService";
import "./PropertyCards.css";

const PropertyCards = () => {
  const [activeTab, setActiveTab] = useState("sale");
  const [visibleCount, setVisibleCount] = useState(3);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch properties from API
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await getProperties();
        const properties = response?.data || [];
        setFilteredProperties(
          properties.filter((property) => property.type.toLowerCase() === activeTab)
        );
      } catch (error) {
        console.error("Failed to fetch properties:", error);
        setFilteredProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [activeTab]);

  const loadMore = () => {
    // Navigate to a specific route when "Show More" is clicked
    navigate(`/properties/${activeTab}`);
  };

  return (
    <div className="property-section">
      <div className="tabs">
        <button
          className={`tab-button ${activeTab === "sale" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("sale");
            setVisibleCount(3);
          }}
        >
          Sale
        </button>
        <button
          className={`tab-button ${activeTab === "rent" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("rent");
            setVisibleCount(3);
          }}
        >
          Rent
        </button>
        <button
          className={`tab-button ${activeTab === "land" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("land");
            setVisibleCount(3);
          }}
        >
          Land
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="property-grid">
          {filteredProperties.slice(0, visibleCount).map((property) => (
            <div key={property._id} className="property-card">
              <div className="property-images">
                {property.images.map((image, index) => (
                  <img
                    key={index}
                    src={`http://localhost:5001${image}`}
                    alt={property.title}
                    className="property-image"
                  />
                ))}
              </div>
              <h3>{property.title}</h3>
              <p>Type: {property.type}</p>
              <p>Price: ${property.price}</p>
              <button className="view-button">View Details</button>
            </div>
          ))}
        </div>
      )}

      {filteredProperties.length > visibleCount && (
        <div className="show-more-container">
          <button onClick={loadMore} className="show-more-button">
            Show More
          </button>
        </div>
      )}
    </div>
  );
};

export default PropertyCards;
