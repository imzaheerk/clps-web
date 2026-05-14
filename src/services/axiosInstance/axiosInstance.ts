import axios from "axios";
import { baseUrl } from "../baseUrl";

const getToken = () => {
  return localStorage.getItem("checknown-token");
};

export const axiosInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
    authorization: `Bearer ${getToken()}`,
  },
});

axiosInstance.interceptors.request.use((config) => {
  config.headers.authorization = `Bearer ${getToken()}`;
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      const currentPath = window.location.pathname;
      if (currentPath !== "/login" && currentPath !== "/signup") {
        localStorage.removeItem("checknown-token");
        localStorage.removeItem("checknown-user");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);
