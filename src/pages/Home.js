import React, { useState, useEffect } from "react";
import PropertyCards from "../components/PropertyCards";
import { getProperties } from "../services/propertyService";
import "./Home.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [properties, setProperties] = useState([]); // Store all properties
  const [searchQuery, setSearchQuery] = useState(""); // Input value
  const [filteredProperties, setFilteredProperties] = useState([]); // Search results
  const [showModal, setShowModal] = useState(false); // Toggle modal visibility
  const [showContactForm, setShowContactForm] = useState(false); // Contact form state
  const [selectedProperty, setSelectedProperty] = useState(null); // Selected property for contact
  const [contactDetails, setContactDetails] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  // Fetch properties from the API
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await getProperties();
        const properties = response?.data || [];
        setProperties(properties);
      } catch (error) {
        console.error("Failed to fetch properties:", error);
      }
    };

    fetchProperties();
  }, []);

  const navigate = useNavigate();

  // Handle search query change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter properties based on search query
  const handleSearch = () => {
    const results = properties.filter((property) =>
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase())
      || property.price.toString().includes(searchQuery)
      || property.type.toLowerCase().includes(searchQuery.toLowerCase())
      || property.description.toLowerCase().includes(searchQuery.toLowerCase())
      // || property..toString().includes(searchQuery)
    );
    setFilteredProperties(results);
    setShowModal(true); // Open modal after search
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
  };

  // Handle contact form visibility
  const handleContactClick = (property) => {
    setSelectedProperty(property);
    setShowContactForm(true);
  };

  // Send message to WhatsApp
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

  // Handle contact form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const viewDetails = (propertyId) => {
    navigate(`/property/${propertyId}`);
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="hero-section">
        <h1>Find Your Dream Property</h1>
        <p>Discover the perfect place to call home</p>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search properties..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
      </div>

      {/* Property Cards */}
      <PropertyCards properties={properties} />

      {/* Modal UI for Search Results */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeModal}>
              &times;
            </button>
            <h2>Search Results</h2>
            {filteredProperties.length > 0 ? (
              <div className="property-grid">
                {filteredProperties.map((property) => (
                  <div key={property._id} className="property-card">
                    <div className="property-images">
                    <img src={`http://localhost:5001${property.images[0]}`} alt={property.title} />

                    </div>
                    
                    <h3>{property.title}</h3>
                    {/* {`http://localhost:5001${image}`} */}

                    <p>Location: {property.location}</p>
                    <p>Price: ${property.price.toLocaleString()}</p>
                    <button
                className="view-button"
                onClick={() => viewDetails(property._id)}
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
              <p>No properties found.</p>
            )}
          </div>
        </div>
      )}

      {/* Contact Form */}
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

export default Home;
