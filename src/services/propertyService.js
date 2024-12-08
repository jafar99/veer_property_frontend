import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api',
});

export const getProperties = async () => apiClient.get('/properties');

export const getPropertyById = async (id) => {
  try {
    const response = await apiClient.get(`/properties/${id}`);
    return response;
  } catch (error) {
    console.error('Error fetching property:', error);
    throw error;
  }
};

// Modify addProperty to handle FormData
export const addProperty = async (property) => {
  try {
    const formData = new FormData();
    
    // Append all property fields to formData
    Object.keys(property).forEach(key => {
      if (key !== "images") {
        formData.append(key, property[key]);
      } else {
        // Handle image files array
        property[key].forEach((file) => {
          formData.append('images', file);
        });
      }
    });

    // POST the formData with 'multipart/form-data' content type
    const response = await apiClient.post('/properties', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Automatically handled by Axios when sending FormData
      },
    });
    return response;
  } catch (error) {
    console.error('Error adding property:', error);
    throw error;
  }
};

export const updateProperty = async (id, property) => {
  try {
    const formData = new FormData();
    
    // Append all property fields to formData
    Object.keys(property).forEach(key => {
      if (key !== "images") {
        formData.append(key, property[key]);
      } else {
        // Handle image files array
        property[key].forEach((file) => {
          formData.append('images', file);
        });
      }
    });

    const response = await apiClient.put(`/properties/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    console.error('Error updating property:', error);
    throw error;
  }
};

export const deleteProperty = async (id) => {
  try {
    const response = await apiClient.delete(`/properties/${id}`);
    return response;
  } catch (error) {
    console.error('Error deleting property:', error);
    throw error;
  }
};
