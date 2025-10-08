import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

const reviewApi = axios.create({
  baseURL: `${API_URL}/reviews`,
});

export const getReviews = async ({ page = 1, limit = 20 } = {}) => {
  const res = await reviewApi.get(``, { params: { page, limit } });
  return res.data;
};

export const addReview = async ({ name, message, rating }) => {
  const res = await reviewApi.post(``, { name, message, rating });
  return res.data;
};


