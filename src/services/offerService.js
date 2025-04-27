import axios from "axios";

// Get the API base URL from .env
const API_URL = process.env.REACT_APP_API_URL;

// Create an axios instance for offers
const offerApi = axios.create({
  baseURL: `${API_URL}/offers`,
});

// Get all offers (GET /api/offers)
export const getOffers = async () => {
  const res = await offerApi.get("");
  return res.data.offers;
};

// Get a specific offer (GET /api/offers/:id)
export const getOfferById = async (offerId) => {
  const res = await offerApi.get(`/${offerId}`);
  return res.data;
};

// Add a new offer with images (POST /api/offers/add)
export const addOffer = async ({ images = [] } = {}) => {
  const formData = new FormData();
  images.forEach((img) => {
    formData.append("images", img);
  });
  const res = await offerApi.post("/add", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// Update an offer with new images and/or deleted images (PUT /api/offers/:id)
export const updateOffer = async (offerId, { images = [], deletedImages = [] } = {}) => {
  const formData = new FormData();
  images.forEach((img) => {
    formData.append("images", img);
  });
  deletedImages.forEach((url) => {
    formData.append("deletedImages", url);
  });
  const res = await offerApi.put(`/${offerId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// Delete an offer (DELETE /api/offers/:id)
export const deleteOffer = async (offerId) => {
  const res = await offerApi.delete(`/${offerId}`);
  return res.data;
};
