import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProperties } from "../services/propertyService";
import "./PropertyCards.css";
import "./PropertyList.css";

const PropertyList = () => {
  const { type, subtype } = useParams();
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
  const [currentImageIndexes, setCurrentImageIndexes] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await getProperties();
        const properties = response?.data?.properties || [];

        let filtered = properties.filter(
          (property) => property.type.toLowerCase() === type.toLowerCase()
        );

        if (subtype) {
          filtered = filtered.filter(
            (property) =>
              property.subtype?.toLowerCase() === subtype.toLowerCase()
          );
        }

        setFilteredProperties(filtered);
      } catch (error) {
        console.error("Failed to fetch properties:", error);
        setFilteredProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [type, subtype]);

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
    const propertyDetails = `Property Name: ${selectedProperty.title}\nPrice: ₹${selectedProperty.price}\nLocation: ${selectedProperty.location}`;
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
        {subtype && `${subtype.charAt(0).toUpperCase() + subtype.slice(1)}`}{" "}
        {type.charAt(0).toUpperCase() + type.slice(1)} Properties{" "}
      </div>

      {loading ? (
        <div className="loader-container">
          <div className="spinner"></div>
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="property-cardss-no-results">
          <p>No properties found.</p>
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
                Price: ₹{property?.price?.toLocaleString() || "N/A"}
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
            <div className="property-cardss-contact-form-buttons">
              <button
                className="property-cardss-whatsapp-button"
                onClick={handleSendToWhatsApp}
              >
                Send to WhatsApp
              </button>
              <button
                className="property-cardss-cancel-button"
                onClick={() => setShowContactForm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyList;
