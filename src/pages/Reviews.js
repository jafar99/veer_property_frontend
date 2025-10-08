import React, { useEffect, useMemo, useState } from "react";
import { getReviews, addReview } from "../services/reviewService";
import "./Reviews.css"; // Import styles

const Reviews = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: "", message: "", rating: 5 });
  const [hoverRating, setHoverRating] = useState(0);

  const stars = useMemo(() => [1, 2, 3, 4, 5], []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getReviews();
      setItems(res.reviews || []);
    } catch (e) {
      setError("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === "rating" ? Number(value) : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim() || !form.rating) return;
    try {
      setLoading(true);
      setError("");
      await addReview(form);
      setForm({ name: "", message: "", rating: 5 });
      await fetchData();
    } catch (e) {
      setError("Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reviews-container">
      <div className="reviews-header">
        <h1 className="reviews-title">Customer Reviews</h1>
        <p className="reviews-subtitle">Share your experience with us</p>
        <div className="reviews-count">
          📝 {items.length} Review{items.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="reviews-content">
        <div className="reviews-section">
          <div className="reviews-grid">
            {items.map((review) => (
              <div key={review._id} className="review-card">
                <h3 className="review-name">{review.name}</h3>
                <p className="review-text">{review.message}</p>
                <div className="review-rating">
                  {"⭐".repeat(review.rating)}
                  <span style={{ marginLeft: '8px', fontSize: '0.9rem', color: '#718096' }}>
                    ({review.rating}/5)
                  </span>
                </div>
                <div className="review-date">
                  {new Date(review.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="review-form-section">
          <h2 className="form-title">Write a Review</h2>
          
          {error && <div className="error-text">{error}</div>}
          
          <form className="review-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Your Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Your Review</label>
              <textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Share your experience with our service..."
                maxLength={200}
                required
              />
              <div className="char-counter">{form.message.length}/200 characters</div>
            </div>

            <div className="rating-section">
              <label className="rating-label">Rating</label>
              <div className="rating-input" aria-label="Select rating">
                {stars.map((s) => {
                  const active = (hoverRating || form.rating) >= s;
                  return (
                    <span
                      key={s}
                      role="button"
                      tabIndex={0}
                      className={`star${active ? " selected" : ""}`}
                      onClick={() => setForm((prev) => ({ ...prev, rating: s }))}
                      onMouseEnter={() => setHoverRating(s)}
                      onMouseLeave={() => setHoverRating(0)}
                      onKeyDown={(ev) => {
                        if (ev.key === "Enter" || ev.key === " ") {
                          setForm((prev) => ({ ...prev, rating: s }));
                        }
                      }}
                    >
                      {active ? "★" : "☆"}
                    </span>
                  );
                })}
              </div>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
