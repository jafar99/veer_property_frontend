import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Carousel from "../components/Carousel";
import PropertyCards from "../components/PropertyCards";
import Footer from "../components/Footer";
import { getProperties } from "../services/propertyService";
import PropertyForm from "../components/PropertyForm";

const Home = () => {
  const [properties, setProperties] = useState([]);

  const fetchProperties = async () => {
    const response = await getProperties();
    setProperties(response?.data);
    console.log(response.data);
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  return (
    <div>
      <Navbar />
      <Carousel />
      <PropertyCards properties={properties} type="rent" />
      <PropertyCards properties={properties} type="sale" />
      <PropertyCards properties={properties} type="land" />


      <Footer />
    </div>
  );
};

export default Home;
