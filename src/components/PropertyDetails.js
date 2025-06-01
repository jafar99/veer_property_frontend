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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

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

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const handlePrevImage = () => {
    setCurrentImageIndex(prev => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex(prev => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  // Add capitalizeFirstLetter function
  const capitalizeFirstLetter = (string) => {
    if (!string) return "NA";
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  if (loading) return <p>Loading...</p>;
  if (!property) return <p>Property not found.</p>;

  // Modify the amenities and features split logic
  const amenities = property?.amenities
    ? typeof property.amenities === "string"
      ? property.amenities.split("\r\n").filter(Boolean) // Split by new lines instead of commas
      : Array.isArray(property.amenities)
      ? property.amenities
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
      {loading ? (
        <div className="loader-container">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="property-container">
          {/* Property Title */}
          <div className="property-titlee">
            {property.title || "Property Details"}
          </div>

          {/* Image Gallery */}
          <div className="property-gallery">
            {property.images && property.images.length > 0 ? (
              <>
                {!isMobile ? (
                  // Desktop View - Show all images
                  property.images.map((image, index) => (
                    <img
                      key={index}
                      src={image?.url}
                      alt={`Property ${index + 1}`}
                      className="gallery-image"
                    />
                  ))
                ) : (
                  // Mobile View - Show carousel
                  <>
                    <img
                      src={property.images[currentImageIndex]?.url}
                      alt="Property"
                      className="gallery-image"
                    />
                    {property.images.length > 1 && (
                      <>
                        <div className="gallery-nav prev" onClick={handlePrevImage}>
                          ❮
                        </div>
                        <div className="gallery-nav next" onClick={handleNextImage}>
                          ❯
                        </div>
                        <div className="gallery-dots">
                          {property.images.map((_, index) => (
                            <span
                              key={index}
                              className={`gallery-dot ${currentImageIndex === index ? 'active' : ''}`}
                              onClick={() => setCurrentImageIndex(index)}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                )}
              </>
            ) : (
              <p className="no-images">No images available.</p>
            )}
          </div>

          {/* Property Details Section - Updated layout */}
          <div className="property-info">
            <div className="info-item">
              <strong>Price:</strong> {property.price || "NA"}
            </div>
            <div className="info-item">
              <strong>Location:</strong> {property.location || "NA"}
            </div>
            <div className="info-item full-width">
              <strong>Local Address:</strong> {property.localAddress || "NA"}
            </div>
            <div className="info-item">
              <strong>Type:</strong> {property.type || "NA"}
            </div>
            <div className="info-item">
              <strong>Subtype:</strong> {capitalizeFirstLetter(property.subtype)}
            </div>
            <div className="info-item">
              <strong>Area:</strong> {property.area || "NA"}
            </div>
            <div className="info-item">
              <strong>Property Facing:</strong> {property.propertyFacing || "NA"}
            </div>
            <div className="info-item">
              <strong>Property Age:</strong> {property.propertyAge || "NA"}
            </div>
            <div className={`info-item ${
              property?.status?.toLowerCase() === "available"
                ? "status-available"
                : property?.status?.toLowerCase() === "upcoming"
                ? "status-upcoming"
                : "status-unavailable"
            }`}>
              <strong>Status:</strong> {property.status || "NA"}
            </div>

            <div className={`info-item ${
              property?.rera?.toLowerCase() === "rera"
                ? "status-available"
                : property?.status?.toLowerCase() === "non rera"
                ? "status-upcoming"
                : "status-unavailable"  
            }`}>
              <strong>Rera property:</strong> {property.rera || "NA"}
            </div>

            

            <div className="info-item">
              <strong>Available For:</strong> {property.availableFor || "NA"}
            </div>
          </div>

          {/* Property Info Section - New section */}
          {property.propertyInfo && (
            <div className="property-section">
              <h2>Property Information</h2>
              <div className="property-info-content">
                {property.propertyInfo.split("\r\n").map((info, index) => (
                  <p key={index}>{info}</p>
                ))}
              </div>
            </div>
          )}

          {/* Amenities Section - Updated to handle new line breaks */}
          <div className="property-section">
            <h2>Amenities</h2>
            {amenities.length > 0 ? (
              <div className="amenities-grid">
                {amenities.map((item, index) => (
                  <div key={index} className="amenity-item">
                    {item.trim()}
                  </div>
                ))}
              </div>
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
                View More Images
              </button>
            )}
            {property.googleDriveVideo && (
              <button
                className="google-drive-btn"
                onClick={() => window.open(property.googleDriveVideo, "_blank")}
              >
                View More Video
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
            <div className="property-cardss-contact-form-overlay">
              <div className="property-cardss-contact-form">
                <h2 className="property-cardss-contact-title">
                  Contact About {property.title}
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
                  <button className="property-cardss-send-button" onClick={handleSendToWhatsApp}>
                    Send to WhatsApp
                  </button>
                  <button className="property-cardss-cancel-button" onClick={() => setShowContactForm(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default PropertyDetails;
