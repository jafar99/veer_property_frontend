import React, { useState } from 'react';
import './Navbar.css';
// Import the necessary icon from React Icons
import { FaChevronDown } from 'react-icons/fa';

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <a href="/">RealEstate</a>
                </div>
            <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
                ☰
            </div>
            <ul className={`navbar-menu ${menuOpen ? 'open' : ''}`}>
                <li><a href="/">Home</a></li>
                <li 
                    className={`dropdown ${dropdownOpen ? 'open' : ''}`} 
                    onClick={toggleDropdown}
                >
                    <a href="#properties">
                        Properties <FaChevronDown className="dropdown-icon" />
                    </a>
                    <ul className="dropdown-menu">
                        <li><a href="/properties/rent">For Rent</a></li>
                        <li><a href="/properties/sale">For Sale</a></li>
                        <li><a href="/properties/land">Land</a></li>
                    </ul>
                </li>
                <li><a href="/about">About</a></li>
                <li><a href="/faq">FAQ</a></li>
                <li><a href="/login">Login</a></li>
                <li><a href="/contact">Contact</a></li>
            </ul>
        </nav>
    );
};

export default Navbar;
