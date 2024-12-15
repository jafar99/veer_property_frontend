import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProperties } from "../services/propertyService";
import "./PropertyList.css";

const PropertyList = () => {
  const { type } = useParams(); // Capture the `type` parameter from the URL
  const [properties, setProperties] = useState([]);
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
        const filtered = response.data.filter(
          (property) => property.type.toLowerCase() === type.toLowerCase()
        );
        setProperties(filtered);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [type]);

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
    const whatsappURL = `https://wa.me/${process.env.REACT_APP_MOBILE_NO}?text=${encodeURIComponent(fullMessage)}`;
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
      {loading ? (
        <p>Loading...</p>
      ) : properties.length > 0 ? (
        <div className="property-grid">
          {properties.map((property) => (
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
                onClick={() => navigate(`/property/${property._id}`)}
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
      ) : (
        <p>No properties available for {type}.</p>
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
