import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import PropertyCards from "../components/PropertyCards";
import { getProperties } from "../services/propertyService";
import one from "../image/one_11zon.jpg";
import two from "../image/two_11zon.jpg";
import three from "../image/three_11zon.jpg";
import five from "../image/five_11zon.jpg";
import axios from "axios";
import "./Home.css";
import "./Offer.css";
import SearchBar from "../components/SearchBar";

const API_URL = process.env.REACT_APP_API_URL;

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [bgIndex, setBgIndex] = useState(0);
  const navigate = useNavigate();
  const [paused, setPaused] = useState(false);
  const [offers, setOffers] = useState([]);

  const backgroundImages = [one, two ];
  const headings = [
    {
      title: "Find Your Dream Property",
      subtitle: "Search from thousands of properties across prime locations"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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

  useEffect(() => {
    // Fetch offers
    axios.get(`${API_URL}/offers`)
      .then(res => setOffers(res.data.offers || []))
      .catch(() => setOffers([]));
  }, []);

  return (
    <div className="home-wrapper">
      <div className="hero-wrapper">
        <div 
          className="hero-section"
          style={{ backgroundImage: `url(${backgroundImages[bgIndex]})` }}
        >
          <div className="hero-content-wrapper">
            <div className="hero-text">
              <h1>{headings[0].title}</h1>
              <p>{headings[0].subtitle}</p>
            </div>
            <div className="hero-search">
              <SearchBar />
            </div>
          </div>
        </div>
      </div>

      <div className="main-content">
        <div className="stats-wrapper">
          <div className="stats-container">
            <div className="stat-box">
              <div className="stat-icon">🏠</div>
              <div className="stat-info">
                <h3>500+</h3>
                <p>Properties Listed</p>
              </div>
            </div>
            <div className="stat-box">
              <div className="stat-icon">👥</div>
              <div className="stat-info">
                <h3>300+</h3>
                <p>Happy Clients</p>
              </div>
            </div>
            <div className="stat-box">
              <div className="stat-icon">⭐</div>
              <div className="stat-info">
                <h3>10+</h3>
                <p>Years Experience</p>
              </div>
            </div>
          </div>
        </div>

        {/* Offer Section */}
        {offers.length > 0 && (
          <div className="offer-marquee-container">
            <h2 className="offer-marquee-title">
              <span role="img" aria-label="offer">🏷️</span> Latest Offers
            </h2>
            <div className="modern-marquee">
              <div
                className="marquee-content"
                style={{
                  animationPlayState: paused ? "paused" : "running",
                  cursor: "pointer"
                }}
                onClick={() => setPaused((prev) => !prev)}
                title={paused ? "Click to resume" : "Click to pause"}
              >
                {offers.map((offer, idx) =>
                  offer.images && offer.images.length > 0 ? (
                    <span key={offer._id || idx} className="marquee-offer">
                      <img
                        src={offer.images[0].url}
                        alt="Offer"
                        className="marquee-offer-img"
                      />
                    </span>
                  ) : null
                )}
              </div>
            </div>
          </div>
        )}

        <div className="featured-wrapper">
          <div className="featured-header">
            <div className="section-title">
              <h2>Featured Properties</h2>
              <p>Explore our handpicked premium properties</p>
            </div>
          </div>
          <PropertyCards properties={properties} />
        </div>
      </div>

      <a 
        href={`https://wa.me/${process.env.REACT_APP_MOBILE_NO}`} 
        target="_blank" 
        rel="noopener noreferrer"
        className="whatsapp-button"
        aria-label="Chat on WhatsApp"
      >
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" 
          alt="WhatsApp"
        />
      </a>
    </div>
  );
};

export default Home;
