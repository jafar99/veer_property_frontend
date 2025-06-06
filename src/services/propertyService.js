import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5001/api",
});

export const getProperties = async () => apiClient.get("/properties");

export const getPropertyById = async (id) => {
  try {
    const response = await apiClient.get(`/properties/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching property:", error);
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
            formData.append("images", image); // Append image file
          } else if (typeof image === "object" && image.url) {
            formData.append("imageUrls", image.url); // Append existing Cloudinary image URL
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

    if (property.deletedImages && property.deletedImages.length > 0) {
      property.deletedImages.forEach((img) => {
        formData.append("deletedImages[]", img);
      });
    }

    Object.keys(property).forEach((key) => {
      if (
        key !== "images" &&
        key !== "existingImages" &&
        key !== "deletedImages"
      ) {
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
    console.error("Error deleting property:", error);
    throw error;
  }
};
