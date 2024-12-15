import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPropertyById } from "../services/propertyService"; // API call function
import "./PropertyDetails.css";

const PropertyDetails = () => {
  const { id } = useParams(); // Extract ID from URL
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactDetails, setContactDetails] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        setLoading(true);
        const response = await getPropertyById(id);
        console.log("Property Details:", response); // Log the full response
        setProperty(response); // Set the property directly
      } catch (error) {
        console.error("Error fetching property details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [id]);

  // Handle WhatsApp message
  const handleSendToWhatsApp = () => {
    const { name, email, phone, message } = contactDetails;
    const propertyDetails = `Property Name: ${property.title}\nPrice: $${property.price}\nLocation: ${property.location}`;
    const userDetails = `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`;
    const fullMessage = `Hello, I'm interested in the following property:\n\n${propertyDetails}\n\nMy Details:\n${userDetails}`;

    // Send message to WhatsApp Web
    const whatsappURL = `https://wa.me/${process.env.REACT_APP_MOBILE_NO}?text=${encodeURIComponent(fullMessage)}`;
    window.open(whatsappURL, "_blank");

    setShowContactForm(false); // Close the form
  };

  // Handle contact form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  if (loading) return <p>Loading...</p>;
  if (!property) return <p>Property not found.</p>;

  // Split amenities string into an array and ensure proper handling
  const amenities = property.amenities?.[0]?.split(",").map((amenity) => amenity.trim()) || [];

  return (
    <div className="property-details-container-detail">
      <div className="property-details-container">
        {/* Title */}
        <h2>{property.title || "No Title Available"}</h2>

        {/* Property Images */}
        <div className="property-details-images">
          {property.images && property.images.length > 0 ? (
            property.images.map((image, index) => (
              <img
                key={index}
                src={`http://localhost:5001${image}`}
                alt={`Image ${index + 1} of ${property.title}`}
                className="details-image"
              />
            ))
          ) : (
            <p>No images available.</p>
          )}
        </div>

        {/* Property Information */}
        <div className="property-info">
          <div className="details-section">
            <h3>Property Details</h3>
            <p>📍 <strong>Location:</strong> {property.location || "Not available"}</p>
            <p>💰 <strong>Price:</strong> ${property.price?.toLocaleString() || "N/A"}</p>
            <p>🏠 <strong>Type:</strong> {property.type || "N/A"}</p>
            <p>📝 <strong>Status:</strong> {property.status || "Not specified"}</p>
          </div>

          {/* Amenities Section */}
          <div className="features-section">
            <h3>Features & Amenities</h3>
            {amenities.length > 0 ? (
              <ul>
                {amenities.map((amenity, index) => (
                  <li key={index}>{amenity}</li>
                ))}
              </ul>
            ) : (
              <p>No amenities listed.</p>
            )}
          </div>
        </div>

        {/* Description Section */}
        <div className="description-section">
          <h3>Description</h3>
          <p>{property.description || "No description provided."}</p>
        </div>

        {/* Contact Button */}
        <div className="contact-button-btn">
        <button
          className="contact-button-btn1"
          onClick={() => setShowContactForm(true)}
        >
          Contact About Property
        </button>
        </div>

        {/* Contact Form Overlay */}
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
    </div>
  );
};

export default PropertyDetails;
