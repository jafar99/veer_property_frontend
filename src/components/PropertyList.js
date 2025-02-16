import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProperties } from "../services/propertyService";
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

  return (
    <div className="property-list-container">
      <div className="property-heading">
        {subtype && `${subtype.charAt(0).toUpperCase() + subtype.slice(1)}`}{" "}
        {type.charAt(0).toUpperCase() + type.slice(1)} Properties{" "}
      </div>

      {loading ? (
        <div className="loader-container">
        <div className="spinner"></div>
      </div>
      ) : filteredProperties.length === 0 ? (
        <div className="no-properties-message">
          <p>No properties found.</p>
        </div>
      ) : (
        <div className="property-card-grid">
          {filteredProperties.map((property) => (
            <div key={property?._id} className="property-card">
              <div className="property-imagess">
                {property?.images?.map((image, index) => (
                  <img
                    key={index}
                    src={image?.url}
                    alt={property?.title || "Property Image"}
                    className="property-image"
                  />
                ))}
              </div>

              <h3 className="property-title">{property?.title || "N/A"}</h3>
              <p className="property-price">
                Price: ₹{property?.price?.toLocaleString() || "N/A"}
              </p>
              <p className="property-type">Type: {property?.type || "N/A"}</p>
              <p className="property-subtype">
                Subtype: {property?.subtype || "N/A"}
              </p>
              <p
                className={`property-status ${
                  property?.status === "Available" ? "available" : "sold"
                }`}
              >
                Status: {property?.status || "N/A"}
              </p>
              <p className="property-area">
                Area Size: {property?.area || "N/A"}
              </p>
              <p className="property-location">
                Location: {property?.location || "N/A"}
              </p>
              <p className="property-address">
                {property?.localAddress || "N/A"}
              </p>
              <button
                className="details-button"
                onClick={() => viewDetails(property?._id)}
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
              <button
                className="whatsapp-button"
                onClick={handleSendToWhatsApp}
              >
                Send to WhatsApp
              </button>
              <button
                className="cancel-button"
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
