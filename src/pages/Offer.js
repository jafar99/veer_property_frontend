import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Offer.css";

const API_URL = process.env.REACT_APP_OFFER_URL;

const Offer = () => {
  const [offers, setOffers] = useState([]);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    axios.get(`${API_URL}/offers`)
      .then(res => setOffers(res.data.offers || []))
      .catch(() => setOffers([]));
  }, []);

  return (
    <div className="offer-marquee-container">
      <h2 className="offer-marquee-title">
        <span role="img" aria-label="offer">🏷️</span> Latest Offers
      </h2>
      <div className="modern-marquee">
        <div
          className="marquee-content"
          style={{
            animationPlayState: paused ? "paused" : "running",
            cursor: "pointer"
          }}
          onClick={() => setPaused((prev) => !prev)}
          title={paused ? "Click to resume" : "Click to pause"}
        >
          {offers.length === 0 ? (
            <span>No offers available at the moment.</span>
          ) : (
            offers.map((offer, idx) =>
              offer.images && offer.images.length > 0 ? (
                <span key={offer._id || idx} className="marquee-offer">
                  <img src={offer.images[0].url} alt="Offer" className="marquee-offer-img" />
                </span>
              ) : null
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Offer;