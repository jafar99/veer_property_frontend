import React, { useState, useEffect } from "react";
import PropertyCards from "../components/PropertyCards";
import { getProperties } from "../services/propertyService";
import { useNavigate } from "react-router-dom";
import one from "../image/one.jpg";
import two from "../image/two.jpg";
import three from "../image/three.jpg";
import five from "../image/five.jpg";
import SearchBar from "../components/SearchBar"; // Import SearchBar
import "./Home.css";

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [bgIndex, setBgIndex] = useState(0);
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

  return (
    <div>
      {/* Hero Section */}
      <div className="hero-section" style={{ backgroundImage: `url(${backgroundImages[bgIndex]})` }}>
        <h1>{headings[bgIndex]}</h1>
        <p>Find the best properties that match your needs</p>
      </div>

      {/* Search Bar Component */}
      {/* <SearchBar /> */}

      {/* Property Cards Section */}
      <div className="property-section">
        <h2>Featured Properties</h2>
        <PropertyCards properties={properties} />
      </div>
    </div>
  );
};

export default Home;
