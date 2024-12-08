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
                <li><a href="#home">Home</a></li>
                <li><a href="#rent">Rent</a></li>
                <li><a href="#sale">Sale</a></li>
                <li><a href="#land">Land</a></li>
                <li><a href="/admin">Admin</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    );
};

export default Navbar;
