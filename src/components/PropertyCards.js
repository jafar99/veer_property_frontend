import React from 'react';
import './PropertyCards.css';

const PropertyCards = ({ properties, type }) => {
    // Filter properties by type and show exactly 4
    const displayedProperties = properties.filter((property) => property.type === type).slice(0, 4);

    console.log(displayedProperties);

    return (
        <div className="property-section">
            <h2>{type.charAt(0).toUpperCase() + type.slice(1)} Properties</h2>
            <div className="property-grid">
                {displayedProperties.map((property) => (
                    <div key={property._id} className="property-card">
                        <img
                            src={property.images[0]}
                            alt={property.title}
                            className="property-image"
                        />
                        <div className="property-info">
                            <h3>{property.title}</h3>
                            <p>{property.description}</p>
                            <p>
                                <strong>Location:</strong> {property.location}
                            </p>
                            <p>
                                <strong>Price:</strong> ${property.price}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PropertyCards;
