import axios from "axios";

// Initialize Axios instance
const api = axios.create({
  baseURL: "http://localhost:5000/api", // Replace with your base API URL
  withCredentials: true, // Include cookies if refresh token is stored in cookies
});

// Helper function to get the `accessToken` from user-info
const getAccessToken = () => {
  const userInfo = JSON.parse(localStorage.getItem("user-info"));
  return userInfo?.accessToken || null;
};

// Helper function to update the `accessToken` in user-info
const updateAccessToken = (newAccessToken) => {
  const userInfo = JSON.parse(localStorage.getItem("user-info"));
  if (userInfo) {
    userInfo.accessToken = newAccessToken;
    localStorage.setItem("user-info", JSON.stringify(userInfo));
  }
};

// Request interceptor to add `Authorization` header
api.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is due to an expired access token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Call the refresh token endpoint
        const response = await axios.post(
          "http://localhost:5000/refresh-token", // Refresh token endpoint
          {},
          { withCredentials: true } // Include refresh token in the request
        );

        const newAccessToken = response.data.accessToken;

        // Update the access token in user-info
        updateAccessToken(newAccessToken);

        // Retry the original request with the new access token
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Failed to refresh token:", refreshError);

        // Redirect to login if refresh fails
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
