import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addProperty, updateProperty, getPropertyById } from '../services/propertyService';
import './PropertyForm.css';

const PropertyForm = ({ propertyId, onSubmitSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'Rent',
    price: '',
    location: '',
    amenities: '',
    images: [], // Existing images (URLs)
  });
  const [imageFiles, setImageFiles] = useState([]); // To store file objects for preview and upload
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperty = async () => {
      if (propertyId) {
        try {
          const { data } = await getPropertyById(propertyId);
          console.log(data.images);
          setFormData({
            title: data.title,
            description: data.description,
            type: data.type,
            price: data.price.toString(),
            location: data.location,
            amenities: data.amenities.join(', '),
            images: data.images, // Existing image URLs
          });
        } catch (error) {
          console.error('Error fetching property:', error);
        }
      } else {
        setFormData({
          title: '',
          description: '',
          type: 'Rent',
          price: '',
          location: '',
          amenities: '',
          images: [],
        });
      }
    };

    fetchProperty();
  }, [propertyId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    setImageFiles((prevFiles) => [...prevFiles, ...Array.from(files)]);
  };

  const handleImageDelete = (index) => {
    setImageFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const payload = {
      ...formData,
      price: Number(formData.price),
      amenities: formData.amenities.split(',').map((item) => item.trim()),
    };

    const formDataObj = new FormData();
    // Append non-image fields to formData
    for (const key in payload) {
      if (key !== 'images') {
        formDataObj.append(key, payload[key]);
      }
    }

    // Append images to formData
    imageFiles.forEach((file) => formDataObj.append('images', file));

    try {
      if (propertyId) {
        await updateProperty(propertyId, formDataObj);
        setMessage('Property updated successfully!');
      } else {
        await addProperty(formDataObj);
        setMessage('Property added successfully!');
      }
      onSubmitSuccess();
    } catch (error) {
      console.error('Error submitting the form:', error);
      setMessage('Failed to submit the form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNavigateHome = () => {
    navigate('/');
  };

  return (
    <form className="property-form" onSubmit={handleSubmit}>
      <h3>{propertyId ? 'Edit Property' : 'Add New Property'}</h3>

      {message && <p className="form-message">{message}</p>}

      <label>
        Title
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          required
        />
      </label>

      <label>
        Description
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          required
        />
      </label>

      <label>
        Type
        <select name="type" value={formData.type} onChange={handleChange}>
          <option value="Rent">Rent</option>
          <option value="Sale">Sale</option>
          <option value="Land">Land</option>
        </select>
      </label>

      <label>
        Price
        <input
          name="price"
          value={formData.price}
          onChange={handleChange}
          type="number"
          placeholder="Price"
          required
        />
      </label>

      <label>
        Location
        <input
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Location"
          required
        />
      </label>

      <label>
        Amenities
        <input
          name="amenities"
          value={formData.amenities}
          onChange={handleChange}
          placeholder="Amenities (comma-separated)"
        />
      </label>

      <label>
        Images
        <input
          type="file"
          multiple
          onChange={handleImageChange}
          accept="image/*"
        />
      </label>

      <div className="image-preview">
        {imageFiles.length > 0 && imageFiles.map((file, index) => (
          <div key={index} className="image-thumbnail">
            <img src={URL.createObjectURL(file)} alt={`image-${index}`} />
            <button type="button" onClick={() => handleImageDelete(index)} className="delete-btn">
              X
            </button>
          </div>
        ))}
      </div>

      <div className="form-buttons">
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
        <button type="button" onClick={handleNavigateHome}>
          Home
        </button>
      </div>
    </form>
  );
};

export default PropertyForm;
