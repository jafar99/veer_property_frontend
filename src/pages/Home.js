import React, { useState, useEffect } from "react";
import PropertyCards from "../components/PropertyCards";
import { getProperties } from "../services/propertyService";
import "./Home.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [properties, setProperties] = useState([]); // Store all properties
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const navigate = useNavigate();

  // Fetch properties from the API
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await getProperties();
        const properties = response?.data || [];
        setProperties(properties);
      } catch (error) {
        console.error("Failed to fetch properties:", error);
      }
    };

    fetchProperties();
  }, []);

  const handleExploreClick = () => {
    setShowModal(true); // Open the modal
  };

  const handleOptionClick = (type) => {
    setShowModal(false); // Close the modal
    navigate(`/properties/${type}`); // Navigate to the selected type
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="hero-section">
        <h1>Explore Your Future Home</h1>
        <p>Find the best properties that match your needs</p>
        <button className="explore-btn" onClick={handleExploreClick}>
          Explore Now
        </button>
      </div>

      {/* Property Cards */}
      <div className="property-section">
        <h2>Featured Properties</h2>
        <PropertyCards properties={properties} />
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Select Property Type</h3>
            <div className="modal-options">
              <button onClick={() => handleOptionClick("Residential")}>
                Residential
              </button>
              <button onClick={() => handleOptionClick("Land")}>Land</button>
              <button onClick={() => handleOptionClick("Rent")}>Rent</button>
            </div>
            <button className="close-modal" onClick={() => setShowModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
