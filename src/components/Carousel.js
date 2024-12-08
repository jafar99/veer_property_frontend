import React from 'react';
import './Carousel.css';

const Carousel = () => {
    return (
        <div className="carousel">
            <div className="carousel-item" style={{ backgroundImage: "url('https://via.placeholder.com/1920x500')" }}>
                <h2>Find Your Dream Home</h2>
            </div>
            <div className="carousel-item" style={{ backgroundImage: "url('https://via.placeholder.com/1920x500?text=Rent+Properties')" }}>
                <h2>Affordable Rentals</h2>
            </div>
            <div className="carousel-item" style={{ backgroundImage: "url('https://via.placeholder.com/1920x500?text=Land+Sales')" }}>
                <h2>Land for Sale</h2>
            </div>
        </div>
    );
};

export default Carousel;
