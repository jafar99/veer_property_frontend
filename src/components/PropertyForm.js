import React, { useState, useEffect } from 'react';
import { addProperty, updateProperty, getPropertyById } from '../services/propertyService';
import { useNavigate } from 'react-router-dom';  // Import useNavigate from react-router-dom
import './PropertyForm.css';

const PropertyForm = ({ propertyId, onSuccess = () => {} }) => {  // Default to empty function for onSuccess
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    price: '',
    location: '',
    amenities: '',
    images: [],
  });
  const [imageFiles, setImageFiles] = useState([]);  // Files to be uploaded
  const [imagePreviews, setImagePreviews] = useState([]);  // Image previews for UI
  const [notification, setNotification] = useState(null);

  const navigate = useNavigate();  // Using navigate for programmatic navigation after form submission

  useEffect(() => {
    if (propertyId) {
      getPropertyById(propertyId).then(data => {
        setFormData({ ...data, amenities: data.amenities.join(', ') });
        const previewImages = data.images.map(image => `http://localhost:5001${image}`);
        setImagePreviews(previewImages);  // Set the preview images correctly
      });
    }
  }, [propertyId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles([...imageFiles, ...files]);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const handleImageDelete = (index) => {
    const newImageFiles = imageFiles.filter((_, i) => i !== index);
    const newImagePreviews = imagePreviews.filter((_, i) => i !== index);
    setImageFiles(newImageFiles);
    setImagePreviews(newImagePreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const amenities = formData.amenities.split(',').map(a => a.trim());
    const data = { ...formData, amenities, images: imageFiles };

    try {
      if (propertyId) {
        await updateProperty(propertyId, data);
      } else {
        await addProperty(data);
      }
      onSuccess();  // Call the onSuccess function passed in as prop
      
      window.alert('Property saved successfully!');
      window.location.reload();  // Reload the page after successful submission
    } catch (error) {
      console.error('Error saving property:', error);
      window.alert('Error saving property. Please try again.');
    }
  };

  return (
    <form className="property-form" onSubmit={handleSubmit}>

      <label>Title</label>
      <input name="title" value={formData.title} onChange={handleChange} required />

      <label>Description</label>
      <textarea name="description" value={formData.description} onChange={handleChange} required />

      <label>Type</label>
      <input name="type" value={formData.type} onChange={handleChange} required />

      <label>Price</label>
      <input name="price" value={formData.price} onChange={handleChange} required />

      <label>Location</label>
      <input name="location" value={formData.location} onChange={handleChange} required />

      <label>Amenities (comma-separated)</label>
      <input name="amenities" value={formData.amenities} onChange={handleChange} />

      <label>Images</label>
      <input type="file" multiple onChange={handleImageChange} />
      
      <div className="image-preview">
        {imagePreviews.length > 0 ? (
          imagePreviews.map((src, index) => (
            <div className="image-thumbnail" key={index}>
              <img src={src} alt="Preview" />
              <button type="button" className="delete-btn" onClick={() => handleImageDelete(index)}>X</button>
            </div>
          ))
        ) : (
          <p>No images to display</p>
        )}
      </div>

      <button type="submit">{propertyId ? 'Update Property' : 'Add Property'}</button>
      <button type="button" onClick={() => navigate('/')}>Home</button>  
    </form>
  );
};

export default PropertyForm;
