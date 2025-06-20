/* eslint-disable react/jsx-no-target-blank */
import React from "react";
import "./Footer.css";
import { FaFacebookF, FaTwitter, FaInstagram, FaEnvelope, FaPhone, FaMapMarkerAlt, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        
        {/* About Section */}
        <div className="footer-section">
          <h2>Veer Properties</h2>
          <p>Your trusted partner in finding the perfect property.</p>
          <div className="social-icons">
            <a href="https://www.facebook.com/share/199gEw4xbr/" target="_blank" className="social-icon"><FaFacebookF /></a>
            <a href="https://www.instagram.com/veer.properties?igsh=MW1kazJydDNud2EzZQ==" target="_blank" className="social-icon"><FaInstagram /></a>
            <a href="https://youtube.com/@veerproperties-y3f?si=Md0_JoAiPGY77BeK" target="_blank" className="social-icon"><FaYoutube /></a>
            <a href="https://wa.me/8698011014" target="_blank" className="social-icon">
              <img src="https://img.icons8.com/color/48/000000/whatsapp.png" alt="WhatsApp" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul className="quick-links-column">
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/faq">FAQ</a></li>
            <li><a href="/reviews">Reviews</a></li>
            <li><a href="/contact/get-in-touch">Contact</a></li>
          </ul>
        </div>

        {/* Contact Section */}
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p><FaEnvelope /> veerproparties101@gmail.com</p>
          <h4>Office Numbers:</h4>
          <p><FaPhone /> 8698011014 / 8263820936</p>
          <h4>Owner Numbers:</h4>
          <p><FaPhone /> Mr. Siddharth  Chavan: <a href="tel:8263820936">8263820936</a></p>
          <p><FaPhone /> Mr. Manoj  Jagtap: <a href="tel:9890111059">9890111059</a></p>
          <p>
            <FaMapMarkerAlt /> 1st Floor, Shop No. 3, Vidya Tower, Near Chandukaka Saraf,  
            Maharashtra Industrial Development Corporation Area,  
            Baramati, Maharashtra 413102
          </p>
        </div>

        {/* Map Section (Takes 1/3 of width) */}
        <div className="footer-map">
          <h3>Our Office</h3>
          <iframe
            title="Office Location"
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7581.3889820342365!2d74.6069683!3d18.1779823!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc39f0041d851e7%3A0xc647169a50f79455!2sVeer%20Properties!5e0!3m2!1sen!2sin!4v1749978264959!5m2!1sen!2sin"
            width="100%"
            height="180"
            style={{ border: "0", borderRadius: "8px" }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>

      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
      <p>&copy; {new Date().getFullYear()} Veer Properties. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
