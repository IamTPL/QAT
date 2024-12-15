import createApiClient from "./config/api.auth.service";

class AuthenticationService {
  // constructor(baseURL = `${import.meta.env.VITE_API_URL}/api/v1`) {
  //   this.apiClient = createApiClient(baseURL);
  // }
  constructor(baseURL = `/api/v1`) {
    this.apiClient = createApiClient(baseURL);
  }

  async createAccount(fullName, email) {
    let data = {
      full_name: fullName,
      email: email,
    };
    try {
      const response = await this.apiClient.post("/create_account", data);
      console.log("Service response: ", response);
      return response;
    } catch (error) {
      console.error("Error fetching all statements:", error);
      throw error;
    }
  }

  async logout() {
    try {
      const response = await this.apiClient.post("/logout");
      console.log("Service response: ", response);
      return response;
    } catch (error) {
      console.error("Error fetching all statements:", error);
      throw error;
    }
  }
}

export default new AuthenticationService();
