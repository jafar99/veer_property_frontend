import React, { useEffect, useState } from "react";
import {
  getOffers,
  addOffer,
  updateOffer,
  deleteOffer,
} from "../services/offerService";
import "./OfferPanel.css";

const OfferPanel = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  // Fetch all offers on mount
  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const data = await getOffers();
      setOffers(data);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    try {
      await addOffer({ images: [file] });
      setFile(null);
      await fetchOffers();
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOffer = async (offerId) => {
    if (window.confirm("Delete this offer and all its images?")) {
      setLoading(true);
      try {
        await deleteOffer(offerId);
        await fetchOffers();
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="offer-panel">
      <h2>Offer Images</h2>
      <form className="offer-form" onSubmit={handleUpload}>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleFileChange}
          required
        />
        <button type="submit" disabled={loading || !file}>
          {loading ? "Uploading..." : "Upload Image"}
        </button>
      </form>
      {loading ? (
        <p>Loading images...</p>
      ) : (
        <ul className="offer-list">
          {offers.length === 0 ? (
            <li>No images found.</li>
          ) : (
            offers.map((offer) =>
              offer.images?.map((img) => (
                <li key={img.url} className="offer-item">
                  <div className="offer-image-block">
                    <img src={img.url} alt="Offer" className="offer-image" />
                    <button
                      type="button"
                      onClick={() => handleDeleteOffer(offer._id)}
                      style={{ marginLeft: 8, background: "#dc3545", color: "#fff" }}
                    >
                      Delete Offer
                    </button>
                  </div>
                </li>
              ))
            )
          )}
        </ul>
      )}
    </div>
  );
};

export default OfferPanel;
