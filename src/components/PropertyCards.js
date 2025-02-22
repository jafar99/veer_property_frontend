import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProperties } from "../services/propertyService";
import "./PropertyCards.css";

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

const PropertyCards = () => {
  const [activeTab, setActiveTab] = useState("Land");
  const [visibleCount, setVisibleCount] = useState(3);
  const [selectedSubtype, setSelectedSubtype] = useState("");
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
    if (activeTab && subtypeOptions[activeTab]?.length > 0) {
      setSelectedSubtype(subtypeOptions[activeTab][0].value);
    } else {
      setSelectedSubtype("");
    }
  }, [activeTab, subtypeOptions]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setFilteredProperties([]); // Ensure no data is shown initially

        const response = await getProperties();
        const properties = response?.data?.properties || [];

        let filtered = properties;

        // Ensure filtering starts only when both activeTab and selectedSubtype are set
        if (activeTab && selectedSubtype) {
          filtered = filtered.filter(
            (property) =>
              property.type.toLowerCase() === activeTab.toLowerCase() &&
              property.subtype.toLowerCase() === selectedSubtype.toLowerCase()
          );
        } else {
          filtered = [];
        }

        setFilteredProperties(filtered);
      } catch (error) {
        console.error("Failed to fetch properties:", error);
        setFilteredProperties([]);
      } finally {
        setLoading(false);
      }
    };

    // Run filtering only when both are set
    if (activeTab && selectedSubtype) {
      fetchProperties();
    }
  }, [activeTab, selectedSubtype]);

  const loadMore = () => {
    navigate(`/properties/${activeTab}/${selectedSubtype}`);
  };

  const viewDetails = (propertyId) => {
    navigate(`/property/${propertyId}`);
  };

  const handleContactClick = (property) => {
    console.log("Clicked Contact for:", property); // Debugging
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
        <div className="property-cards-tabs">
          {Object.keys(subtypeOptions).map((type) => (
            <button
              key={type}
              className={`property-cards-tab-button ${
                activeTab === type ? "active" : ""
              }`}
              onClick={() => setActiveTab(type)}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="property-cards-subtype-filter">
          <select
            value={selectedSubtype}
            onChange={(e) => setSelectedSubtype(e.target.value)}
            className="property-cards-dropdown"
          >
            {subtypeOptions[activeTab]?.map((subtype) => (
              <option key={subtype.value} value={subtype.value}>
                {subtype.label}
              </option>
            ))}
          </select>
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
                      loading="lazy"
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
                  Connect on WhatsApp
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
        {showContactForm && selectedProperty && (
          <div className="property-cardss-contact-form-overlay">
            <div className="property-cardss-contact-form">
              <h2 className="property-cardss-contact-title">
                Contact About {selectedProperty.title}
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
