// import createApiClient from "./config/api.service";
import createApiClient from "./config/api.auth.service";

class UserManagementService {
  // constructor(baseURL = `${import.meta.env.VITE_API_URL}/api/v1`) {
  //     this.apiClient = createApiClient(baseURL);
  // }

  constructor(baseURL = `/api/v1`) {
    this.apiClient = createApiClient(baseURL);
  }

  async createAccount(fullName, email) {
    let data = {
      fullname: fullName,
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

  async resendEmail(userEmail) {
    try {
      const response = await this.apiClient.post("admins/re_send_email", {
        email: userEmail,
      });
      console.log("Service response: ", response);
      return response;
    } catch (error) {
      console.error("Error fetching all statements:", error);
      throw error;
    }
  }

  async getAll(params) {
    try {
      const response = await this.apiClient.get("/admins/search", {
        params,
      });
      console.log("Service response: ", response);
      return response;
    } catch (error) {
      console.error("Error fetching all statements:", error);
      throw error;
    }
  }

  async checkValidateToDeleteUser(userId) {
    try {
      const response = await this.apiClient.post(
        "admins/check_user_has_documents",
        { user_id: userId }
      );
      console.log("Service response: ", response);
      return response;
    } catch (error) {
      console.error("Error fetching all statements:", error);
      throw error;
    }
  }

  async delete(userId) {
    try {
      const response = await this.apiClient.delete("/admins/destroy", {
        params: { user_id: userId },
      });
      console.log("Service response: ", response);
      return response;
    } catch (error) {
      console.error("Error fetching all statements:", error);
      throw error;
    }
  }

  //change status
  async updateStatus(userId, status) {
    if (status !== "disabled" && status !== "active") {
      throw new Error("Invalid status value");
    }
    try {
      const response = await this.apiClient.patch("/admins/edit", {
        user_id: userId,
        status: status,
      });
      console.log("Service response: ", response);
      return response;
    } catch (error) {
      console.error("Error fetching all statements:", error);
      throw error;
    }
  }

  //update user info
  async update(userId, fullName) {
    try {
      const response = await this.apiClient.patch("/admins/edit", {
        user_id: userId,
        new_name: fullName,
      });
      console.log("Service response: ", response);
      return response;
    } catch (error) {
      console.error("Error fetching all statements:", error);
      throw error;
    }
  }

  setQuery(page, pageSize, searchObject, sortObject) {
    let params = {};
    if (page >= 0) params["page_id"] = page;
    if (pageSize > 0) params["page_size"] = pageSize;
    if (searchObject) {
      if (searchObject.fullName) params["full_name"] = searchObject.fullName;
      if (
        searchObject.status &&
        searchObject.status != [] &&
        searchObject.status.length > 0
      ) {
        params["status"] = searchObject.status.join(",");
      }
    }
    if (sortObject) {
      let filteredKey = null;
      let filteredValue = null;

      for (const [key, value] of Object.entries(sortObject)) {
        if (value !== null) {
          filteredKey = key;
          filteredValue = value;
          break;
        }
      }

      if (filteredKey && filteredValue !== null) {
        if (filteredKey == "createdAt") {
          params["sort"] = `created_at,${filteredValue}`;
        } else if (filteredKey == "fullName") {
          params["sort"] = `full_name,${filteredValue}`;
        } else if (filteredKey == "updatedAt") {
          params["sort"] = `updated_at,${filteredValue}`;
        } else {
          params["sort"] = `${filteredKey},${filteredValue}`;
        }
      }
    }
    console.log("resquest query: ", params);
    return params;
  }
}

export default new UserManagementService();
