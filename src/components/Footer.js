import React from "react";
import "./Footer.css";
import { FaFacebookF, FaTwitter, FaInstagram, FaEnvelope, FaPhone } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* About Section */}
        <div className="footer-section">
          <h2>RealEstate</h2>
          <p>Your trusted partner in finding the perfect property.</p>
          <div className="social-icons">
            <a href="#" className="social-icon">
              <FaFacebookF />
            </a>
            <a href="#" className="social-icon">
              <FaTwitter />
            </a>
            <a href="#" className="social-icon">
              <FaInstagram />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li>Home</li>
            <li>Properties</li>
            <li>Contact</li>
          </ul>
        </div>

        {/* Contact Section */}
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>
            <FaEnvelope /> info@realestate.com
          </p>
          <p>
            <FaPhone /> (123) 456-7890
          </p>
        </div>

        {/* Map Section */}
        <div className="footer-section">
          <h3>Our Office</h3>
          <div className="map-container">
            <iframe
              title="Office Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d867.4685909164343!2d74.60655816954613!3d18.17763117310399!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc39f0012088953%3A0x47d72721901cf74a!2sVeer%20Properties!5e1!3m2!1sen!2sin!4v1734614775265!5m2!1sen!2sin"
              width="100%"
              height="150"
              style={{ border: "0", borderRadius: "8px" }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
      {/* Footer Bottom */}
      <div className="footer-bottom">
        <p>&copy; 2024 RealEstate. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
