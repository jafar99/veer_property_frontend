import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProperties } from "../services/propertyService";
import "./PropertyList.css";

const PropertyList = () => {
  const { type, subtype } = useParams(); // Capture type & subtype from URL
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await getProperties();
        const allProperties = response?.data?.properties || [];

        // Filter properties by `type`
        let filtered = allProperties.filter(
          (property) => property.type.toLowerCase() === type.toLowerCase()
        );

        // Further filter by `subtype` if provided
        if (subtype) {
          filtered = filtered.filter(
            (property) => property.subtype?.toLowerCase() === subtype.toLowerCase()
          );
        }

        setProperties(filtered);
        setFilteredProperties(filtered);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [type, subtype]);

  // Handle search query change
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Apply filtering logic
    const filtered = properties.filter(
      (property) =>
        property.location.toLowerCase().includes(query) ||
        property.localAddress.toLowerCase().includes(query)
    );
    setFilteredProperties(filtered);
  };

  return (
    <div className="property-container">
      <div className="property-type">
        {type.charAt(0).toUpperCase() + type.slice(1)} Properties{" "}
        {subtype && `- ${subtype.charAt(0).toUpperCase() + subtype.slice(1)}`}
      </div>

      {/* Search Box */}
      <div className="search-box">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search by location..."
          className="search-input"
        />
      </div>

      {loading ? (
        <div className="loading"></div>
      ) : filteredProperties.length === 0 ? (
        <div className="no-results">
          <p>No properties found.</p>
        </div>
      ) : (
        <div className="property-grid">
          {filteredProperties.map((property) => (
            <div key={property?._id} className="property-card">
              <h3>{property?.title || "N/A"}</h3>
              <p>Type: {property?.type || "N/A"}</p>
              <p>Subtype: {property?.subtype || "N/A"}</p>
              <p>Price: ₹{property?.price?.toLocaleString() || "N/A"}</p>
              <p>Location: {property?.location || "N/A"}</p>
              <button
                className="view-button"
                onClick={() => navigate(`/property/${property?._id}`)}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyList;
