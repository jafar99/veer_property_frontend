import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getProperties } from "../services/propertyService";
import "./PropertyList.css";

const SearchPropertyList = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(false);

  const type = queryParams.get("type");
  const subtype = queryParams.get("subtype");
  const searchLocation = queryParams.get("location");
  const localAddress = queryParams.get("localAddress");

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await getProperties();
        console.log("API Response:", response);
  
        // Ensure we access the correct property data
        const properties = response?.data?.properties || []; 
  
        let filtered = properties.filter(
          (property) =>
            (!type || property?.type?.toLowerCase() === type.toLowerCase()) &&
            (!subtype || property?.subtype?.toLowerCase() === subtype.toLowerCase()) &&
            (!searchLocation || property?.location?.toLowerCase().includes(searchLocation.toLowerCase())) &&
            (!localAddress || property?.localAddress?.toLowerCase().includes(localAddress.toLowerCase()))
        );
  
        setFilteredProperties(filtered);
      } catch (error) {
        console.error("Failed to fetch properties:", error);
        setFilteredProperties([]);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProperties();
  }, [type, subtype, searchLocation, localAddress]);
  

  return (
    <div className="property-list-container">
      <h2>Search Results</h2>
      {loading ? (
        <div className="loader-container">
          <div className="spinner"></div>
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="no-properties-message">
          <p>No properties found.</p>
        </div>
      ) : (
        <div className="property-card-grid">
          {filteredProperties.map((property) => (
            <div key={property?._id} className="property-card">
              <img
                src={property?.images?.[0]?.url}
                alt={property?.title}
                className="property-image"
              />
              <h3>{property?.title}</h3>
              <p>Price: ₹{property?.price?.toLocaleString()}</p>
              <p>Type: {property?.type}</p>
              <p>Subtype: {property?.subtype}</p>
              <p>Location: {property?.location}</p>
              <p>Local Address: {property?.localAddress}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPropertyList;
