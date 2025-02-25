import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getProperties } from "../services/propertyService";
import "./SearchPropertyList.css";

const SearchPropertyList = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

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
  const type = queryParams.get("type");
  const subtype = queryParams.get("subtype");
  const searchLocation = queryParams.get("location");
  const localAddress = queryParams.get("localAddress");

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await getProperties();
        console.log("API Response:", response);

        // Ensure we access the correct property data
        const properties = response?.data?.properties || [];

        let filtered = properties.filter(
          (property) =>
            (!type || property?.type?.toLowerCase() === type.toLowerCase()) &&
            (!subtype ||
              property?.subtype?.toLowerCase() === subtype.toLowerCase()) &&
            (!searchLocation ||
              property?.location
                ?.toLowerCase()
                .includes(searchLocation.toLowerCase())) &&
            (!localAddress ||
              property?.localAddress
                ?.toLowerCase()
                .includes(localAddress.toLowerCase()))
        );

        setFilteredProperties(filtered);
      } catch (error) {
        console.error("Failed to fetch properties:", error);
        setFilteredProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [type, subtype, searchLocation, localAddress]);

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
    <div className="search-container">
      <h2 className="search-title">Search Results</h2>
      {loading ? (
        <div className="search-loader">
          <div className="search-spinner"></div>
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="search-no-results">
          <p>No properties found.</p>
        </div>
      ) : (
        <div className="search-grid">
          {filteredProperties.map((property) => (
            <div key={property?._id} className="search-card">
              <div className="search-images">
                {property?.images?.map((image, index) => (
                  <img
                    key={index}
                    src={image?.url}
                    alt={property?.title || "Property Image"}
                    className="search-image"
                    loading="lazy"
                  />
                ))}
              </div>

              <h3 className="search-property-title">
                {property?.title || "N/A"}
              </h3>
              <p className="search-property-price">
                Price: ₹{property?.price?.toLocaleString() || "N/A"}
              </p>
              <p className="search-property-type">
                Type: {property?.type || "N/A"}
              </p>
              <p className="search-property-subtype">
                Subtype: {property?.subtype || "N/A"}
              </p>
              <p
                className={`search-property-status ${
                  property?.status?.toLowerCase() === "available" 
                  ? "search-property-status-available"
                  : property?.status?.toLowerCase() === "upcoming"
                  ? "search-property-status-upcoming"
                  : "search-property-status-unavailable"
                }`}
              >
                Status: {property?.status || "N/A"}
              </p>
              <p className="search-property-area">
                Area Size: {property?.area || "N/A"}
              </p>
              <p className="search-property-location">
                Location: {property?.location || "N/A"}
              </p>
              <p className="search-property-address">
                {property?.localAddress || "N/A"}
              </p>
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
                Connect on whatsapp
              </button>
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
