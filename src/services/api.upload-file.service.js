import createApiClient from "./config/api.auth.service";

class UploadFileService {
  // constructor(baseURL = `${import.meta.env.VITE_API_URL}/api/v1/documents`) {
  //   this.apiClient = createApiClient(baseURL);
  //   this.apiClient.defaults.headers["Content-Type"] = "multipart/form-data";
  // }

  constructor(baseURL = `/api/v1/documents`) {
    this.apiClient = createApiClient(baseURL);
    this.apiClient.defaults.headers["Content-Type"] = "multipart/form-data";
  }

  async uploadFile(data) {
    try {
      const response = await this.apiClient.post("/upload", data);
      return response;
    } catch (error) {
      console.error("Error details:", error.config.url);
      console.error("Error upload file service:", error);
      throw error;
    }
  }
}

export default new UploadFileService();
