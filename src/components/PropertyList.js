import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProperties } from "../services/propertyService";
import "./PropertyList.css";

const PropertyList = () => {
  const { type } = useParams(); // Capture the `type` parameter from the URL
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
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
        const properties = response?.data?.properties || []; // Access the properties array
        const filtered = properties.filter(
          (property) => property.type.toLowerCase() === type.toLowerCase()
        );
        setProperties(filtered); // Update state with filtered properties
        setFilteredProperties(filtered); // Initialize filtered properties
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [type]);

  // Handle search query change
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase(); // Convert to lowercase for case-insensitive search
    setSearchQuery(query);

    // Filter properties based on location
    const filtered = properties.filter(
      (property) =>
        property.location.toLowerCase().includes(query) ||
        property.localAddress.toLowerCase().includes(query)
    );
    setFilteredProperties(filtered);
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
    const whatsappURL = `https://wa.me/${
      process.env.REACT_APP_MOBILE_NO
    }?text=${encodeURIComponent(fullMessage)}`;
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
    <div className="property-container">
      <div className="property-type">
        {type.charAt(0).toUpperCase() + type.slice(1)} Properties
      </div>

      {/* Search Box */}
      <div className="search-box">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search by location..."
          className="search-input"
        />
      </div>

      {filteredProperties.length === 0 && (
        <div className="no-results">No Properties found</div>
      )}

      {loading ? (
        <div className="loading"></div>
      ) : (
        <div className="property-grid">
          {filteredProperties.map((property) => (
            <div key={property?._id} className="property-card">
              <div className="property-images">
                {property?.images?.map((image, index) => (
                  <img
                    key={index}
                    src={image?.url}
                    alt={property?.title || "Property Image"}
                    className="property-image"
                  />
                ))}
              </div>
              <h3>{property?.title || "N/A"}</h3>
              <p>Type: {property?.type || "N/A"}</p>
              <p>Price: ₹{property?.price?.toLocaleString() || "N/A"}</p>

              <p>Status: {property?.status || "N/A"}</p>
              <p>Area Size: {property?.area || "N/A"}</p>
              <p>Location: {property?.location || "N/A"}</p>
              <p>{property?.localAddress || "N/A"}</p>
              <button
                className="view-button"
                onClick={() => navigate(`/property/${property?._id}`)}
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
              <button onClick={handleSendToWhatsApp}>Send to WhatsApp</button>
              <button onClick={() => setShowContactForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyList;
