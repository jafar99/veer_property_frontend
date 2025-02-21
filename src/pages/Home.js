import React, { useState, useEffect } from "react";
import PropertyCards from "../components/PropertyCards";
import { getProperties } from "../services/propertyService";
import { useNavigate } from "react-router-dom";
import one from "../image/one_11zon.jpg";
import two from "../image/two_11zon.jpg";
import three from "../image/three_11zon.jpg";
import five from "../image/five_11zon.jpg";
import "./Home.css";

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [bgIndex, setBgIndex] = useState(0);
  const [visitorCount, setVisitorCount] = useState(10000);
  const navigate = useNavigate();

  const backgroundImages = [one, two, three, five];
  const headings = [
    "Your Dream Home Awaits",
    "Discover Your Ideal Space",
    "Find Your Perfect Home",
    "Explore Your Dream Property",
  ];

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
        setProperties(response?.data || []);
      } catch (error) {
        console.error("Failed to fetch properties:", error);
      }
    };

    fetchProperties();
  }, []);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format
    let storedCount = localStorage.getItem("visitorCount");
    let lastUpdated = localStorage.getItem("lastUpdatedDate");

    if (!storedCount || !lastUpdated) {
      // First time visit
      storedCount = 10000;
      lastUpdated = today;
    } else {
      storedCount = parseInt(storedCount);
      if (lastUpdated !== today) {
        // If it's a new day, increase by 20
        storedCount += 20;
        lastUpdated = today;
      }
    }

    setVisitorCount(storedCount);
    localStorage.setItem("visitorCount", storedCount);
    localStorage.setItem("lastUpdatedDate", lastUpdated);
  }, []);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="hero-section" style={{ backgroundImage: `url(${backgroundImages[bgIndex]})` }}>
        <h1>{headings[bgIndex]}</h1>
        <p>Find the best properties that match your needs</p>
      </div>

      {/* Property Cards Section */}
      <div className="property-section">
        <h2>Featured Properties</h2>
        <PropertyCards properties={properties} />
      </div>

      {/* Visitor Counter */}
      <div className="visitor-counter">
        <p>Visitors: {visitorCount}</p>
      </div>
      
    </div>
  );
};

export default Home;
