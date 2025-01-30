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
    Object.keys(property).forEach(key => {
      if (key !== "images") {
        formData.append(key, property[key]);
      } else {
        property[key].forEach(file => formData.append('images', file));
      }
    });
    const response = await apiClient.post('/properties', formData);
    return response.data;
  } catch (error) {
    console.error('Error adding property:', error);
    throw error;
  }
};

export const updateProperty = async (id, property) => {
  try {
    const formData = new FormData();

    if (property.existingImages) {
      property.existingImages.forEach((img) => {
        formData.append("existingImages[]", img);
      });
    }

    if (property.images) {
      property.images.forEach((img) => {
        if (img instanceof File) {
          formData.append("images", img);
        }
      });
    }

    Object.keys(property).forEach((key) => {
      if (key !== "images" && key !== "existingImages") {
        formData.append(key, property[key]);
      }
    });

    const response = await apiClient.put(`/properties/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Property updated:", response.data);
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
