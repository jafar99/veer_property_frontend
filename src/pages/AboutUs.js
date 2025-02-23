import React from "react";
import "./AboutUs.css";
import founderImage from "../image/four.jpg"; // Add your founder's image

const AboutUs = () => {
  return (
    <div className="about-container">
     

      {/* About Company Section */}
      <section className="company-info">
        <h2>Who We Are</h2>
        <p>
          Established in 2015, <strong>Veer Properties</strong> is a leader in real estate development, 
          specializing in high-quality residential and commercial properties. With a ₹100 crore turnover 
          and a team of 285 professionals, we continue to redefine modern living.
        </p>
      </section>

      {/* Founder Section */}
      <section className="founder-section">
        <img src={founderImage} alt="Founder Mr. Siddharth Chandrakant Chavan" className="founder-image" />
        <div className="founder-info">
          <h2>Meet Our Founder</h2>
          <h3>Mr. Siddharth Chandrakant Chavan</h3>
          <p>
            A visionary leader in real estate, Mr. Chavan built Veer Properties on trust, transparency, 
            and innovation. His customer-first approach ensures seamless property experiences for every client.
          </p>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-choose">
        <h2>Why Choose Veer Properties?</h2>
        <div className="features-grid">
          <div className="feature-card">🏡 Verified Properties</div>
          <div className="feature-card">🔍 Transparent Deals</div>
          <div className="feature-card">📊 Market Expertise</div>
          <div className="feature-card">🚀 Hassle-Free Process</div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-us">
        <h2>Looking for your perfect property?</h2>
        <p>Let’s find your dream space today! 🚀</p>
      </section>
    </div>
  );
};

export default AboutUs;
