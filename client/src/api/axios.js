// axios.js — Configured Axios instance with JWT interceptor
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor — attach JWT token for admin routes
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor — handle 401 globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("admin_token");
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  },
);

// ─── Vendor APIs ───────────────────────────────────────────
export const getVendors = (params) => API.get("/vendors", { params });
export const getVendorById = (id) => API.get(`/vendors/${id}`);
export const createVendor = (data) => API.post("/vendors", data);
export const updateVendor = (id, data) => API.put(`/vendors/${id}`, data);
export const deleteVendor = (id) => API.delete(`/vendors/${id}`);

// ─── District APIs ─────────────────────────────────────────
export const getDistricts = () => API.get("/districts");
export const createDistrict = (data) => API.post("/districts", data);
export const updateDistrict = (id, data) => API.put(`/districts/${id}`, data);
export const deleteDistrict = (id) => API.delete(`/districts/${id}`);

// ─── Category APIs ─────────────────────────────────────────
export const getCategories = () => API.get("/categories");
export const createCategory = (data) => API.post("/categories", data);
export const updateCategory = (id, data) => API.put(`/categories/${id}`, data);
export const deleteCategory = (id) => API.delete(`/categories/${id}`);

// ─── Admin APIs ────────────────────────────────────────────
export const adminLogin = (credentials) =>
  API.post("/admin/login", credentials);

// ─── Image Upload (Cloudinary via backend) ─────────────────
export const uploadImage = (formData) =>
  API.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// ─── Email to Vendor ────────────────────────────────────────
export const sendVendorEmail = (data) => API.post("/send-email", data);

export default API;
