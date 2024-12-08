import React, { useState, useEffect } from 'react';
import { getProperties, deleteProperty } from '../services/propertyService';
import PropertyForm from '../components/PropertyForm';
import './Admin.css';

const Admin = () => {
  const [properties, setProperties] = useState([]);
  const [editProperty, setEditProperty] = useState(null); // Edit property state
  const [refresh, setRefresh] = useState(false);

  // Fetch properties from API
  useEffect(() => {
    const fetchProperties = async () => {
      const { data } = await getProperties();
      setProperties(data);
      console.log(data);
    };
    fetchProperties();
  }, [refresh]); // Re-fetch properties when refresh changes

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      await deleteProperty(id);
      setRefresh(!refresh); // Refresh after deletion
    }
  };

  return (
    <div className="admin-panel">
      <h1>Admin Panel</h1>
      {/* Pass the propertyId of the selected property */}
      <PropertyForm
        propertyId={editProperty?._id} // Passing propertyId for editing
        onSubmitSuccess={() => {
          setRefresh(!refresh); // Trigger a refresh after submit
          setEditProperty(null); // Clear the editing state after success
        }}
      />
      <div className="property-admin-list">
        {properties.map((property) => (
          <div key={property._id} className="property-admin-card">
            {/* Render each image of the property */}
            <div className="property-images">
              {property.images.map((image, index) => (
              <img
              key={index}
              src={`http://localhost:5001${image}`}  // Ensure the correct port (5001) is being used
              alt={property.title}
              className="property-image"
            />
            
              ))}
            </div>
            <h3>{property.title}</h3>
            <p>Type: {property.type}</p>
            <p>Price: ${property.price}</p>
            <button onClick={() => setEditProperty(property)}>Edit</button>
            <button onClick={() => handleDelete(property._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;
