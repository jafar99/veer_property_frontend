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

const subtypeOptions = {
  Rent: [
    { value: "commercial-shops", label: "Commercial Shops" },
    { value: "commercial-plots", label: "Commercial Plots" },
    { value: "row-houses", label: "Row Houses" },
    { value: "commercial-office", label: "Commercial Office" },
    { value: "commercial-godown", label: "Commercial Godown" },
    { value: "flats", label: "Flats" },
  ],
  Residential: [
    { value: "flat", label: "Flat" },
    { value: "row-houses", label: "Row Houses" },
    { value: "plot", label: "Plot" },
  ],
  Land: [
    { value: "residential", label: "Residential" },
    { value: "agricultural", label: "Agricultural" },
    { value: "commercial", label: "Commercial" },
    { value: "industrial", label: "Industrial" },
    { value: "na", label: "NA" },
    { value: "r-zone", label: "R Zone" },
    { value: "green-zone", label: "Green Zone" },
    { value: "gauthan", label: "Gauthan" },
  ],
};

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [bgIndex, setBgIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [subtype, setSubtype] = useState("");
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

  const handleSearch = () => {
    if (!propertyType || !location) {
      alert("Please select property type and location.");
      return;
    }
    navigate(`/property-list/${propertyType}/${subtype}?location=${location}`);
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <div
        className={`hero-section ${isFading ? "fade" : ""}`}
        style={{ backgroundImage: `url(${backgroundImages[bgIndex]})` }}
      >
        <h1>{headings[bgIndex]}</h1>
        <p>Find the best properties that match your needs</p>
        <SearchBar
          location={location}
          setLocation={setLocation}
          propertyType={propertyType}
          setPropertyType={setPropertyType}
          subtype={subtype}
          setSubtype={setSubtype}
          subtypeOptions={subtypeOptions}
          onSearch={handleSearch}
        />
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
