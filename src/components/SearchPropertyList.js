import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getProperties } from "../services/propertyService";
import "./SearchPropertyList.css";

const SearchPropertyList = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const navigate = useNavigate();

  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [contactDetails, setContactDetails] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  // Get all possible query parameters
  const searchQuery = queryParams.get("q");
  const searchType = queryParams.get("type");
  const priceRange = queryParams.get("priceRange");

  useEffect(() => {
    const fetchAndFilterProperties = async () => {
      try {
        setLoading(true);
        const response = await getProperties();
        const properties = response?.data?.properties || [];

        // Filter properties based on search parameters
        let filtered = properties.filter(property => {
          const matchesSearch = !searchQuery || (
            property?.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            property?.localAddress?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            property?.title?.toLowerCase().includes(searchQuery.toLowerCase())
          );

          // Type-specific filtering
          const matchesType = !searchType || (
            searchType === 'location' ? property?.location?.toLowerCase().includes(searchQuery.toLowerCase()) :
            searchType === 'project' ? property?.title?.toLowerCase().includes(searchQuery.toLowerCase()) :
            searchType === 'area' ? property?.localAddress?.toLowerCase().includes(searchQuery.toLowerCase()) :
            searchType === 'propertyType' ? property?.type?.toLowerCase() === searchQuery.toLowerCase() :
            searchType === 'availability' ? property?.availableFor?.toLowerCase() === searchQuery.toLowerCase() :
            true
          );

          // Price range filtering
          let matchesPriceRange = true;
          if (priceRange) {
            const [min, max] = priceRange.split('-').map(Number);
            const propertyPrice = parseFloat(property?.price?.replace(/[^\d.-]/g, ''));
            matchesPriceRange = propertyPrice >= min && propertyPrice <= max;
          }

          return matchesSearch && matchesType && matchesPriceRange;
        });

        // Sort properties based on relevance
        filtered = filtered.sort((a, b) => {
          if (searchQuery) {
            const aTitle = a.title?.toLowerCase() || '';
            const bTitle = b.title?.toLowerCase() || '';
            const query = searchQuery.toLowerCase();
            
            // Exact matches come first
            if (aTitle === query && bTitle !== query) return -1;
            if (bTitle === query && aTitle !== query) return 1;
            
            // Then starts with matches
            if (aTitle.startsWith(query) && !bTitle.startsWith(query)) return -1;
            if (bTitle.startsWith(query) && !aTitle.startsWith(query)) return 1;
          }
          
          // Default to newest first (assuming _id contains timestamp)
          return b._id?.localeCompare(a._id);
        });

        setFilteredProperties(filtered);
      } catch (error) {
        console.error("Failed to fetch properties:", error);
        setFilteredProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAndFilterProperties();
  }, [searchQuery, searchType, priceRange]);

  const formatPrice = (price) => {
    if (!price) return "N/A";
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

  const viewDetails = (propertyId) => {
    navigate(`/property/${propertyId}`);
  };

  const handleContactClick = (property) => {
    setSelectedProperty(property);
    setShowContactForm(true);
  };

  const isFormValid = () => {
    const { name, email, phone } = contactDetails;
    if (!name || !email || !phone) {
      alert("Please fill out all required fields.");
      return false;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      alert("Please enter a valid email address.");
      return false;
    }
    return true;
  };

  const handleSendToWhatsApp = () => {
    if (!isFormValid()) return;

    const { name, email, phone, message } = contactDetails;
    const propertyDetails = `Property Name: ${selectedProperty.title}\nPrice: ${formatPrice(selectedProperty.price)}\nLocation: ${selectedProperty.location}`;
    const userDetails = `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`;
    const fullMessage = `Hello, I'm interested in the following property:\n\n${propertyDetails}\n\nMy Details:\n${userDetails}`;

    const whatsappURL = `https://wa.me/${
      process.env.REACT_APP_MOBILE_NO
    }?text=${encodeURIComponent(fullMessage)}`;
    window.open(whatsappURL, "_blank");
    setShowContactForm(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  return (
    <div className="search-container">
      <div className="search-header">
        <h2 className="search-title">
          {searchType ? `${searchType.charAt(0).toUpperCase() + searchType.slice(1)} Results` : 'Search Results'}
        </h2>
        <p className="search-count">{filteredProperties.length} properties found</p>
      </div>

      {loading ? (
        <div className="search-loader">
          <div className="search-spinner"></div>
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="search-no-results">
          <p>No properties found matching your criteria.</p>
          <button onClick={() => navigate('/')} className="back-button">
            Back to Search
          </button>
        </div>
      ) : (
        <div className="search-grid">
          {filteredProperties.map((property) => (
            <div key={property?._id} className="search-card">
              <div className="search-images">
                {property?.images?.[0] && (
                  <img
                    src={property.images[0].url}
                    alt={property?.title || "Property"}
                    className="search-image"
                    loading="lazy"
                  />
                )}
                <div className={`search-property-status search-property-status-${property?.status?.toLowerCase()}`}>
                  {property?.status}
                </div>
              </div>

              <div className="search-card-content">
                <h3 className="search-property-title">{property?.title || "N/A"}</h3>
                <p className="search-property-price">{formatPrice(property?.price)}</p>
                <div className="search-property-details">
                  <p className="search-property-type">
                    {property?.type} - {property?.subtype}
                  </p>
                  <p className="search-property-area">{property?.area || "Area N/A"}</p>
                </div>
                <p className="search-property-location">
                  {property?.location}
                  {property?.localAddress && (
                    <span className="search-property-address">
                      {property.localAddress}
                    </span>
                  )}
                </p>
                
                <div className="search-card-actions">
                  <button
                    className="search-details-btn"
                    onClick={() => viewDetails(property?._id)}
                  >
                    View Details
                  </button>
                  <button
                    className="search-contact-btn"
                    onClick={() => handleContactClick(property)}
                  >
                    Contact Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showContactForm && (
        <div className="overlay">
          <div className="contact-modal">
            <h2>Contact About Property</h2>
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={contactDetails.name}
                onChange={handleInputChange}
                placeholder="Enter your name"
                required
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={contactDetails.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
              />
            </label>
            <label>
              Phone:
              <input
                type="tel"
                name="phone"
                value={contactDetails.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
                required
              />
            </label>
            <label>
              Message:
              <textarea
                name="message"
                value={contactDetails.message}
                onChange={handleInputChange}
                placeholder="Enter your message"
                rows="4"
              />
            </label>
            <div className="modal-buttons">
              <button className="whatsapp-btn" onClick={handleSendToWhatsApp}>
                Send to WhatsApp
              </button>
              <button className="close-btn" onClick={() => setShowContactForm(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPropertyList;
