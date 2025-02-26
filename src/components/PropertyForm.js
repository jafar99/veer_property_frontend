import React, { useState, useEffect, useCallback, useMemo } from "react";
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
  const navigate = useNavigate();
  const { logout } = useAuth();

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

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const subtypeOptions = useMemo(
    () => ({
      Rent: [
        { value: "commercial-shops", label: "Commercial Shops" },
        { value: "commercial-plots", label: "Commercial Plots" },
        { value: "row-houses", label: "Row Houses" },
        { value: "commercial-office", label: "Commercial Office" },
        { value: "commercial-godown", label: "Commercial Godown" },
        { value: "flats", label: "Flats" },
      ],
      Residential: [
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
    }),
    []
  );

  const amenityOptions = useMemo(
    () => [
      { value: "Street Lights", label: "Street Lights" },
      { value: "Roads", label: "Roads" },
      { value: "Swimming Pool", label: "Swimming Pool" },
      { value: "Gym", label: "Gym" },
      { value: "Parking", label: "Parking" },
    ],
    []
  );

  const featureOptions = useMemo(
    () => [
      { value: "Air Conditioning", label: "Air Conditioning" },
      { value: "Fire Safety", label: "Fire Safety" },
      { value: "Balcony", label: "Balcony" },
    ],
    []
  );

  useEffect(() => {
    if (propertyId) {
      setLoading(true);
      getPropertyById(propertyId)
        .then((data) => {
          setFormData({
            ...data,
            type: data.type || "",
            subtype: subtypeOptions[data.type]?.some(
              (sub) => sub.value === data.subtype.toLowerCase()
            )
              ? data.subtype.toLowerCase()
              : "",
            amenities:
              data.amenities?.map((a) => ({ value: a, label: a })) || [],
            features: data.features?.map((f) => ({ value: f, label: f })) || [],
          });
          setImagePreviews(data.images?.map((image) => image.url) || []);
        })
        .finally(() => setLoading(false));
    }
  }, [propertyId, subtypeOptions]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleImageChange = useCallback(
    (e) => {
      const files = Array.from(e.target.files);
      if (files.length + imagePreviews.length > 3) {
        alert("You can upload up to 3 images.");
        return;
      }

      setImageFiles([...imageFiles, ...files]);
      setImagePreviews([
        ...imagePreviews,
        ...files.map((file) => URL.createObjectURL(file)),
      ]);
    },
    [imageFiles, imagePreviews]
  );

  const handleImageDelete = useCallback(
    (index) => {
      const imageToDelete = formData.images[index];

      if (typeof imageToDelete === "object" && imageToDelete.url) {
        setDeletedImages((prev) => [...prev, imageToDelete.url]);
      }

      setFormData((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
      }));
      setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    },
    [formData.images]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formattedData = {
      ...formData,
      amenities: formData.amenities.map((a) => a.value),
      features: formData.features.map((f) => f.value),
      images: [
        ...formData.images.filter((img) => typeof img === "object" && img.url),
        ...imageFiles,
      ],
      deletedImages,
    };

    try {
      if (propertyId) {
        await updateProperty(propertyId, formattedData);
      } else {
        await addProperty(formattedData);
      }
      onSuccess();
      alert("Property saved successfully!");
      navigate(0); // Soft reload
    } catch (error) {
      console.error("Error saving property:", error);
      alert(error.message || "Failed to save property");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="property-container">
      {loading && <p className="loading-text">Loading...</p>}
      <form className="property-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>Title</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
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
          </div>

          {formData.type && subtypeOptions[formData.type] && (
            <div className="form-group">
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
            </div>
          )}

          <div className="form-group">
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
              <option value="Upcoming">Upcoming</option>
            </select>
          </div>

          <div className="form-group">
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
          </div>

          <div className="form-group">
            <label>Price</label>
            <input
              name="price"
              value={formData.price}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Area Size</label>
            <input name="area" value={formData.area} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Available From</label>
            <input
              name="availableFrom"
              value={formData.availableFrom}
              onChange={handleChange}
            />
          </div>

          <div className="form-group full-width">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Property Info</label>
            <textarea
              name="propertyInfo"
              value={formData.propertyInfo}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
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
          </div>

          <div className="form-group">
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
          </div>

          <div className="form-group">
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
          </div>

          <div className="form-group full-width">
            <label>Images (Max 3)</label>
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
                      type="button"
                      className="delete-btn"
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
          </div>
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Saving..." : "Save Property"}
        </button>
      </form>
    </div>
  );
};

export default PropertyForm;
