import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import PropertyCards from "../components/PropertyCards";
import { getProperties } from "../services/propertyService";
import one from "../image/one_11zon.jpg";
import two from "../image/two_11zon.jpg";
import three from "../image/three_11zon.jpg";
import five from "../image/five_11zon.jpg";
import "./Home.css";
import SearchBar from "../components/SearchBar";
import WhatsAppPopup from "../components/WhatsAppPopup"; // Import WhatsApp Popup

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [bgIndex, setBgIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [visitCount, setVisitCount] = useState(10000); // Visit counter
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const navigate = useNavigate();

  const backgroundImages = [one, two, three, five];
  const headings = [
    "Your Dream Home Awaits",
    "Discover Your Ideal Space",
    "Find Your Perfect Home",
    "Explore Your Dream Property",
  ];

  // Background transition effect
  useEffect(() => {
    const interval = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setBgIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
        setIsFading(false);
      }, 1000);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Increase Visit Counter Daily
  useEffect(() => {
    const lastVisit = localStorage.getItem("lastVisitDate");
    const today = new Date().toISOString().split("T")[0];

    if (lastVisit !== today) {
      let count = parseInt(localStorage.getItem("visitCount")) || 0;
      count += 30; // Increase by 30 daily
      localStorage.setItem("visitCount", count);
      localStorage.setItem("lastVisitDate", today);
    }

    setVisitCount(parseInt(localStorage.getItem("visitCount")) || 0);
  }, []);

  // Fetch properties
  const fetchProperties = useCallback(async () => {
    try {
      const response = await getProperties();
      setProperties(response?.data || []);
    } catch (error) {
      console.error("Failed to fetch properties:", error);
    }
  }, []);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <div
        className={`hero-section ${isFading ? "fade" : ""}`}
        style={{ backgroundImage: `url(${backgroundImages[bgIndex]})` }}
      >
        <h1>{headings[bgIndex]}</h1>
        <p className="hero-para">Find the best properties that match your needs</p>
        <SearchBar />
      </div>

      {/* Visit Counter */}
     
      {/* Property Cards */}
      <div className="property-section">
        <h2>Featured Properties</h2>
        <PropertyCards properties={properties} />
      </div>

      <div className="visit-counter">
        <p>Visitors: <span>{visitCount}</span></p>
      </div>


      {/* WhatsApp Popup Button */}
      {/* <button className="whatsapp-float" onClick={() => setShowWhatsApp(true)}>
        <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" />
      </button> */}

      {/* WhatsApp Popup */}
      {/* {showWhatsApp && <WhatsAppPopup onClose={() => setShowWhatsApp(false)} />} */}
    </div>
  );
};

export default Home;
