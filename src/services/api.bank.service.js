import createApiClient from "./config/api.auth.service";

class BankService {
  // constructor(baseURL = `${import.meta.env.VITE_API_URL}/api/v1/banks`) {
  //   this.apiClient = createApiClient(baseURL);
  // }

  constructor(baseURL = `/api/v1/banks`) {
    this.apiClient = createApiClient(baseURL);
  }

  async getAllForSelect() {
    try {
      const response = await this.apiClient.get("/index");
      console.log("Service response: ", response);
      return response;
    } catch (error) {
      console.error("Error fetching all statements:", error);
      throw error;
    }
  }
}

export default new BankService();
