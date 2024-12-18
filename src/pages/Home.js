import React, { useState, useEffect } from "react";
import PropertyCards from "../components/PropertyCards";
import { getProperties } from "../services/propertyService";
import "./Home.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [properties, setProperties] = useState([]); // Store all properties

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

  return (
    <div>
      {/* Hero Section */}
      <div className="hero-section">
        <h1>Explore Your Future Home</h1>
        <p>Find the best properties that match your needs</p>
        <button className="explore-btn" onClick={() => navigate("/properties/Residential")}>
          Explore Now
        </button>
      </div>

      {/* Property Cards */}
      <div className="property-section">
        <h2>Featured Properties</h2>
        <PropertyCards properties={properties} />
      </div>
    </div>
  );
};

export default Home;
