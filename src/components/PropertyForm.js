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
import { getOffers, addOffer, updateOffer, deleteOffer } from "../services/offerService";
import OfferPanel from "../pages/OfferPanel";

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
    nearbyplaces: "",
    propertyAge: "",
    propertyFacing: "",
    propertyFloor: "",
    propertyTotalFloor: "",
    agreement: "",
    rera: "",
    amenities: "",
    features: "",
    images: [],
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("admin");

  // Offer panel state
  const [offers, setOffers] = useState([]);
  const [offerLoading, setOfferLoading] = useState(false);

  const subtypeOptions = useMemo(
    () => ({
      Rent: [
        { value: "Commercial-shops", label: "Commercial Shops" },
        { value: "Commercial-plots", label: "Commercial Plots" },
        { value: "Row-houses", label: "Row Houses" },
        { value: "Commercial-office", label: "Commercial Office" },
        { value: "Commercial-godown", label: "Commercial Godown" },
        { value: "Flats", label: "Flats" },
      ],
      Residential: [  
        { value: "Flat", label: "Flat" },
        { value: "Row-houses", label: "Row Houses" },
        { value: "Plot", label: "Plot" },
      ],
      Land: [
        { value: "Residential", label: "Residential" },
        { value: "Agricultural", label: "Agricultural" },
        { value: "Commercial", label: "Commercial" },
        { value: "Industrial", label: "Industrial" },
        { value: "NA", label: "NA" },
        { value: "R-zone", label: "R Zone" },
        { value: "Green-zone", label: "Green Zone" },
        { value: "Gauthan", label: "Gauthan" },
      ],
    }),
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
            amenities: Array.isArray(data.amenities)
              ? data.amenities.join(", ")
              : data.amenities || "",
            features: Array.isArray(data.features)
              ? data.features.join(", ")
              : data.features || "",
          });
          setImagePreviews(data.images?.map((image) => image.url) || []);
        })
        .finally(() => setLoading(false));
    }
  }, [propertyId, subtypeOptions]);

  // Fetch offers when Offer tab is selected
  useEffect(() => {
    if (activeTab === "offer") {
      setOfferLoading(true);
      getOffers(propertyId)
        .then((data) => setOffers(data))
        .catch(() => setOffers([]))
        .finally(() => setOfferLoading(false));
    }
  }, [activeTab, propertyId]);

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
      amenities: formData.amenities
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      features: formData.features
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
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
      {/* Tabs */}
      <div className="property-tabs">
        <button
          className={`property-tab${activeTab === "admin" ? " active" : ""}`}
          onClick={() => setActiveTab("admin")}
          type="button"
        >
          Admin Panel
        </button>
        <button
          className={`property-tab${activeTab === "offer" ? " active" : ""}`}
          onClick={() => setActiveTab("offer")}
          type="button"
        >
          Offer Panel
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "admin" ? (
        <>
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

              {/* // localAddress */}

              {/* // property Facing */}

              <div className="form-group">
                <label>Local Address</label>
                <input
                  name="localAddress"
                  value={formData.localAddress}
                  onChange={handleChange}
                />
              </div>

              {/* // googleDriveImage */}

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

              <div className="form-group">
                <label>Property Facing</label>
                <input
                  name="propertyFacing"
                  value={formData.propertyFacing}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Property Age</label>
                <input
                  name="propertyAge"
                  value={formData.propertyAge}
                  onChange={handleChange}
                />
              </div>

              {/* // propertyFloor */}
              <div className="form-group">
                <label>Property Floor</label>
                <input
                  name="propertyFloor"
                  value={formData.propertyFloor}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Total Floor</label>
                <input
                  name="propertyTotalFloor"
                  value={formData.propertyTotalFloor}
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
                <label>Nearby Landmarks</label>
                <textarea
                  name="nearbyplaces"
                  value={formData.nearbyplaces}
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
                <label>Rera Site</label>
                <select name="rera" value={formData.rera} onChange={handleChange}>
                  <option value="">Select Rera site</option>
                  <option value="Rera">Rera</option>
                  <option value="Non Rera">Non Rera</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>google Drive Image</label>
                <input
                  name="googleDriveImage"
                  value={formData.googleDriveImage}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>google Drive Video</label>
                <input
                  name="googleDriveVideo"
                  value={formData.googleDriveVideo}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>google Map Link</label>
                <input
                  name="googleMapLink"
                  value={formData.googleMapLink}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Amenities (Separate with commas)</label>
                <textarea
                  name="amenities"
                  value={formData.amenities}
                  onChange={handleChange}
                  placeholder="Enter amenities separated by commas"
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label>Features (Separate with commas)</label>
                <textarea
                  name="features"
                  value={formData.features}
                  onChange={handleChange}
                  placeholder="Enter features separated by commas"
                  rows="4"
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
        </>
      ) : (
        <OfferPanel propertyId={propertyId} />
      )}
    </div>
  );
};

export default PropertyForm;
