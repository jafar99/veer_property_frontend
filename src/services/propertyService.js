import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api',
});

export const getProperties = async () => apiClient.get('/properties');



export const getPropertyById = async (id) => {
  try {
    const response = await apiClient.get(`/properties/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching property:', error);
    throw error;
  }
};
export const addProperty = async (property) => {
  try {
    const formData = new FormData();

    Object.keys(property).forEach((key) => {
      if (key === "images") {
        property.images.forEach((image) => {
          if (image instanceof File) {
            formData.append("images", image); // Append file images
          } else if (typeof image === "object" && image.url) {
            formData.append("imageUrls", image.url); // Append existing image URLs
          }
        });
      } else {
        formData.append(key, property[key]);
      }
    });

    const response = await apiClient.post("/properties/add", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  } catch (error) {
    console.error("Error adding property:", error);
    throw error;
  }
};





export const updateProperty = async (id, property) => {
  try {
    const formData = new FormData();

    Object.keys(property).forEach((key) => {
      if (key === "images") {
        property.images.forEach((img) => {
          if (img instanceof File) {
            formData.append("images", img); // Append new files
          } else {
            formData.append("existingImages", img.url || img); // Add existing images by URL or ID
          }
        });
      } else if (Array.isArray(property[key])) {
        formData.append(key, property[key].map((item) => item.value || item).join(", "));
      } else {
        formData.append(key, property[key]);
      }
    });

    const response = await apiClient.put(`/properties/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  } catch (error) {
    console.error("Error updating property:", error);
    throw error;
  }
};





export const deleteProperty = async (id) => {
  try {
    await apiClient.delete(`/properties/${id}`);
  } catch (error) {
    console.error('Error deleting property:', error);
    throw error;
  }
};
