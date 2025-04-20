import React, { useState, useEffect, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProperties } from "../services/propertyService";
import "./SearchBar.css";

const SearchBar = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await getProperties();
        setProperties(response?.data?.properties || []);
      } catch (error) {
        console.error("Failed to fetch properties:", error);
      }
    };
    fetchProperties();
  }, []);

  useLayoutEffect(() => {
    const resizeObserverError = error => {
      if (error.message.includes('ResizeObserver loop')) {
        const resizeObserverErrDiv = document.getElementById(
          'webpack-dev-server-client-overlay-div'
        );
        const resizeObserverErr = document.getElementById(
          'webpack-dev-server-client-overlay'
        );
        if (resizeObserverErr) {
          resizeObserverErr.style.display = 'none';
        }
        if (resizeObserverErrDiv) {
          resizeObserverErrDiv.style.display = 'none';
        }
      }
    };

    window.addEventListener('error', resizeObserverError);
    return () => {
      window.removeEventListener('error', resizeObserverError);
    };
  }, []);

  const formatPrice = (price) => {
    if (!price) return "";
    // Convert string price to number and format
    const numPrice = parseFloat(price.replace(/[^\d.-]/g, ''));
    if (isNaN(numPrice)) return price;
    
    if (numPrice >= 10000000) {
      return `₹${(numPrice / 10000000).toFixed(2)} Cr`;
    } else if (numPrice >= 100000) {
      return `₹${(numPrice / 100000).toFixed(2)} Lac`;
    } else {
      return `₹${numPrice.toLocaleString()}`;
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowSuggestions(true);

    if (value.trim()) {
      const searchValue = value.toLowerCase();
      
      // Filter properties based on search term - more inclusive search
      const filtered = properties.filter(property => {
        const searchFields = [
          property.location,
          property.localAddress,
          property.title,
          property.type,
          property.subtype,
          property.availableFor,
          property.status,
          property.price?.toString(),
          property.area
        ];

        return searchFields.some(field => 
          field?.toLowerCase().includes(searchValue)
        );
      });

      // Create categorized suggestions
      const suggestions = [];

      // Location based suggestions
      const locationSuggestions = filtered
        .map(p => ({
          type: 'location',
          text: p.location,
          subtext: `${p.type} Properties Available`,
          count: filtered.filter(fp => fp.location === p.location).length,
          icon: 'location'
        }))
        .filter((s, i, self) => 
          s.text && i === self.findIndex(t => t.text === s.text)
        );
      suggestions.push(...locationSuggestions);

      // Project suggestions with exact price
      const projectSuggestions = filtered
        .map(p => ({
          type: 'project',
          text: p.title,
          subtext: `${p.location} | ₹${p.price}`,
          status: p.status,
          propertyType: p.type,
          icon: 'building'
        }))
        .filter(s => s.text);
      suggestions.push(...projectSuggestions);

      // Area suggestions with exact area
      const areaSuggestions = filtered
        .map(p => ({
          type: 'area',
          text: p.localAddress,
          subtext: `${p.location} | ${p.area || 'Area N/A'}`,
          icon: 'map'
        }))
        .filter((s, i, self) => 
          s.text && i === self.findIndex(t => t.text === s.text)
        );
      suggestions.push(...areaSuggestions);

      // Property Type suggestions
      const typeSuggestions = filtered
        .map(p => ({
          type: 'propertyType',
          text: `${p.type} - ${p.subtype}`,
          subtext: `${filtered.filter(fp => fp.type === p.type && fp.subtype === p.subtype).length} Properties`,
          icon: 'home'
        }))
        .filter((s, i, self) => 
          s.text && i === self.findIndex(t => t.text === s.text)
        );
      suggestions.push(...typeSuggestions);

      // Status suggestions
      const statusSuggestions = filtered
        .map(p => ({
          type: 'status',
          text: p.status,
          subtext: `${filtered.filter(fp => fp.status === p.status).length} Properties`,
          icon: 'status'
        }))
        .filter((s, i, self) => 
          s.text && i === self.findIndex(t => t.text === s.text)
        );
      suggestions.push(...statusSuggestions);

      // Price suggestions with exact prices
      const priceSuggestions = filtered
        .map(p => ({
          type: 'price',
          text: `₹${p.price}`,
          subtext: `${p.type} in ${p.location}`,
          icon: 'price'
        }))
        .filter((s, i, self) => 
          s.text && i === self.findIndex(t => t.text === s.text)
        );
      suggestions.push(...priceSuggestions);

      // Limit and set suggestions
      setSuggestions(suggestions.slice(0, 10));
    } else {
      setSuggestions([]);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'location':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        );
      case 'project':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
            <line x1="12" y1="18" x2="12" y2="18"/>
          </svg>
        );
      case 'propertyType':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        );
      case 'priceRange':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="1" x2="12" y2="23"/>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
        );
      case 'availability':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        );
      default:
        return null;
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.text);
    setShowSuggestions(false);
    
    let searchParams = new URLSearchParams();
    searchParams.set('q', suggestion.text);
    searchParams.set('type', suggestion.type);
    
    // Add additional parameters based on suggestion type
    if (suggestion.type === 'price') {
      searchParams.set('priceExact', suggestion.text.replace('₹', ''));
    }
    if (suggestion.type === 'status') {
      searchParams.set('status', suggestion.text);
    }
    
    navigate(`/search?${searchParams.toString()}`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.modern-search-container')) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="modern-search-container">
      <form onSubmit={handleSearch} className="modern-search-form">
        <div className="search-input-wrapper">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by location, project name, area.."
            className="modern-search-input"
            onFocus={() => setShowSuggestions(true)}
          />
          <button type="submit" className="modern-search-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </button>
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <div className="suggestions-container">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="suggestion-item"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <div className="suggestion-icon">
                  {getIcon(suggestion.type)}
                </div>
                <div className="suggestion-content">
                  <div className="suggestion-text">{suggestion.text}</div>
                  <div className="suggestion-subtext">{suggestion.subtext}</div>
                </div>
                {suggestion.status && (
                  <div className={`suggestion-status status-${suggestion.status.toLowerCase()}`}>
                    {suggestion.status}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchBar;
