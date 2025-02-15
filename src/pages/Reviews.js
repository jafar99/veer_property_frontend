import React from "react";
import { reviews } from "../services/data"; // Import reviews data
import "./Reviews.css"; // Import styles

const Reviews = () => {
  return (
    <div className="reviews-container">
      <h2 className="reviews-title">What Our Clients Say</h2>
      <div className="reviews-grid">
        {reviews.map((review) => (
          <div key={review.id} className="review-card">
            <h3 className="review-name">{review.name}</h3>
            <p className="review-text">"{review.review}"</p>
            <div className="review-rating">
              {"⭐".repeat(review.rating)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
