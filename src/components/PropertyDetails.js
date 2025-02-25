import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPropertyById } from "../services/propertyService"; // API call function
import "./PropertyDetails.css";

const PropertyDetails = () => {
  const { id } = useParams();
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
        setProperty(response);
      } catch (error) {
        console.error("Error fetching property details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [id]);

  const handleSendToWhatsApp = () => {
    const { name, email, phone, message } = contactDetails;
    const propertyDetails = `Property Name: ${property.title}\nPrice: ₹${property.price}\nLocation: ${property.location}`;
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

  if (loading) return <p>Loading...</p>;
  if (!property) return <p>Property not found.</p>;

  // Split amenities and features into arrays for display
  const amenities = property?.amenities
    ? typeof property.amenities === "string"
      ? property.amenities.split(",") // If it's a string, split into an array
      : Array.isArray(property.amenities)
      ? property.amenities // If it's already an array, use it
      : []
    : [];

  const features = property.features
    ? typeof property.features === "string"
      ? property.features.split(",") // If it's a string, split into an array
      : Array.isArray(property.features)
      ? property.features // If it's already an array, use it
      : []
    : [];

  return (
    <>
      { loading ?  <div className="loader-container">
      <div className="spinner"></div>
    </div> : 
      <div className="property-container">
        {/* Property Title */}
        <div className="property-titlee">
          {property.title || "Property Details"}
        </div>

        {/* Image Gallery */}
        <div className="property-gallery">
          {property.images && property.images.length > 0 ? (
            property.images.map((image, index) => (
              <img
                key={index}
                src={image?.url}
                alt="Property"
                className="gallery-image"
              />
            ))
          ) : (
            <p className="no-images">No images available.</p>
          )}
        </div>

        {/* Property Details Section */}
        <div className="property-info">
          <div className="info-item">
            <strong>Price:</strong> ₹{property.price?.toLocaleString() || "NA"}
          </div>
          <div className="info-item">
            <strong>Location:</strong> {property.location || "NA"}
          </div>
          <div className="info-item">
            <strong>Local Address:</strong> {property.localAddress || "NA"}
          </div>
          <div className="info-item">
            <strong>Type:</strong> {property.type || "NA"}
          </div>
          {/* // subtype  */}
          <div className="info-item">
            <strong>Subtype:</strong> {property.subtype || "NA"}
          </div>
          <div
            className={`info-item ${
              property?.status?.toLowerCase() === "available"
                ? "status-available" 
                : property?.status?.toLowerCase() === "upcoming"
                ? "status-upcoming"
                : "status-unavailable"
            }`}
          >
            <strong>Status:</strong> {property.status || "NA"}
          </div>

          <div className="info-item">
            <strong>Available For:</strong> {property.availableFor || "NA"}
          </div>
          <div className="info-item">
            <strong>Area:</strong> {property.area || "NA"}
          </div>
          <div className="info-item">
            <strong>Facing:</strong> {property.propertyFacing || "NA"}
          </div>

          {property.type === "land" && (
            <>
              <div className="info-item">
                <strong>Property Age:</strong> {property.propertyAge || "NA"}
              </div>
              <div className="info-item">
                <strong>Property Floor:</strong>{" "}
                {property.propertyFloor || "NA"}
              </div>
              <div className="info-item">
                <strong>Total Floor:</strong>{" "}
                {property.propertyTotalFloor || "NA"}
              </div>
            </>
          )}
        </div>

        {/* Amenities Section */}
        <div className="property-section">
          <h2>Amenities</h2>
          {amenities.length > 0 ? (
            <ul className="property-list">
              {amenities.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          ) : (
            <p>No amenities listed.</p>
          )}
        </div>

        {/* Features Section (only for land) */}
        {property.type === "land" && (
          <div className="property-section">
            <h2>Features</h2>
            {features.length > 0 ? (
              <ul className="property-list">
                {features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            ) : (
              <p>No features listed.</p>
            )}
          </div>
        )}

        {/* Google Map Location */}
        {property.googleMapLink && (
          <div className="map-container">
            <h2>Map Location</h2>
            <div dangerouslySetInnerHTML={{ __html: property.googleMapLink }} />
          </div>
        )}
        <div className="button-container">
          {property.googleDriveImage && (
            <button
              className="google-drive-btn"
              onClick={() => window.open(property.googleDriveImage, "_blank")}
            >
              View Images
            </button>
          )}
          {property.googleDriveVideo && (
            <button
              className="google-drive-btn"
              onClick={() => window.open(property.googleDriveVideo, "_blank")}
            >
              View Video
            </button>
          )}
          <button
            className="contact-btn"
            onClick={() => setShowContactForm(true)}
          >
            Contact on WhatsApp
          </button>
        </div>

        {/* Contact Form */}
        {showContactForm && (
          <div className="contact-form-overlay">
            <div className="contact-form">
              <h2>Contact Us {property.title}</h2>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={contactDetails.name}
                onChange={handleInputChange}
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={contactDetails.email}
                onChange={handleInputChange}
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                value={contactDetails.phone}
                onChange={handleInputChange}
              />
              <textarea
                name="message"
                placeholder="Message"
                value={contactDetails.message}
                onChange={handleInputChange}
                rows="4"
              ></textarea>
              <div className="modal-buttons">
                <button onClick={handleSendToWhatsApp}  className="whatsapp-btn">Send to WhatsApp</button>
                <button onClick={() => setShowContactForm(false)} className="close-btn">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
       }
    </>
  );
};

export default PropertyDetails;
