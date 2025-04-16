import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { FaChevronDown } from "react-icons/fa";
import logo from "../image/logo1.png";

const subtypeOptions = {
  Rent: [
    // Commercial shops , Commercial plots , Row houses , commercial office , commercial Godown , Flats  
    { value: "commercial-shops", label: "Commercial Shops" },
    { value: "commercial-plots", label: "Commercial Plots" },
    { value: "row-houses", label: "Row Houses" },
    { value: "commercial-office", label: "Commercial Office" },
    { value: "commercial-godown", label: "Commercial Godown" },
    { value: "flats", label: "Flats" },

  ],
  Residential: [
    // flat , Row houses  , plot 
    { value: "flat", label: "Flat" },
    { value: "row-houses", label: "Row Houses" },
    { value: "plot", label: "Plot" },
  ],
  Land: [

    { value: "residential", label: "Residential" },
    { value: "agricultural", label: "Agricultural" },
    { value: "commercial", label: "Commercial" },
    { value: "industrial", label: "Industrial" },
    { value: "na", label: "NA" },
    { value: "r-zone", label: "R Zone" },
    { value: "green-zone", label: "Green Zone" },
    { value: "gauthan", label: "Gauthan" },
   
  ],
};

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleDropdown = (dropdownName) => {
    if (window.innerWidth <= 868) {
      setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
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
          <li className={`dropdown ${activeDropdown === 'properties' ? 'open' : ''}`}>
            <span 
              className="dropdown-label"
              onClick={() => toggleDropdown('properties')}
            >
              Properties <FaChevronDown />
            </span>
            <ul className="dropdown-menu">
              {Object.entries(subtypeOptions).map(([category, subtypes]) => (
                <li 
                  key={category} 
                  className={`submenu ${activeDropdown === category ? 'open' : ''}`}
                >
                  <span 
                    className="submenu-label"
                    onClick={() => toggleDropdown(category)}
                  >
                    {category} <FaChevronDown />
                  </span>
                  <ul className="submenu-list">
                    {subtypes.map(({ value, label }) => (
                      <li key={value}>
                        <Link to={`/properties/${category.toLowerCase()}/${value}`}>
                          {label}
                        </Link>
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
          <li className={`dropdown ${activeDropdown === 'contact' ? 'open' : ''}`}>
            <span 
              className="dropdown-label"
              onClick={() => toggleDropdown('contact')}
            >
              Contact <FaChevronDown />
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
      </div>
    </nav>
  );
};

export default Navbar;
