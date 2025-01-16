import React, { useState, useEffect } from 'react';
import { getProperties, deleteProperty } from '../services/propertyService';
import PropertyForm from '../components/PropertyForm';
import './Admin.css';

const Admin = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [selectedTab, setSelectedTab] = useState('Residential'); // Default to 'Residential'
  const [editProperty, setEditProperty] = useState(null); // Edit property state
  const [refresh, setRefresh] = useState(false);

  // Fetch properties from API
  useEffect(() => {
    const fetchProperties = async () => {
      const { data } = await getProperties();
      setProperties(data);
      setFilteredProperties(data.filter((property) => property.type === 'Residential')); // Default filter
      // console.log(data);
    };
    fetchProperties();
  }, [refresh]); // Re-fetch properties when refresh changes

  // Filter properties based on selected tab
  const handleTabChange = (tab) => {
    setSelectedTab(tab);
    setFilteredProperties(properties.filter((property) => property.type === tab));
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      await deleteProperty(id);
      setRefresh(!refresh); // Refresh after deletion
    }
  };

  return (
    <div className="admin-panel">
      <div className="property-type">Admin Panel</div>
      
      {/* Property Form */}
      <PropertyForm
        propertyId={editProperty?._id} // Passing propertyId for editing
        onSubmitSuccess={() => {
          setRefresh(!refresh); // Trigger a refresh after submit
          setEditProperty(null); // Clear the editing state after success
        }}
      />

      <hr />

      {/* Tabs for segmentation */}
      <div className="tabsss">
        {['Residential', 'Rent', 'Land'].map((tab) => (
          <button
            key={tab}
            className={`tab-button ${selectedTab === tab ? 'active' : ''}`}
            onClick={() => handleTabChange(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Property List */}
      <div className="property-admin-list">
        {filteredProperties.map((property) => (
          <div key={property._id} className="property-admin-card">
            {/* Render each image of the property */}
            <div className="property-images">
              {property.images.map((image, index) => (
                <img
                  key={index}
                  src={`http://localhost:5001${image}`}
                  alt={property.title}
                  className="property-image"
                />
              ))}
            </div>
            <h3>{property.title}</h3>
            <p>Type: {property.type}</p>
            <p>Price: ₹{property.price.toLocaleString()}</p>
            <p>Location: {property.location}</p>
            <p>Local Address: {property.localAddress}</p>
            <p>Status: {property.status}</p>
            <p>Area: {property.area}</p>
            <button onClick={() => setEditProperty(property)}>Edit</button>
            <button onClick={() => handleDelete(property._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;
