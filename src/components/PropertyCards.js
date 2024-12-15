import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProperties } from "../services/propertyService";
import "./PropertyCards.css";

const PropertyCards = () => {
  const [activeTab, setActiveTab] = useState("sale");
  const [visibleCount, setVisibleCount] = useState(3);
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

  const navigate = useNavigate();

  // Fetch properties from API
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await getProperties();
        const properties = response?.data || [];
        setFilteredProperties(
          properties.filter((property) => property.type.toLowerCase() === activeTab)
        );
      } catch (error) {
        console.error("Failed to fetch properties:", error);
        setFilteredProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [activeTab]);

  const loadMore = () => {
    navigate(`/properties/${activeTab}`);
  };

  const viewDetails = (propertyId) => {
    navigate(`/property/${propertyId}`);
  };

  const handleContactClick = (property) => {
    setSelectedProperty(property);
    setShowContactForm(true);
  };

  const handleSendToWhatsApp = () => {
    const { name, email, phone, message } = contactDetails;
    const propertyDetails = `Property Name: ${selectedProperty.title}\nPrice: $${selectedProperty.price}\nLocation: ${selectedProperty.location}`;
    const userDetails = `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`;
    const fullMessage = `Hello, I'm interested in the following property:\n\n${propertyDetails}\n\nMy Details:\n${userDetails}`;

    // Send message to WhatsApp Web
    const whatsappURL = `https://wa.me/7057048846?text=${encodeURIComponent(fullMessage)}`;
    window.open(whatsappURL, "_blank");

    setShowContactForm(false); // Close the form
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  return (
    <div className="property-section">
      <div className="tabs">
        <button
          className={`tab-button ${activeTab === "sale" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("sale");
            setVisibleCount(3);
          }}
        >
          Sale
        </button>
        <button
          className={`tab-button ${activeTab === "rent" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("rent");
            setVisibleCount(3);
          }}
        >
          Rent
        </button>
        <button
          className={`tab-button ${activeTab === "land" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("land");
            setVisibleCount(3);
          }}
        >
          Land
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="property-grid">
          {filteredProperties.slice(0, visibleCount).map((property) => (
            <div key={property._id} className="property-card">
              <div className="property-images">
                {property.images.map((image, index) => (
                  <img
                    key={index}
                    src={`http://localhost:5001${image}`}
                    alt={property.title}
                    className="property-image"
                  />
                ))}
              </div>
              <h3>{property.title}</h3>
              <p>Type: {property.type}</p>
              <p>Price: ${property.price}</p>
              <p>Location: {property.location}</p>
              <button
                className="view-button"
                onClick={() => viewDetails(property._id)}
              >
                View Details
              </button>
              <button
                className="contact-button"
                onClick={() => handleContactClick(property)}
              >
                Contact
              </button>
            </div>
          ))}
        </div>
      )}

      {filteredProperties.length > visibleCount && (
        <div className="show-more-container">
          <button onClick={loadMore} className="show-more-button">
            Show More
          </button>
        </div>
      )}

      {showContactForm && (
        <div className="contact-form-overlay">
          <div className="contact-form">
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
            <div className="contact-form-buttons">
              <button onClick={handleSendToWhatsApp}>Send to WhatsApp</button>
              <button onClick={() => setShowContactForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyCards;
