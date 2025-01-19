import React, { useState, useEffect } from "react";
import Select from "react-select"; // Import react-select
import {
  addProperty,
  updateProperty,
  getPropertyById,
} from "../services/propertyService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../services/AuthContext";
import "./PropertyForm.css";

const PropertyForm = ({ propertyId, onSuccess = () => {} }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    status: "",
    availableFor: "",
    price: "",
    location: "",
    localAddress: "",
    area: "",
    googldriveimage: "",
    gooogledrivevideo: "",
    googleMapLink: "",
    availableFrom: "",
    propertyInfo: "",
    propertyAge: "",
    propertyFacing: "",
    propertyFloor: "",
    propertyTotalFloor: "",
    agreement: "",
    amenities: [], // Initialize as an empty array
    features: [], // Initialize as an empty array
    images: [],
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const { logout } = useAuth();
  const navigate = useNavigate();

  // Sample options for features and amenities
  const amenityOptions = [
    { value: "Swimming Pool", label: "Swimming Pool" },
    { value: "Gym", label: "Gym" },
    { value: "Parking", label: "Parking" },
    { value: "visitor parking", label: "visitor parking" },
    { value: "Security", label: "Security" },
    { value: "Lift", label: "Lift" },
    { value: "Club House", label: "Club House" },
    { value: "Power Backup", label: "Power Backup" },
    { value: "Electricity", label: "Electricity" },
    { value: "Water Supply", label: "Water Supply" },
    { value: "Gas Pipeline", label: "Gas Pipeline" },
    //pet friendly
    { value: "Pet Friendly", label: "Pet Friendly" },
    { value: "Intercom", label: "Intercom" },
    { value: "Fire Safety", label: "Fire Safety" },
    { value: "Rain Water Harvesting", label: "Rain Water Harvesting" },
    { value: "Sewage Treatment Plant", label: "Sewage Treatment Plant" },
    { value: "Garden", label: "Garden" },
    { value: "Indoor Games", label: "Indoor Games" },
    { value: "Outdoor Games", label: "Outdoor Games" },
    { value: "Cafeteria", label: "Cafeteria" },
    { value: "Library", label: "Library" },
    { value: "Temple", label: "Temple" },
    { value: "Jogging Track", label: "Jogging Track" },
    { value: "Children Play Area", label: "Children Play Area" },
    { value: "Senior Citizen Sitout", label: "Senior Citizen Sitout" },
    { value: "Multipurpose Hall", label: "Multipurpose Hall" },
    { value: "Shopping Mall", label: "Shopping Mall" },
    { value: "School", label: "School" },
    { value: "Hospital", label: "Hospital" },
    { value: "ATM", label: "ATM" },
  ];

  const featureOptions = [
    { value: "Air Conditioning", label: "Air Conditioning" },
    { value: "Fire Safety", label: "Fire Safety" },
    { value: "Balcony", label: "Balcony" },
    { value: "High Ceilings", label: "High Ceilings" },
    { value: "Walk-in Closet", label: "Walk-in Closet" },
    { value: "Security System", label: "Security System" },
    { value: "Furnished", label: "Furnished" },
    { value: "Smart Home", label: "Smart Home" },
    { value: "Storage", label: "Storage" },
    { value: "Washer/Dryer", label: "Washer/Dryer" },
    { value: "City View", label: "City View" },
    { value: "Mountain View", label: "Mountain View" },
    { value: "Ocean View", label: "Ocean View" },
    { value: "Garden View", label: "Garden View" },
    { value: "Pool View", label: "Pool View" },
    { value: "Lake View", label: "Lake View" },
    { value: "River View", label: "River View" },
    { value: "Forest View", label: "Forest View" },
    { value: "Valley View", label: "Valley View" },
    { value: "Sunset View", label: "Sunset View" },
    { value: "Sunrise View", label: "Sunrise View" },
    { value: "Beach View", label: "Beach View" },
    { value: "Desert View", label: "Desert View" },
    { value: "Ski View", label: "Ski View" },
  ];

  useEffect(() => {
    if (propertyId) {
      getPropertyById(propertyId).then((data) => {
        setFormData({
          ...data,
          amenities: data.amenities
            ? data.amenities.split(", ").map((a) => ({
                value: a,
                label: a,
              }))
            : [],
          features: data.features
            ? data.features.split(", ").map((f) => ({
                value: f,
                label: f,
              }))
            : [],
        });
  
        const previewImages = data.images.map(
          (image) => `${process.env.REACT_APP_IMAGE_URL}/${image}`
        );
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
    setImageFiles([...imageFiles, ...files]);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
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
  
    // Convert selected options back to comma-separated strings
    const amenities = formData.amenities.map((a) => a.value).join(", ");
    const features = formData.features.map((f) => f.value).join(", ");
  
    // Merge existing images with new image files (if any)
    const updatedImages = [...formData.images, ...imageFiles];
  
    const data = {
      ...formData,
      amenities, // Send as a comma-separated string
      features, // Send as a comma-separated string
      images: updatedImages, // Ensure images are included in the payload
    };
  
    try {
      if (propertyId) {
        // Update existing property
        await updateProperty(propertyId, data);
      } else {
        // Add new property
        await addProperty(data);
      }
      onSuccess();
      window.alert("Property saved successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error saving property:", error);
      window.alert("Error saving property. Please try again.");
    }
  };
  

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div>
      <form className="property-form" onSubmit={handleSubmit}>
        <label>Title</label>
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          
        />

        <label>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          
        />

        <label>Type</label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          
        >
          <option value="">Select Property Type</option>
          <option value="Rent">Rent</option>
          <option value="Residential">Residential</option>
          <option value="Land">Land</option>
        </select>

        <label>Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          
        >
          <option value="">Select Property Status</option>
          <option value="Available">Available</option>
          <option value="Not Available">Not Available</option>
          <option value="Sold">Sold</option>
        </select>

        {/* // Available for dropdown family , bachelor , couple */}

        <label>Available For</label>
        <select
          name="availableFor"
          value={formData.availableFor}
          onChange={handleChange}
          
        >
          <option value="">Property Available For</option>
          <option value="Family">Family</option>
          <option value="Bachelor">Bachelor</option>
          <option value="Couple">Couple</option>
          <option value="All">All</option>
          <option value="Boys">Boys</option>
          <option value="Girls">Girls</option>
        </select>

        <label>Price</label>
        <input
          name="price"
          value={formData.price}
          onChange={handleChange}
          
        />

        <label>Location</label>
        <input
          name="location"
          value={formData.location}
          onChange={handleChange}
          
        />

        {/* // local area  */}
        <label>Local Address</label>
        <input
          name="localAddress"
          value={formData.localAddress}
          onChange={handleChange}
          
        />

        <label>Area Size</label>
        <input
          name="area"
          value={formData.area}
          onChange={handleChange}
          
        />

        {/* // Available from */}
        <label>Available From</label>
        <input
          type="text"
          name="availableFrom"
          value={formData.availableFrom}
          onChange={handleChange}
          
        />

        {/* // property info */}
        <label>Property Info</label>
        <textarea
          name="propertyInfo"
          value={formData.propertyInfo}
          onChange={handleChange}
          
        />

        {/* // property age */}
        <label>Property Age</label>
        <input
          type="text"
          name="propertyAge"
          value={formData.propertyAge}
          onChange={handleChange}
          
        />

        {/* // property facing */}
        <label>Property Facing</label>
        <input
          type="text"
          name="propertyFacing"
          value={formData.propertyFacing}
          onChange={handleChange}
          
        />

        {/* // property floor */}
        <label>Property Floor</label>
        <input
          type="text"
          name="propertyFloor"
          value={formData.propertyFloor}
          onChange={handleChange}
          
        />

        {/* // property total floor */}
        <label>Property Total Floor</label>
        <input
          type="text"
          name="propertyTotalFloor"
          value={formData.propertyTotalFloor}
          onChange={handleChange}
          
        />

        {/* // Agreement dropdown */}
        <label>Agreement</label>
        <select
          name="agreement"
          value={formData.agreement}
          onChange={handleChange}
          
        >
          <option value="">Select Agreement</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>

        <label>Google Map Link</label>
        <input
          type="text"
          name="googleMapLink"
          value={formData.googleMapLink}
          onChange={handleChange}
          
        />

        <label>Google Drive Image Link</label>
        <input
          type="text"
          name="googldriveimage"
          value={formData.googldriveimage}
          onChange={handleChange}
          
        />

        <label>Google Drive Video Link</label>
        <input
          type="text"
          name="gooogledrivevideo"
          value={formData.gooogledrivevideo}
          onChange={handleChange}
          
        />

        <label>Amenities</label>
        <Select
          isMulti
          options={amenityOptions}
          value={formData.amenities}
          onChange={(selectedOptions) =>
            setFormData({ ...formData, amenities: selectedOptions || [] })
          }
        />

        <label>Features</label>
        <Select
          isMulti
          options={featureOptions}
          value={formData.features}
          onChange={(selectedOptions) =>
            setFormData({ ...formData, features: selectedOptions || [] })
          }
        />

        <label className="aminities">Images ( Add minimum 3 Images ) </label>
        <input type="file" multiple onChange={handleImageChange} />

        <div className="image-preview">
          {imagePreviews.length > 0 ? (
            imagePreviews.map((src, index) => (
              <div className="image-thumbnail" key={index}>
                <img src={src} alt="Preview" />
                <button
                  type="button"
                  className="delete-btn"
                  onClick={() => handleImageDelete(index)}
                >
                  X
                </button>
              </div>
            ))
          ) : (
            <p>No images to display</p>
          )}
        </div>

        <div className="form-group-btn">
          <button type="submit">
            {propertyId ? "Update Property" : "Add Property"}
          </button>
          <button type="button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </form>
    </div>
  );
};

export default PropertyForm;
