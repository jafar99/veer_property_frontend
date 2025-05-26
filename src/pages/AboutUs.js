import React, { useEffect, useState } from "react";
import "./AboutUs.css";
import founderImage1 from "../image/founder1.jpg"; // Update with the correct image path
import founderImage2 from "../image/founder2.jpg";
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin
);

const landRatesData = [
  { year: 2005, rate: 1 },
  { year: 2010, rateMin: 2.5, rateMax: 3 },
  { year: 2015, rate: 7 },
  { year: 2020, rate: 15 },
  { year: 2025, rate: 25 }
];

const years = landRatesData.map(item => item.year);
const rates = landRatesData.map(item => item.rate || (item.rateMin + item.rateMax) / 2);

// Custom plugin to draw a big red arrow at the end of the line
const drawArrowPlugin = {
  id: 'drawArrowPlugin',
  afterDatasetsDraw(chart) {
    const { ctx, chartArea, scales } = chart;
    const dataset = chart.data.datasets.find(ds => ds.type === 'line');
    if (!dataset) return;
    const meta = chart.getDatasetMeta(chart.data.datasets.findIndex(ds => ds.type === 'line'));
    if (!meta || !meta.data || meta.data.length < 2) return;
    const lastPoint = meta.data[meta.data.length - 1];
    const prevPoint = meta.data[meta.data.length - 2];
    if (!lastPoint || !prevPoint) return;
    const x1 = prevPoint.x;
    const y1 = prevPoint.y;
    const x2 = lastPoint.x;
    const y2 = lastPoint.y;
    // Draw the arrow line
    ctx.save();
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    // Draw the arrowhead
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const arrowLength = 36;
    const arrowWidth = 18;
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - arrowLength * Math.cos(angle - Math.PI / 7), y2 - arrowLength * Math.sin(angle - Math.PI / 7));
    ctx.lineTo(x2 - arrowLength * Math.cos(angle + Math.PI / 7), y2 - arrowLength * Math.sin(angle + Math.PI / 7));
    ctx.lineTo(x2, y2);
    ctx.lineTo(x2 - arrowWidth * Math.cos(angle), y2 - arrowWidth * Math.sin(angle));
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.restore();
  }
};

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
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
          <Line
            data={{
              labels: years,
              datasets: [
                {
                  type: 'bar',
                  label: 'Plot Rate (Bar)',
                  data: rates,
                  backgroundColor: 'rgba(0, 123, 167, 0.6)',
                  borderRadius: 4,
                  order: 1,
                  barPercentage: 0.6,
                  categoryPercentage: 0.7
                },
                {
                  type: 'line',
                  label: 'Plot Rate (Line)',
                  data: rates,
                  borderColor: 'red',
                  borderWidth: 6,
                  pointRadius: 0,
                  fill: false,
                  order: 2,
                  tension: 0
                }
              ]
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false
                },
                title: {
                  display: true,
                  text: 'Baramati Plot Rates Trend (2005-2025)'
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Rate (Lakhs per Guntha)'
                  }
                },
                x: {
                  title: {
                    display: true,
                    text: 'Year'
                  }
                }
              }
            }}
            plugins={[drawArrowPlugin]}
          />
        </div>
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
