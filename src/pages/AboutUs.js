import React from "react";
import "./AboutUs.css";

const AboutUs = () => {
  return (
    <div className="about-container">
      <section className="about-banner">
        <h1>About Us</h1>
        <p>Your trusted partner in finding the perfect property.</p>
      </section>

      <section className="about-content">
        <div className="about-info">
          <h2>Who We Are</h2>
          <p>
            At RealEstate, we are passionate about connecting people with their dream properties. With years of experience in the real estate industry, we have built a reputation for reliability and excellence. Whether you're looking to buy, sell, or rent, we are here to guide you every step of the way.
          </p>
        </div>

        <div className="about-mission">
          <h2>Our Mission</h2>
          <p>
            Our mission is to simplify the property search process for our customers by offering a seamless, transparent, and user-friendly experience. We strive to provide the best options tailored to your needs and make your property journey smooth and enjoyable.
          </p>
        </div>

        <div className="about-team">
          <h2>Meet Our Team</h2>
          <p>
            Our dedicated team of professionals works tirelessly to bring you the best real estate options. We combine expertise with passion to ensure that you find the perfect property for your lifestyle and budget.
          </p>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
