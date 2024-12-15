import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import PropertyCards from "../components/PropertyCards";
import Footer from "../components/Footer";
import { getProperties } from "../services/propertyService";
import "./Home.css";

const Home = () => {
  
  return (
    <div>
      {/* <Navbar /> */}
      <div className="hero-section">
        <h1>Find Your Dream Property</h1>
        <p>Discover the perfect place to call home</p>
        <div className="search-bar">
          <input type="text" placeholder="Search properties..." />
          <button>Search</button>
        </div>
      </div>
      <PropertyCards  />

    </div>
  );
};

export default Home;
