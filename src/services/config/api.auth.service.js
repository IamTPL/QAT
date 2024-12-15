import axios from "axios";

const commonConfig = {
  headers: {
    "Content-Type": "application/json",
    Accept: "*/*",
  },
};

export default (baseURL) => {
  const axiosInstance = axios.create({
    baseURL,
    ...commonConfig,
  });

  axiosInstance.interceptors.request.use(
    (config) => {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        const obj = JSON.parse(authToken);
        config.headers.Authorization = `Bearer ${obj.token}`;
      }
      console.log("Request Headers: ", config.headers.get("Authorization"));
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403)
      ) {
        console.warn("Unauthorized! Redirecting to login...");
        localStorage.removeItem("authToken");
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
  );
  return axiosInstance;
};
