import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProperties } from "../services/propertyService";
import "./PropertyList.css";

const PropertyList = () => {
  const { type } = useParams(); // Capture the `type` parameter from the URL
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await getProperties();
        const filtered = response.data.filter(
          (property) => property.type.toLowerCase() === type.toLowerCase()
        );
        setProperties(filtered);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [type]);

  return (
    <div className="property-container">
      <span className="property-type">
        {type.charAt(0).toUpperCase() + type.slice(1)} Properties
      </span>
      {loading ? (
        <p>Loading...</p>
      ) : properties.length > 0 ? (
        <div className="property-grid">
          {properties.map((property) => (
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
              <button
                className="view-button"
                onClick={() => navigate(`/property/${property._id}`)}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No properties available for {type}.</p>
      )}
    </div>
  );
};

export default PropertyList;
