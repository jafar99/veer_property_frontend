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

  // Add this new state for image carousel
  const [currentImageIndexes, setCurrentImageIndexes] = useState({});

  useEffect(() => {
    const fetchAndFilterProperties = async () => {
      try {
        setLoading(true);
        const response = await getProperties();
        const properties = response?.data?.properties || [];

        // Filter properties based on search parameters
        let filtered = properties.filter(property => {
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

          const matchesSearch = !searchQuery || searchFields.some(field => 
            field?.toLowerCase().includes(searchQuery.toLowerCase())
          );

          // Type-specific filtering
          const matchesType = !searchType || (
            searchType === 'location' ? property?.location?.toLowerCase().includes(searchQuery.toLowerCase()) :
            searchType === 'project' ? property?.title?.toLowerCase().includes(searchQuery.toLowerCase()) :
            searchType === 'area' ? property?.localAddress?.toLowerCase().includes(searchQuery.toLowerCase()) :
            searchType === 'propertyType' ? `${property?.type} - ${property?.subtype}`.toLowerCase() === searchQuery.toLowerCase() :
            searchType === 'status' ? property?.status?.toLowerCase() === searchQuery.toLowerCase() :
            searchType === 'price' ? property?.price?.toString() === searchQuery.replace('₹', '') :
            true
          );

          return matchesSearch && matchesType;
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
  }, [searchQuery, searchType]);

  const formatPrice = (price) => {
    if (!price) return "N/A";
    return `₹${price.toLocaleString()}`;
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

  // Add these handler functions
  const handlePrevImage = (propertyId) => {
    setCurrentImageIndexes(prev => {
      const currentIndex = prev[propertyId] || 0;
      const newIndex = currentIndex === 0 ? 0 : currentIndex - 1;
      return { ...prev, [propertyId]: newIndex };
    });
  };

  const handleNextImage = (propertyId, maxLength) => {
    setCurrentImageIndexes(prev => {
      const currentIndex = prev[propertyId] || 0;
      const newIndex = currentIndex === maxLength - 1 ? maxLength - 1 : currentIndex + 1;
      return { ...prev, [propertyId]: newIndex };
    });
  };

  return (
    <div className="property-cardss-section">
      <div className="property-heading">
        {searchType ? `${searchType.charAt(0).toUpperCase() + searchType.slice(1)} Results` : 'Search Results'}
        <p className="search-count">{filteredProperties.length} properties found</p>
      </div>

      {loading ? (
        <div className="loader-container">
          <div className="spinner"></div>
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="property-cardss-no-results">
          <p>No properties found matching your criteria.</p>
          <button onClick={() => navigate('/')} className="property-cardss-view-button">
            Back to Search
          </button>
        </div>
      ) : (
        <div className="property-cardss-grid">
          {filteredProperties.map((property) => (
            <div key={property?._id} className="property-cardss-card">
              <div id={`property-${property?._id}`} className="property-cardss-images">
                <div 
                  className="property-cardss-image-wrapper"
                  style={{ 
                    transform: `translateX(-${(currentImageIndexes[property?._id] || 0) * 100}%)`
                  }}
                >
                  {property?.images?.map((image, index) => (
                    <div key={index} className="property-cardss-image-container">
                      <img
                        src={image?.url}
                        alt={property?.title || "Property Image"}
                        className="property-cardss-image"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
                {/* Navigation dots */}
                <div className="property-cardss-image-dots">
                  {property?.images?.map((_, index) => (
                    <span
                      key={index}
                      className={`property-cardss-image-dot ${
                        (currentImageIndexes[property?._id] || 0) === index ? 'active' : ''
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndexes(prev => ({
                          ...prev,
                          [property?._id]: index
                        }));
                      }}
                    />
                  ))}
                </div>
                {/* Navigation arrows */}
                {property?.images?.length > 1 && (
                  <>
                    <div 
                      className="property-cardss-image-nav prev"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrevImage(property?._id);
                      }}
                    >
                      ❮
                    </div>
                    <div 
                      className="property-cardss-image-nav next"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNextImage(property?._id, property?.images?.length);
                      }}
                    >
                      ❯
                    </div>
                  </>
                )}
                {/* Badges */}
                <div className="property-cardss-badges">
                  {property?.rera && property.rera !== "" && (
                    <div className="property-cardss-badge rera">
                      <span className="badge-icon">📋</span>
                      {property.rera}
                    </div>
                  )}
                  <div className={`property-cardss-badge status-${property?.status?.toLowerCase()}`}>
                    <span className="badge-icon">
                      {property?.status === 'Available' ? '✅' : 
                       property?.status === 'Sold' ? '🔒' : '🔜'}
                    </span>
                    {property?.status}
                  </div>
                </div>
              </div>
              <h3 className="property-cardss-title">
                {property?.title || "N/A"}
              </h3>
              <p className="property-cardss-price">
                Price: {formatPrice(property?.price)}
              </p>
              <p className="property-cardss-type">
                Type: {property?.type || "N/A"}
              </p>
              <p className="property-cardss-subtype">
                Subtype: {property?.subtype || "N/A"}
              </p>
              <p className="property-cardss-area">
                Area Size: {property?.area || "N/A"}
              </p>
              <p className="property-cardss-location">
                <span>📍</span>
                {property?.location} 
                {property?.localAddress && ` - ${property?.localAddress}`}
              </p>
              <div className="property-cardss-buttons">
                <button
                  className="property-cardss-view-button"
                  onClick={() => viewDetails(property?._id)}
                >
                  View Details
                </button>
                <button
                  className="property-cardss-contact-button"
                  onClick={() => handleContactClick(property)}
                >
                  WhatsApp
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Contact Form Modal */}
      {showContactForm && selectedProperty && (
        <div className="property-cardss-contact-form-overlay">
          <div className="property-cardss-contact-form">
            <h2 className="property-cardss-contact-title">
              Contact About {selectedProperty.title}
            </h2>
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
