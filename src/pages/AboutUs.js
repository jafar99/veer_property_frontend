import React, { useEffect, useState } from "react";
import "./AboutUs.css";
import founderImage1 from "../image/founder1.jpg"; // Update with the correct image path
import founderImage2 from "../image/founder2.jpg";
import graph from "../image/baramati_plot_rates_trend.png";

const AboutUs = () => {
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      tag.async = true;
      document.body.appendChild(tag);
    }

    window.onYouTubeIframeAPIReady = () => {
      const newPlayer = new window.YT.Player("youtube-video", {
        events: {
          onReady: (event) => {
            event.target.playVideo();
            event.target.unMute();
          },
        },
      });
      setPlayer(newPlayer);
    };
  }, []);

  return (
    <div className="about-container">
      {/* Video and Company Info Section */}
      <section className="about-content">
        <div className="video-container">
          <iframe
            id="youtube-video"
            width="560"
            height="315"
            src="https://www.youtube.com/embed/v5LH9m9AZgE?enablejsapi=1&autoplay=1&loop=1&playlist=v5LH9m9AZgE&modestbranding=1&controls=0&showinfo=0&rel=0"
            title="Veer Properties Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        <div className="company-info">
          <h2>About Veer Property</h2>
          <p>
            <strong>Veer Property</strong> is your trusted real estate partner
            in Baramati, committed to seamless, transparent, and rewarding
            property transactions. Whether you're looking for a dream home, a
            smart investment, or a commercial space, we provide expert guidance,
            verified properties, and hassle-free services.
          </p>
        </div>
      </section>

      {/* Founder Section */}
      <section className="founder-section">
        <div className="founder-image-container">
          <div className="founder">
            <img src={founderImage1} alt="Siddharth Chandrakant Chavan" />
            <p>Siddharth Chandrakant Chavan</p>
          </div>
          <div className="founder">
            <img src={founderImage2 } alt="Manoj Ashok Jagtap" />
            <p>Manoj Ashok Jagtap</p>
          </div>
        </div>
        <div className="founder-info">
          <h2>Meet Our Founders</h2>
          <p>
            Our visionary founders, Mr. Siddharth Chandrakant Chavan and Mr.
            Manoj Ashok Jagtap, bring deep expertise in the real estate sector.
            With a mission to redefine property-buying experiences, they have
            built Veer Property on trust, integrity, and customer satisfaction.
          </p>
          <p>
            Their years of experience and market knowledge ensure that every
            client receives personalized guidance and the best property deals.
            Their commitment to ethical business practices and a customer-first
            approach has earned Veer Property a strong reputation in the
            industry.
          </p>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-choose">
        <h2>Why Choose Veer Property?</h2>
        <div className="features-grid">
          <div className="feature-card">✅ Expert Market Knowledge</div>
          <div className="feature-card">✅ Transparent Transactions</div>
          <div className="feature-card">✅ Verified & Premium Properties</div>
          <div className="feature-card">✅ Customer-Centric Approach</div>
          <div className="feature-card">✅ Hassle-Free Process</div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <h2>Our Mission</h2>
        <p>
          To provide genuine, value-driven, and transparent real estate
          solutions, helping clients make informed property decisions with
          confidence.
        </p>
      </section>

      {/* Graph Section */}
      <section className="graph-section">
        <h2>Baramati Plot Rates Trend</h2>
        <img src={graph} alt="Baramati Plot Rates Trend Graph" />
      </section>

      {/* Contact Section */}
      <section className="contact-us">
        <h2>Looking for Your Perfect Property?</h2>
        <p>📞 Contact Veer Property today!</p>
      </section>
    </div>
  );
};

export default AboutUs;
