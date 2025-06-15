import React, { useEffect, useState, useRef } from "react";
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
  const [showImageDetail, setShowImageDetail] = useState(false);
  const [detailImageIndex, setDetailImageIndex] = useState(0);
  
  // Zoom functionality state
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showZoomHint, setShowZoomHint] = useState(false);
  const imageRef = useRef(null);

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

  // Keyboard event handling for zoom controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!showImageDetail) return;
      
      switch (e.key) {
        case 'Escape':
          handleCloseImageDetail();
          break;
        case '+':
        case '=':
          e.preventDefault();
          handleZoomIn();
          break;
        case '-':
          e.preventDefault();
          handleZoomOut();
          break;
        case '0':
          e.preventDefault();
          handleResetZoom();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (property.images && property.images.length > 1) {
            handleDetailPrevImage();
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (property.images && property.images.length > 1) {
            handleDetailNextImage();
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showImageDetail, property?.images]);

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

  // Add functions for image detail view
  const handleImageClick = (index) => {
    console.log('Opening image detail modal with zoom controls');
    setDetailImageIndex(index);
    setShowImageDetail(true);
    // Reset zoom and pan when opening new image
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
    // Show zoom hint
    setShowZoomHint(true);
    setTimeout(() => setShowZoomHint(false), 3000);
  };

  const handleCloseImageDetail = () => {
    setShowImageDetail(false);
    // Reset zoom and pan when closing
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  };

  const handleDetailPrevImage = () => {
    setDetailImageIndex(prev => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
    // Reset zoom and pan when changing images
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  };

  const handleDetailNextImage = () => {
    setDetailImageIndex(prev => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
    // Reset zoom and pan when changing images
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  };

  // Zoom functionality functions
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 4));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.15 : 0.15;
    setZoomLevel(prev => Math.max(0.5, Math.min(4, prev + delta)));
  };

  // Double click to reset zoom
  const handleImageDoubleClick = () => {
    handleResetZoom();
  };

  const handleMouseDown = (e) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - panPosition.x,
        y: e.clientY - panPosition.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && zoomLevel > 1) {
      setPanPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    if (zoomLevel > 1 && e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - panPosition.x,
        y: e.touches[0].clientY - panPosition.y
      });
    }
  };

  const handleTouchMove = (e) => {
    if (isDragging && zoomLevel > 1 && e.touches.length === 1) {
      e.preventDefault();
      setPanPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
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
                      onClick={() => handleImageClick(index)}
                      style={{ cursor: 'pointer' }}
                    />
                  ))
                ) : (
                  // Mobile View - Show carousel
                  <>
                    <img
                      src={property.images[currentImageIndex]?.url}
                      alt="Property"
                      className="gallery-image"
                      onClick={() => handleImageClick(currentImageIndex)}
                      style={{ cursor: 'pointer' }}
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

          {/* Image Detail Modal */}
          {showImageDetail && property.images && property.images.length > 0 && (
            <div className="image-detail-overlay" onClick={handleCloseImageDetail}>
              <div 
                className="image-detail-modal" 
                onClick={(e) => e.stopPropagation()}
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <button className="image-detail-close" onClick={handleCloseImageDetail}>
                  ×
                </button>
                
                {/* Zoom Controls */}
                <div className="zoom-controls">
                  <button className="zoom-btn" onClick={handleZoomIn} title="Zoom In">
                    +
                  </button>
                  <button className="zoom-btn" onClick={handleZoomOut} title="Zoom Out">
                    −
                  </button>
                  <button className="zoom-btn reset" onClick={handleResetZoom} title="Reset Zoom">
                    ↺
                  </button>
                </div>

                {/* Zoom Level Indicator */}
                <div className="zoom-level">
                  {Math.round(zoomLevel * 100)}%
                </div>

                {/* Zoom Hint */}
                {showZoomHint && (
                  <div className="zoom-hint">
                    <div className="zoom-hint-content">
                      <span>🔍 Use + / - buttons or scroll to zoom</span>
                      <span>🖱️ Drag to pan when zoomed in</span>
                      <span>🖱️ Double-click to reset</span>
                    </div>
                  </div>
                )}

                <img
                  ref={imageRef}
                  src={property.images[detailImageIndex]?.url}
                  alt={`Property ${detailImageIndex + 1}`}
                  className="image-detail-image"
                  style={{
                    transform: `scale(${zoomLevel}) translate(${panPosition.x / zoomLevel}px, ${panPosition.y / zoomLevel}px)`,
                    cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
                  }}
                  onDoubleClick={handleImageDoubleClick}
                />
                
                {property.images.length > 1 && (
                  <>
                    <button className="image-detail-nav prev" onClick={handleDetailPrevImage}>
                      ❮
                    </button>
                    <button className="image-detail-nav next" onClick={handleDetailNextImage}>
                      ❯
                    </button>
                    <div className="image-detail-counter">
                      {detailImageIndex + 1} / {property.images.length}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default PropertyDetails;
