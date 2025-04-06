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
    nearbyplaces: "",
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
      // Prime Location , Zoning Compliance , Legal Clearances , Infrastructure , Electricity & Water Supply
      // ,Plot Size & Dimensions , Security & Fencing , High ROI , Proximity to Urban Centers , Vastu Compliance
      // , Wide Internal Roads , Water Supply & Drainage System , Electricity Infrastructure , Security & Gated Access
      // ,  Green Spaces & Landscaping , Business & Office Spaces ,  Dedicated Parking Spaces ,  High-Speed Internet Connectivity 
      // , Proximity to Commercial Hubs , Proximity to Commercial Hubs ,  40 & 30 Feet Wide Internal Roads , Street Lights for Proper Illumination
      // , Underground Drainage System , Garden & Landscaping for Relaxation , Well-Developed Roads & Civic Infrastructure , 
      // ,Electricity Connection for Every Plot , Seating Area for Senior Citizens , 24x7 Security & Surveillance ,Children’s Play Gardens
      // MORE AMENITIES
      { value: "Prime Location", label: "Prime Location" },
      { value: "Zoning Compliance", label: "Zoning Compliance" },
      { value: "Legal Clearances", label: "Legal Clearances" },
      { value: "Infrastructure", label: "Infrastructure" },
      { value: "Electricity & Water Supply", label: "Electricity & Water Supply" },
      { value: "Plot Size & Dimensions", label: "Plot Size & Dimensions" },
      { value: "Security & Fencing", label: "Security & Fencing" },
      { value: "High ROI", label: "High ROI" },
      { value: "Proximity to Urban Centers", label: "Proximity to Urban Centers" },
      { value: "Vastu Compliance", label: "Vastu Compliance" },
      { value: "Wide Internal Roads", label: "Wide Internal Roads" },
      { value: "Water Supply & Drainage System", label: "Water Supply & Drainage System" },
      { value: "Electricity Infrastructure", label: "Electricity Infrastructure" },
      { value: "Security & Gated Access", label: "Security & Gated Access" },
      { value: "Green Spaces & Landscaping", label: "Green Spaces & Landscaping" },
      { value: "Business & Office Spaces", label: "Business & Office Spaces" },
      { value: "Dedicated Parking Spaces", label: "Dedicated Parking Spaces" },
      { value: "High-Speed Internet Connectivity", label: "High-Speed Internet Connectivity" },
      { value: "Proximity to Commercial Hubs", label: "Proximity to Commercial Hubs" },
      { value: "40 & 30 Feet Wide Internal Roads", label: "40 & 30 Feet Wide Internal Roads" },
      { value: "Street Lights for Proper Illumination", label: "Street Lights for Proper Illumination" },
      { value: "Underground Drainage System", label: "Underground Drainage System" },
      { value: "Garden & Landscaping for Relaxation", label: "Garden & Landscaping for Relaxation" },
      { value: "Well-Developed Roads & Civic Infrastructure", label: "Well-Developed Roads & Civic Infrastructure" },
      { value: "Electricity Connection for Every Plot", label: "Electricity Connection for Every Plot" },
      { value: "Seating Area for Senior Citizens", label: "Seating Area for Senior Citizens" },
      { value: "24x7 Security & Surveillance", label: "24x7 Security & Surveillance" },
      { value: "Children’s Play Gardens", label: "Children’s Play Gardens" },

      

    ],
    []
  );

  const featureOptions = useMemo(
    () => [
      { value: "Air Conditioning", label: "Air Conditioning" },
      { value: "Fire Safety", label: "Fire Safety" },
      { value: "Balcony", label: "Balcony" },
      { value: "Cable TV", label: "Cable TV" },
      { value: "Internet", label: "Internet" },
      { value: "Microwave", label: "Microwave" },
      { value: "Oven", label: "Oven" },
      { value: "Parking", label: "Parking" },
      { value: "Pool", label: "Pool" },
      { value: "Dishwasher", label: "Dishwasher" },
      { value: "Refrigerator", label: "Refrigerator" },
      { value: "Terrace", label: "Terrace" },
      { value: "Lawn", label: "Lawn" },
      { value: "Garden", label: "Garden" },
      { value: "Gym", label: "Gym" },
      { value: "Security", label: "Security" },
      { value: "Washing Machine", label: "Washing Machine" },
      { value: "Water Supply", label: "Water Supply" },
      { value: "Electricity", label: "Electricity" },
      { value: "Gas", label: "Gas" },
      { value: "CCTV", label: "CCTV" },
      { value: "Fridge", label: "Fridge" },
      { value: "Sofa", label: "Sofa" },
      { value: "Bed", label: "Bed" },
      { value: "Table", label: "Table" },
      { value: "Chair", label: "Chair" },
      { value: "Fan", label: "Fan" },
      { value: "Light", label: "Light" },
      { value: "Curtains", label: "Curtains" },
      { value: "Wardrobe", label: "Wardrobe" },
      { value: "TV", label: "TV" },
      { value: "AC", label: "AC" },
      { value: "Geyser", label: "Geyser" },
      { value: "Dining Table", label: "Dining Table" },
      { value: "Sofa Set", label: "Sofa Set" },
      { value: "Modular Kitchen", label: "Modular Kitchen" },
      { value: "Chimney", label: "Chimney" },
      { value: "Cupboards", label: "Cupboards" },
      { value: "Shoe Rack", label: "Shoe Rack" },
      { value: "Mirror", label: "Mirror" },
      { value: "Study Table", label: "Study Table" },
      { value: "Bookshelf", label: "Bookshelf" },
      { value: "Dressing Table", label: "Dressing Table" },
      { value: "Pooja Room", label: "Pooja Room" },
      { value: "Store Room", label: "Store Room" },
      { value: "Balcony", label: "Balcony" },
      { value: "Terrace", label: "Terrace" },
      { value: "Lift", label: "Lift" },
      { value: "Car Parking", label: "Car Parking" },
      { value: "Bike Parking", label: "Bike Parking" },
      { value: "Power Backup", label: "Power Backup" },
      { value: "Water Storage", label: "Water Storage" },
      { value: "Waste Disposal", label: "Waste Disposal" },
      { value: "Rain Water Harvesting", label: "Rain Water Harvesting" },
      { value: "Security", label: "Security" },
      { value: "Intercom", label: "Intercom" },
      { value: "Fire Fighting Equipment", label: "Fire Fighting Equipment" },
      { value: "Maintenance Staff", label: "Maintenance Staff" },
      { value: "Garden", label: "Garden" },
      { value: "Piped Gas", label: "Piped Gas" },
      { value: "Jogging Track", label: "Jogging Track" },
      { value: "Club House", label: "Club House" },
      { value: "Community Center", label: "Community Center" },
      { value: "Fitness Center", label: "Fitness Center" },
      { value: "Swimming Pool", label: "Swimming Pool" },
      { value: "Tennis Court", label: "Tennis Court" },
      { value: "Badminton Court", label: "Badminton Court" },
      { value: "Basketball Court", label: "Basketball Court" },
      { value: "Indoor Games", label: "Indoor Games" },
      { value: "Yoga Room", label: "Yoga Room" },
      { value: "Kids Play Area", label: "Kids Play Area" },
      { value: "Kids Pool", label: "Kids Pool" },
      { value: "Senior Citizen Sitout", label: "Senior Citizen Sitout" },
      { value: "Library", label: "Library" },
      { value: "Business Center", label: "Business Center" },
      { value: "Cafeteria", label: "Cafeteria" },
      { value: "Food Court", label: "Food Court" },
      { value: "Shopping Center", label: "Shopping Center" },
      { value: "Banquet Hall", label: "Banquet Hall" },
      { value: "Theater", label: "Theater" },
      { value: "Temple", label: "Temple" },
      { value: "Sewage Treatment Plant", label: "Sewage Treatment Plant" },
      { value: "Organic Waste Converter", label: "Organic Waste Converter" },
      { value: "Solar Water Heating", label: "Solar Water Heating" },
      { value: "Solar Lighting", label: "Solar Lighting" },
      { value: "Solar Power", label: "Solar Power" },
      { value: "Rain Water Harvesting", label: "Rain Water Harvesting" },
      { value: "Water Softener Plant", label: "Water Softener Plant" },
      { value: "Water Treatment Plant", label: "Water Treatment Plant" },
      { value: "Landscape Garden", label: "Landscape Garden" },
      { value: "Paved Compound", label: "Paved Compound" },
      { value: "Garbage Chute", label: "Garbage Chute" },
      { value: "Laundromat", label: "Laundromat" },
      { value: "Library", label: "Library" },
      { value: "Mini Theater", label: "Mini Theater" },
      { value: "Multipurpose Hall", label: "Multipurpose Hall" },
      { value: "Party Lawn", label: "Party Lawn" },
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
