import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPropertyById } from '../services/propertyService';
import './PropertyDetails.css';

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const { data } = await getPropertyById(id);
        setProperty(data);
      } catch (err) {
        console.error('Error fetching property details:', err);
      }
    };

    fetchProperty();
  }, [id]);

  if (!property) {
    return <p>Loading property details...</p>;
  }

  return (
    <div className="property-details">
      <h2>{property.title}</h2>
      <img src={property.images[0]} alt={property.title} />
      <p><strong>Type:</strong> {property.type}</p>
      <p><strong>Price:</strong> ${property.price}</p>
      <p><strong>Location:</strong> {property.location}</p>
      <p><strong>Amenities:</strong> {property.amenities.join(', ')}</p>
      <p><strong>Description:</strong> {property.description}</p>
    </div>
  );
};

export default PropertyDetails;
