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

  // Split amenities and features into arrays for display
  const amenities = property.amenities?.split(",") || [];
  const features = property.features?.split(",") || [];

  return (
    <div className="property-details-container">
      <h1 className="property-title">{property.title || "No Title Available"}</h1>

      {/* Images Section */}
      <div className="property-imagess">
        {property.images && property.images.length > 0 ? (
          property.images.map((image, index) => (
            <img
              key={index}
              src={`http://localhost:5001${image}`}
              alt={`Image ${index + 1}`}
              className="property-image"
            />
          ))
        ) : (
          <p>No images available.</p>
        )}
      </div>

      {/* Property Details Section */}
      <div className="property-details">
       
        <div className="detail-item">
          <strong>Price:</strong> ₹{property.price?.toLocaleString()}
        </div>
        <div className="detail-item">
          <strong>Location:</strong> {property.location}
        </div>
        <div className="detail-item">
          <strong>Local Address:</strong> {property.localAddress}
        </div>
        <div className="detail-item">
          <strong>Type:</strong> {property.type}
        </div>
        <div className="detail-item">
          <strong>Status:</strong> {property.status}
        </div>
        <div className="detail-item">
          <strong>Available For:</strong> {property.availableFor}
        </div>
        <div className="detail-item">
          <strong>Area:</strong> {property.area} sqft
        </div>
      
        <div className="detail-item">
          <strong>Available From:</strong> {property.availableFrom}
        </div>
        
        <div className="detail-item">
          <strong>Property Age:</strong> {property.propertyAge} years
        </div>
        <div className="detail-item">
          <strong>Facing:</strong> {property.propertyFacing}
        </div>
        <div className="detail-item">
          <strong>Floor:</strong> {property.propertyFloor} of {property.propertyTotalFloor}
        </div>
        <div className="detail-item">
          <strong>Agreement:</strong> {property.agreement}
        </div>
        <div className="detail-itemss">
          <strong>Property Info:</strong>
          <ul>
            {property.propertyInfo?.split("\r\n").map((info, index) => (
              <li key={index}>{info}</li>
            ))}
          </ul>
        </div>
      </div>

      

      {/* Amenities Section */}
      <div className="property-amenities">
        <h2>Amenities</h2>
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

      {/* Features Section */}
      <div className="property-features">
        <h2>Features</h2>
        {features.length > 0 ? (
          <ul>
            {features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        ) : (
          <p>No features listed.</p>
        )}
      </div>

      {/* Description Section */}
      <div className="property-description">
        <h2>Description</h2>
        <p>{property.description || "No description provided."}</p>
      </div>

      {/* Contact Button */}
      <button
        className="contact-buttons"
        onClick={() => setShowContactForm(true)}
      >
        Contact About Property
      </button>

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
  );
};

export default PropertyDetails;
