import React from 'react';
import './PropertyList.css';

const PropertyList = ({ properties }) => {
  return (
    <div className="property-list">
      {properties.map((property) => (
        <div key={property.id} className="property-card">
          <img src={property.image} alt={property.title} />
          <h3>{property.title}</h3>
          <p>{property.description}</p>
          <span>${property.price}</span>
        </div>
      ))}
    </div>
  );
};

export default PropertyList;
