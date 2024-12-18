import React, { useState, useEffect } from "react";
import PropertyCards from "../components/PropertyCards";
import { getProperties } from "../services/propertyService";
import "./Home.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [properties, setProperties] = useState([]); // Store all properties
  const [filteredProperties, setFilteredProperties] = useState([]); // Filtered properties
  const [locationFilter, setLocationFilter] = useState(""); // Location filter
  const [areaFilter, setAreaFilter] = useState(""); // Area filter

  const navigate = useNavigate();

  // Fetch properties from the API
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await getProperties();
        const properties = response?.data || [];
        setProperties(properties);
        setFilteredProperties(properties); // Initialize filtered properties
      } catch (error) {
        console.error("Failed to fetch properties:", error);
      }
    };

    fetchProperties();
  }, []);

  // Handle location filter change
  const handleLocationChange = (e) => {
    setLocationFilter(e.target.value);
  };

  // Handle area filter change
  const handleAreaChange = (e) => {
    setAreaFilter(e.target.value);
  };

  // Handle filter action
  const handleSearch = () => {
    const filtered = properties.filter((property) => {
      const matchesLocation = locationFilter
        ? property.location.toLowerCase().includes(locationFilter.toLowerCase())
        : true;
      const matchesArea = areaFilter
        ? property.area.toLowerCase().includes(areaFilter.toLowerCase())
        : true;

      return matchesLocation && matchesArea;
    });
    setFilteredProperties(filtered);
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="hero-section">
        <h1>Find Your Dream Property</h1>
        <p>Discover the perfect place to call home</p>
        <div className="search-bar">
          {/* Location Filter */}
          <input
            type="text"
            placeholder="Search by location..."
            value={locationFilter}
            onChange={handleLocationChange}
          />
          {/* Area Filter */}
          <input
            type="text"
            placeholder="Search by area..."
            value={areaFilter}
            onChange={handleAreaChange}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
      </div>

      {/* Property Cards */}
      <PropertyCards properties={filteredProperties} />
    </div>
  );
};

export default Home;
