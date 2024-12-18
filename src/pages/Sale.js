import React, { useState, useEffect } from 'react';
import { getProperties } from '../services/propertyService';  // Import API call service
import PropertyList from '../components/PropertyList';  // Import PropertyList component

const Residential = () => {
  const [properties, setProperties] = useState([]);  // State to store all properties
  const [loading, setLoading] = useState(true);  // State for loading
  const [error, setError] = useState(null);  // State for error handling

  // Fetch all properties when the component mounts
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await getProperties();  // Fetch properties from API
        setProperties(response.data);  // Set properties data in state
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError('Failed to load properties.');  // Set error message if API fails
      } finally {
        setLoading(false);  // Set loading to false once the request is complete
      }
    };

    fetchProperties();  // Fetch properties
  }, []);

  if (loading) return <div className="loading">Loading properties...</div>;  // Show loading message
  if (error) return <div className="error">{error}</div>;  // Show error message if there is an error

  // Filter properties based on 'Residential' type and pass to PropertyList
  const ResidentialProperties = properties.filter(property => property.type === 'Residential' || property.type === 'Residential');

  return <PropertyList properties={ResidentialProperties} />;  // Pass filtered properties to PropertyList component
};

export default Residential;
