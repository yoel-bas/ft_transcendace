import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://localhost/api/",
  timeout: 5000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});