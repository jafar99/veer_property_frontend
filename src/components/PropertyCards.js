import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProperties } from "../services/propertyService";
import "./PropertyCards.css";

const PropertyCards = () => {
  const [activeTab, setActiveTab] = useState("residential");
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

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await getProperties();
        const properties = response?.data?.properties || [];
        setFilteredProperties(
          properties.filter(
            (property) =>
              property.type.toLowerCase() === activeTab.toLowerCase()
          )
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

  return (
    <>
      <div className="property-cardss-section">
        <div className="property-cardss-tabs">
          <button
            className={`property-cardss-tab-button ${
              activeTab === "residential" ? "property-cardss-active-tab" : ""
            }`}
            onClick={() => {
              setActiveTab("residential");
              setVisibleCount(3);
            }}
          >
            Residential
          </button>
          <button
            className={`property-cardss-tab-button ${
              activeTab === "rent" ? "property-cardss-active-tab" : ""
            }`}
            onClick={() => {
              setActiveTab("rent");
              setVisibleCount(3);
            }}
          >
            Rent
          </button>
          <button
            className={`property-cardss-tab-button ${
              activeTab === "land" ? "property-cardss-active-tab" : ""
            }`}
            onClick={() => {
              setActiveTab("land");
              setVisibleCount(3);
            }}
          >
            Land
          </button>
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
            {filteredProperties.slice(0, visibleCount).map((property) => (
              <div key={property?._id} className="property-cardss-card">
                <div className="property-cardss-images">
                  {property?.images?.map((image, index) => (
                    <img
                      key={index}
                      src={image?.url}
                      alt={property?.title || "Property Image"}
                      className="property-cardss-image"
                    />
                  ))}
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
                <p
                  className={`property-cardss-status ${
                    property?.status?.toLowerCase() === "available"
                      ? "property-cardss-status-available"
                      : "property-cardss-status-unavailable"
                  }`}
                >
                  Status: {property?.status || "N/A"}
                </p>

                <p className="property-cardss-area">
                  Area Size: {property?.area || "N/A"}
                </p>
                <p className="property-cardss-location">
                  Location: {property?.location || "N/A"}
                </p>
                <p className="property-cardss-address">
                  {property?.localAddress || "N/A"}
                </p>
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
                  Contact
                </button>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredProperties.length > visibleCount && (
          <div className="property-cardss-show-more-container">
            <button
              onClick={loadMore}
              className="property-cardss-show-more-button"
            >
              Show More
            </button>
          </div>
        )}

        {showContactForm && (
          <div className="property-cardss-contact-form-overlay">
            <div className="property-cardss-contact-form">
              <h2 className="property-cardss-contact-title">
                Contact About Property
              </h2>
              <label className="property-cardss-label">
                Name:
                <input
                  type="text"
                  name="name"
                  value={contactDetails.name}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                  required
                  className="property-cardss-input"
                />
              </label>
              <label className="property-cardss-label">
                Email:
                <input
                  type="email"
                  name="email"
                  value={contactDetails.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                  className="property-cardss-input"
                />
              </label>
              <label className="property-cardss-label">
                Phone:
                <input
                  type="tel"
                  name="phone"
                  value={contactDetails.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  required
                  className="property-cardss-input"
                />
              </label>
              <label className="property-cardss-label">
                Message:
                <textarea
                  name="message"
                  value={contactDetails.message}
                  onChange={handleInputChange}
                  placeholder="Enter your message"
                  rows="4"
                  className="property-cardss-textarea"
                />
              </label>
              <div className="property-cardss-contact-buttons">
                <button
                  onClick={handleSendToWhatsApp}
                  className="property-cardss-send-button"
                >
                  Send to WhatsApp
                </button>
                <button
                  onClick={() => setShowContactForm(false)}
                  className="property-cardss-cancel-button"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PropertyCards;
