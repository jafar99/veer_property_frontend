import React, { useState } from "react";
import "./SearchBar.css"; // Style file

const SearchBar = () => {
  const [selectedTab, setSelectedTab] = useState("Rent");
  const [propertyType, setPropertyType] = useState("All Residential");
  const [searchQuery, setSearchQuery] = useState("");

  const tabs = ["Buy", "Rent", "New Launch", "PG / Co-living", "Commercial", "Plots/Land", "Projects"];
  const propertyOptions = ["All Residential", "Apartments", "Villas", "Commercial"];

  const handleSearch = () => {
    console.log(`Searching for ${searchQuery} in ${selectedTab}`);
    // Here you can integrate search API call
  };

  return (
    <div className="search-bar-container">
      {/* Tabs Section */}
      <div className="search-tabs">
        {tabs.map((tab) => (
          <span
            key={tab}
            className={`tab ${selectedTab === tab ? "active" : ""}`}
            onClick={() => setSelectedTab(tab)}
          >
            {tab}
          </span>
        ))}
      </div>

      {/* Search Input Section */}
      <div className="search-box">
        {/* Dropdown for property type */}
        <select
          className="property-dropdown"
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}
        >
          {propertyOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>

        {/* Search Input */}
        <input
          type="text"
          placeholder={`Search "Flats for rent in sector 77 Noida"`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Icons (Location & Voice Search) */}
        <span className="icon location-icon">📍</span>
        <span className="icon voice-icon">🎤</span>

        {/* Search Button */}
        <button className="search-btn" onClick={handleSearch}>
          Search
        </button>
      </div>

      {/* Recent Searches Section */}
      <div className="recent-searches">
        <span>Recent searches:</span>
        <button className="recent-search">PG in Andheri East</button>
        <button className="view-all">View all searches</button>
      </div>
    </div>
  );
};

export default SearchBar;
