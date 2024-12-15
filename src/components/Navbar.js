import React, { useState } from 'react';
import './Navbar.css';

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className="navbar">
            <div className="navbar-logo">RealEstate</div>
            <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
                ☰
            </div>
            <ul className={`navbar-menu ${menuOpen ? 'open' : ''}`}>
                <li><a href="/">Home</a></li>
                <li><a href="/properties/rent">For Rent</a></li>
                <li><a href="/properties/sale">For Sale</a></li>
                <li><a href="/properties/land">Land</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="/login">Login</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    );
};

export default Navbar;
