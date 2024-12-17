import React, { useState, useEffect } from 'react';
import { addProperty, updateProperty, getPropertyById } from '../services/propertyService';
import { useNavigate } from 'react-router-dom';  
import { useAuth } from '../services/AuthContext'; // Import authentication context
import './PropertyForm.css';

const PropertyForm = ({ propertyId, onSuccess = () => {} }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '', 
    status: '', // Add status field
    price: '',
    location: '',
    area: '',
    amenities: '',
    images: [],  // We will keep this as an empty array initially, but it will hold existing images too
  });
  const [imageFiles, setImageFiles] = useState([]);  // Files to be uploaded
  const [imagePreviews, setImagePreviews] = useState([]);  // Image previews for UI

  const { logout } = useAuth(); // Get logout function from auth context
  const navigate = useNavigate(); 

  useEffect(() => {
    if (propertyId) {
      getPropertyById(propertyId).then(data => {
        // Prepopulate form fields with the existing property data
        setFormData({
          title: data.title,
          description: data.description,
          type: data.type,
          status: data.status, // Set the status field
          price: data.price,
          location: data.location,
          area: data.area,
          amenities: data.amenities.join('\n'),
          images: data.images || [], // Ensure images are always an array
        });

        // Set the preview images
        const previewImages = data.images.map(image => `http://localhost:5001${image}`);
        setImagePreviews(previewImages);
      });
    }
  }, [propertyId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles([...imageFiles, ...files]);  // Add new files to existing array
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);  // Add previews of new files
  };

  const handleImageDelete = (index) => {
    const newImageFiles = imageFiles.filter((_, i) => i !== index);
    const newImagePreviews = imagePreviews.filter((_, i) => i !== index);
    setImageFiles(newImageFiles);
    setImagePreviews(newImagePreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Split amenities by new line and trim spaces
    const amenities = formData.amenities.split('\n').map(a => a.trim());

    // Combine existing images with new images
    const data = { 
      ...formData, 
      amenities, 
      images: [...formData.images, ...imageFiles] // Ensure that we send existing and new images
    };

    try {
      if (propertyId) {
        await updateProperty(propertyId, data);
      } else {
        await addProperty(data);
      }
      onSuccess();  // Call the onSuccess function passed in as prop

      window.alert('Property saved successfully!');
      // reload the page then navigate to /admin
      window.location.reload();
    } catch (error) {
      console.error('Error saving property:', error);
      window.alert('Error saving property. Please try again.');
    }
  };

  const handleLogout = () => {
    logout(); // Log out the user
    navigate('/login'); // Redirect to login page
  };

  return (
    <div>
      

      <form className="property-form" onSubmit={handleSubmit}>
        <label>Title</label>
        <input name="title" value={formData.title} onChange={handleChange} required />

        <label>Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange} required />

        <label>Type</label>
        <select name="type" value={formData.type} onChange={handleChange} required>
          <option value="">Select Type</option>
          <option value="Rent">Rent</option>
          <option value="Sale">Sale</option>
          <option value="Land">Land</option>
        </select>

        {/* // Add status dropdown  */}
        <label>Property Status</label>
        <select name="status" value={formData.status} onChange={handleChange} required>
          <option value="">Select Status</option>
          <option value="Available">Available</option>
          <option value="Not Available">Not Available</option>
          <option value="Sold">Sold</option>

        </select>

        <label>Price</label>
        <input name="price" value={formData.price} onChange={handleChange} required />


        <label>Location</label>
        <input name="location" value={formData.location} onChange={handleChange} required />

        {/* // Add area field */}
        <label>Area</label>
        <input name="area" value={formData.area} onChange={handleChange} required />

        <label>Amenities (one per line)</label>
        <textarea name="amenities" value={formData.amenities} onChange={handleChange} rows="5" />

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

          <div className="form-group-btn">
        <button type="submit">{propertyId ? 'Update Property' : 'Add Property'}</button>
        {/* <button type="button" onClick={() => navigate('/')}>Home</button>   */}
        <button type="button" onClick={handleLogout}>Logout</button>
        </div>
      </form>
    </div>
  );
};

export default PropertyForm;
