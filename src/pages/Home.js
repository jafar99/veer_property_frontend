import React, { useState, useEffect } from "react";
import PropertyCards from "../components/PropertyCards";
import { getProperties } from "../services/propertyService";
import { useNavigate } from "react-router-dom";
import one from "../image/one.jpg";
import two from "../image/two.jpg";
import three from "../image/three.jpg";
import four from "../image/four.jpg";
import five from "../image/five.jpg";
import "./Home.css";

const Home = () => {
  const [properties, setProperties] = useState([]); // Store all properties
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const [bgIndex, setBgIndex] = useState(0); // Background image index
  const navigate = useNavigate();

  // Array of background images
  const backgroundImages = [one, two, three, five];

  // Corresponding headings for each image
  const headings = [
    "Your Dream Home Awaits",
    "Discover Your Ideal Space",
    "Find Your Perfect Home",
    "Explore Your Dream Property",
  ];

  // Ensure the number of images and headings match
  if (headings.length !== backgroundImages.length) {
    console.warn("Warning: Headings and Background Images count mismatch!");
  }

  // Change background image every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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
    setShowModal(true);
  };

  const handleOptionClick = (type) => {
    setShowModal(false);
    navigate(`/properties/${type}`);
  };

  return (
    <div>
      {/* Hero Section with Dynamic Background */}
      <div
        className="hero-section"
        style={{ backgroundImage: `url(${backgroundImages[bgIndex]})` }}
      >
        <h1>{headings[bgIndex]}</h1>
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
