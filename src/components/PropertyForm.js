import React, { useState, useEffect } from "react";
import Select from "react-select";
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
    subtype: "",
    status: "",
    availableFor: "",
    price: "",
    location: "",
    localAddress: "",
    area: "",
    googleDriveImage: "",
    googleDriveVideo: "",
    googleMapLink: "",
    availableFrom: "",
    propertyInfo: "",
    propertyAge: "",
    propertyFacing: "",
    propertyFloor: "",
    propertyTotalFloor: "",
    agreement: "",
    amenities: [],
    features: [],
    images: [],
  });

  const subtypeOptions = {
    Rent: [
      // Commercial shops , Commercial plots , Row houses , commercial office , commercial Godown , Flats  
      { value: "commercial-shops", label: "Commercial Shops" },
      { value: "commercial-plots", label: "Commercial Plots" },
      { value: "row-houses", label: "Row Houses" },
      { value: "commercial-office", label: "Commercial Office" },
      { value: "commercial-godown", label: "Commercial Godown" },
      { value: "flats", label: "Flats" },
  
    ],
    Residential: [
      // flat , Row houses  , plot 
      { value: "flat", label: "Flat" },
      { value: "row-houses", label: "Row Houses" },
      { value: "plot", label: "Plot" },
    ],
    Land: [
  
      { value: "residential", label: "Residential" },
      { value: "agricultural", label: "Agricultural" },
      { value: "commercial", label: "Commercial" },
      { value: "industrial", label: "Industrial" },
      { value: "na", label: "NA" },
      { value: "r-zone", label: "R Zone" },
      { value: "green-zone", label: "Green Zone" },
      { value: "gauthan", label: "Gauthan" },
     
    ],
  };

  const [deletedImages, setDeletedImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const amenityOptions = [
    { value: "Street Lights", label: "Street Lights" },
    { value: "Roads", label: "Roads" },
    {
      value: "Light & Drainage Facilities",
      label: "Light & Drainage Facilities",
    },
    { value: "Demarcation", label: "Demarcation" },
    { value: "Compound Fencing", label: "Compound Fencing" },
    { value: "Barbed wire fencing", label: "Barbed wire fencing" },
    { value: "Open space", label: "Open space" },
    { value: "Swimming Pool", label: "Swimming Pool" },
    { value: "Gym", label: "Gym" },
    { value: "Parking", label: "Parking" },
    { value: "Visitor Parking", label: "Visitor Parking" },
    { value: "Security", label: "Security" },
    { value: "Lift", label: "Lift" },
    { value: "Club House", label: "Club House" },
    { value: "Power Backup", label: "Power Backup" },
    { value: "Electricity", label: "Electricity" },
    { value: "Water Supply", label: "Water Supply" },
    { value: "Gas Pipeline", label: "Gas Pipeline" },
    { value: "Pet Friendly", label: "Pet Friendly" },
    { value: "Intercom", label: "Intercom" },
    { value: "Fire Safety", label: "Fire Safety" },
    { value: "Rain Water Harvesting", label: "Rain Water Harvesting" },
    { value: "Sewage Treatment Plant", label: "Sewage Treatment Plant" },
    { value: "Garden", label: "Garden" },
    { value: "Indoor Games", label: "Indoor Games" },
    // Add the following code to the PropertyForm component:
    //  Barbed wire fencing, Open space
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
  ];
  useEffect(() => {
    if (propertyId) {
      getPropertyById(propertyId).then((data) => {
        setFormData({
          ...data,
          amenities: data.amenities?.map((a) => ({ value: a, label: a })) || [],
          features: data.features?.map((f) => ({ value: f, label: f })) || [],
        });

        setImagePreviews(data.images?.map((image) => image.url) || []);
      });
    }
  }, [propertyId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "type" && { subtype: "" }), // Reset subtype when type changes
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    // Store image files
    setImageFiles([...imageFiles, ...files]);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const handleImageDelete = (index) => {
    const imageToDelete = formData.images[index];

    // If the image is an existing one (has a URL), store it for deletion
    if (typeof imageToDelete === "object" && imageToDelete.url) {
      setDeletedImages([...deletedImages, imageToDelete.url]);
    }

    // Remove the image from both form data and preview
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: updatedImages });

    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const amenities = formData.amenities.map((a) => a.value).join(", ");
    const features = formData.features.map((f) => f.value).join(", ");

    const updatedImages = [
      ...formData.images.filter(
        (image) => typeof image === "object" && image.url
      ), // Keep existing images
      ...imageFiles, // New files
    ];

    const data = {
      ...formData,
      amenities,
      features,
      images: updatedImages,
      deletedImages, // Send deleted images list
    };

    try {
      if (propertyId) {
        await updateProperty(propertyId, data);
      } else {
        await addProperty(data);
      }

      onSuccess();
      alert("Property saved successfully!");
    } catch (error) {
      console.error("Error saving property:", error);
      alert(error.message || "Failed to save property");
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
        <input name="title" value={formData.title} onChange={handleChange} />

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
          required
        >
          <option value="">Select Property Type</option>
          {Object.keys(subtypeOptions).map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        {formData.type && subtypeOptions[formData.type] && (
          <>
            <label>Subtype</label>
            <select
              name="subtype"
              value={formData.subtype}
              onChange={handleChange}
            >
              <option value="">Select Subtype</option>
              {subtypeOptions[formData.type].map((sub) => (
                <option key={sub.value} value={sub.value}>
                  {sub.label}
                </option>
              ))}
            </select>
          </>
        )}

        <label>Status</label>
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="">Select Property Status</option>
          <option value="Available">Available</option>
          <option value="Not Available">Not Available</option>
          <option value="Sold">Sold</option>
          <option value="Upcoming">Upcoming</option>
          <option value="New Launch">New Launch</option>

        </select>

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
        <input name="price" value={formData.price} onChange={handleChange} />

        <label>Location</label>
        <input
          name="location"
          value={formData.location}
          onChange={handleChange}
        />

        <label>Local Address</label>
        <input
          name="localAddress"
          value={formData.localAddress}
          onChange={handleChange}
        />

        <label>Area Size</label>
        <input name="area" value={formData.area} onChange={handleChange} />

        <label>Available From</label>
        <input
          name="availableFrom"
          value={formData.availableFrom}
          onChange={handleChange}
        />

        <label>Property Info (Add line by line)</label>
        <textarea
          name="propertyInfo"
          value={formData.propertyInfo}
          onChange={handleChange}
        />

        <label>Property Age</label>
        <input
          name="propertyAge"
          value={formData.propertyAge}
          onChange={handleChange}
        />

        <label>Property Facing</label>
        <input
          name="propertyFacing"
          value={formData.propertyFacing}
          onChange={handleChange}
        />

        <label>Property Floor</label>
        <input
          name="propertyFloor"
          value={formData.propertyFloor}
          onChange={handleChange}
        />

        <label>Property Total Floor</label>
        <input
          name="propertyTotalFloor"
          value={formData.propertyTotalFloor}
          onChange={handleChange}
        />

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

        <label> Google Drive Image</label>
        <input
          name="googleDriveImage"
          value={formData.googleDriveImage}
          onChange={handleChange}
        />

        <label>Google Drive Video</label>
        <input
          name="googleDriveVideo"
          value={formData.googleDriveVideo}
          onChange={handleChange}
        />

        <label>Google Map Link</label>
        <input
          name="googleMapLink"
          value={formData.googleMapLink}
          onChange={handleChange}
        />

        <label>Amenities</label>
        <Select
          isMulti
          name="amenities"
          options={amenityOptions}
          value={formData.amenities}
          onChange={(selected) =>
            setFormData({ ...formData, amenities: selected })
          }
        />

        <label>Features</label>
        <Select
          isMulti
          name="features"
          options={featureOptions}
          value={formData.features}
          onChange={(selected) =>
            setFormData({ ...formData, features: selected })
          }
        />

        <label>Images ( Add maximum 3 images )</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
        />

        <div className="image-previews">
          {imagePreviews.length > 0 ? (
            imagePreviews.map((image, index) => (
              <div key={index} className="image-preview">
                <img src={image} alt="Preview" />
                <button
                  className="delete-btn"
                  type="button"
                  onClick={() => handleImageDelete(index)}
                >
                  X
                </button>
              </div>
            ))
          ) : (
            <p>No images selected</p>
          )}
        </div>

        <button type="submit">Save Property</button>
      </form>
    </div>
  );
};

export default PropertyForm;
