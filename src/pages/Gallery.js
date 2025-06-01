import React, { useState } from 'react';
import './Gallery.css';

// Import gallery images
// import gallery1 from '../image/gallery/IMG-20241218-WA0000.jpg';
// import gallery2 from '../image/gallery/IMG-20250418-WA0003.jpg';
// import gallery3 from '../image/gallery/IMG-20250418-WA0004.jpg';
// import gallery4 from '../image/gallery/IMG-20250418-WA0005.jpg';
// import gallery5 from '../image/gallery/IMG-20250418-WA0006.jpg';

import gallery1 from '../image/gallery/IMG-20241218-WA0000.jpg';
import gallery2 from '../image/gallery/IMG-20250418-WA0003.jpg';
import gallery3 from '../image/gallery/IMG-20250418-WA0004.jpg';
import gallery4 from '../image/gallery/IMG-20250418-WA0005.jpg';
import gallery5 from '../image/gallery/IMG-20250418-WA0006.jpg';


const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const galleryImages = [
    { src: gallery1, alt: 'Office View 1' },
    { src: gallery2, alt: 'Office View 2' },
    { src: gallery3, alt: 'Office View 3' },
    { src: gallery4, alt: 'Office View 4' },
    { src: gallery5, alt: 'Office View 5' },
  ];

  const openLightbox = (image) => {
    setSelectedImage(image);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  return (
    <div className="gallery-container">
      <h1 className="gallery-title">Gallery</h1>
      
      <div className="gallery-grid">
        {galleryImages.map((image, index) => (
          <div 
            key={index} 
            className="gallery-item"
            onClick={() => openLightbox(image)}
          >
            <img 
              src={image.src} 
              alt={image.alt}
              loading="lazy"
            />
            <div className="gallery-item-overlay">
              <span>View Details</span>
            </div>
          </div>
        ))}
      </div>

      {selectedImage && (
        <div className="lightbox" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox}>×</button>
            <img src={selectedImage.src} alt={selectedImage.alt} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery; 