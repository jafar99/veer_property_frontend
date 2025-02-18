import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { FaChevronDown } from "react-icons/fa";
import logo from "../image/logo1.png";

const subtypeOptions = {
  Rent: [
    { value: "apartment", label: "Apartment" },
    { value: "villa", label: "Villa" },
    { value: "independent-house", label: "Independent House" },
  ],
  Residential: [
    { value: "flat", label: "Flat" },
    { value: "bungalow", label: "Bungalow" },
    { value: "row-house", label: "Row House" },
  ],
  Land: [
    { value: "agricultural", label: "Agricultural" },
    { value: "commercial", label: "Commercial" },
    { value: "industrial", label: "Industrial" },
  ],
};

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [contactDropdown, setContactDropdown] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleContactDropdown = () => {
    setContactDropdown(!contactDropdown);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <img src={logo} alt="Logo" />
        </Link>
      </div>
      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>
      <ul className={`navbar-menu ${menuOpen ? "open" : ""}`}>
        <li>
          <Link to="/">Home</Link>
        </li>

        {/* Properties Dropdown */}
        <li
          className={`dropdown ${dropdownOpen ? "open" : ""}`}
          onMouseEnter={toggleDropdown}
          onMouseLeave={toggleDropdown}
        >
          <span className="dropdown-label">
            Properties <FaChevronDown className="dropdown-icon" />
          </span>
          <ul className="dropdown-menu">
            {Object.entries(subtypeOptions).map(([category, subtypes]) => (
              <li key={category} className="submenu">
                <span className="submenu-label">
                  {category} <FaChevronDown className="submenu-icon" />
                </span>
                {/* Submenu list (opens on hover) */}
                <ul className="submenu-list">
                  {subtypes.map(({ value, label }) => (
                    <li key={value}>
                      <Link to={`/properties/${category.toLowerCase()}/${value}`}>{label}</Link>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </li>

        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/faq">FAQ</Link>
        </li>
        <li>
          <Link to="/reviews">Reviews</Link>
        </li>

        {/* Contact Dropdown */}
        <li
          className={`dropdown ${contactDropdown ? "open" : ""}`}
          onMouseEnter={toggleContactDropdown}
          onMouseLeave={toggleContactDropdown}
        >
          <span className="dropdown-label">
            Contact <FaChevronDown className="dropdown-icon" />
          </span>
          <ul className="dropdown-menu">
            <li>
              <Link to="/contact/get-in-touch">Get in Touch</Link>
            </li>
            <li>
              <Link to="/contact/be-an-agent">Be an Agent</Link>
            </li>
          </ul>
        </li>

        <li>
          <Link to="/login">Login</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
