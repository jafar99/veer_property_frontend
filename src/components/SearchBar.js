import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { subtypeOptions } from "../services/data";
import { getProperties } from "../services/propertyService";
import "./SearchBar.css";

const SearchBar = () => {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    location: "",
    localAddress: "",
    type: "",
    subtype: "",
  });

  const [properties, setProperties] = useState([]);
  const [locations, setLocations] = useState([]);
  const [localAddresses, setLocalAddresses] = useState([]);
  const [error, setError] = useState(""); 
  const [noResults, setNoResults] = useState(false); 

  // Fetch properties on mount
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await getProperties();
        const data = response?.data?.properties || [];

        console.log("Fetched Properties:", data); // Debugging

        setProperties(data);

        // Extract unique locations & local addresses
        const uniqueLocations = [...new Set(data.map((p) => p?.location?.trim().toLowerCase()))].filter(Boolean);
        const uniqueLocalAddresses = [...new Set(data.map((p) => p?.localAddress?.trim().toLowerCase()))].filter(Boolean);

        setLocations(uniqueLocations);
        setLocalAddresses(uniqueLocalAddresses);
      } catch (error) {
        console.error("Failed to fetch properties:", error);
      }
    };

    fetchProperties();
  }, []);

  // ✅ Update error message dynamically whenever filters change
  useEffect(() => {
    if (!filters.location || !filters.localAddress || !filters.type || !filters.subtype) {
      setError("Please select all fields before searching.");
    } else {
      setError(""); // ✅ Clear error when all fields are selected
    }
  }, [filters]);

  // Handle search
  const handleSearch = () => {
    if (!filters.location || !filters.localAddress || !filters.type || !filters.subtype) {
      setError("Please select all fields before searching.");
      setNoResults(false);
      return;
    }

    setError(""); // ✅ Clear error if valid

    const filteredProperties = properties.filter(
      (property) =>
        property.type?.toLowerCase() === filters.type.toLowerCase() &&
        property.subtype?.toLowerCase() === filters.subtype.toLowerCase() &&
        property.location?.trim().toLowerCase() === filters.location.toLowerCase() &&
        property.localAddress?.trim().toLowerCase() === filters.localAddress.toLowerCase()
    );

    if (filteredProperties.length === 0) {
      setNoResults(true);
      setError("No results available for the selected filters.");
      return;
    }

    setNoResults(false);
    navigate(
      `/search?type=${filters.type}&subtype=${filters.subtype}&location=${filters.location}&localAddress=${filters.localAddress}`
    );
  };

  return (
    <div className="search-bar-container">
      <div className="search-bar">
        {/* Property Type Dropdown */}
        <select
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value, subtype: "" })}
        >
          <option value="">Select Type</option>
          <option value="Rent">Rent</option>
          <option value="Residential">Residential</option>
          <option value="Land">Land</option>
        </select>

        {/* Subtype Dropdown */}
        <select
          value={filters.subtype}
          onChange={(e) => setFilters({ ...filters, subtype: e.target.value })}
          disabled={!filters.type}
        >
          <option value="">Select Subtype</option>
          {filters.type &&
            subtypeOptions[filters.type]?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
        </select>

        {/* Location Dropdown */}
        <select
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
        >
          <option value="">Select Location</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>

        {/* Local Address Dropdown */}
        <select
          value={filters.localAddress}
          onChange={(e) => setFilters({ ...filters, localAddress: e.target.value })}
        >
          <option value="">Select Local Address</option>
          {localAddresses.map((addr) => (
            <option key={addr} value={addr}>
              {addr}
            </option>
          ))}
        </select>

        {/* Search Button */}
        <button onClick={handleSearch} disabled={!filters.location || !filters.localAddress || !filters.type || !filters.subtype}>
          Search
        </button>
      </div>

      {/* Error Message */}
      {error && <p className="search-error-message">{error}</p>}
    </div>
  );
};

export default SearchBar;
