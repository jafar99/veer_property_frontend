import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h2>RealEstate</h2>
          <p>Find your perfect property with us.</p>
        </div>
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li>Home</li>
            <li>Properties</li>
            <li>Contact</li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>Email: info@realestate.com</p>
          <p>Phone: (123) 456-7890</p>
        </div>
        <div className="footer-section">
          <h3>Our Office</h3>
          <div className="map-container">
            <iframe
              title="Office Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d867.4685909164343!2d74.60655816954613!3d18.17763117310399!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc39f0012088953%3A0x47d72721901cf74a!2sVeer%20Properties!5e1!3m2!1sen!2sin!4v1734614775265!5m2!1sen!2sin"

              width="90%"
              height="200"
              style={{ border: "0", borderRadius: "8px" }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>


          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 RealEstate. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
