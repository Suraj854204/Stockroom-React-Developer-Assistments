import axios from "axios";

// One shared Axios instance for the whole app.
// - attaches the login token to every request
// - normalises error handling in one place so components don't
//   each need their own try/catch shape
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://dummyjson.com",
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem("spa_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Normalise every failure into a plain object so UI code never
    // has to know about Axios/HTTP internals.
    const status = error.response?.status;
    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong. Please try again.";

    if (status === 401 && typeof window !== "undefined") {
      // Token missing/expired — clear it so ProtectedRoute sends
      // the user back to login instead of looping on 401s.
      window.localStorage.removeItem("spa_token");
      window.localStorage.removeItem("spa_user");
    }

    return Promise.reject({ status, message, raw: error });
  }
);

export default api;
