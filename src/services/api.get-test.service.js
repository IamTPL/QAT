import createApiClient from "./config/api.service";
class TestAPI {
  constructor(
    baseURL = "/w3/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  ) {
    this.apiClient = createApiClient(baseURL);
  }

  async getTest() {
    try {
      const response = await this.apiClient.get("", {
        responseType: "blob",
      });
      console.log("Response from back-end", response);
      return response;
    } catch (error) {
      console.error("Error connect back-end", error);
      throw error;
    }
  }
}

export default new TestAPI();
