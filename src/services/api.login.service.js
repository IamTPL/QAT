import createApiClient from "./config/api.service";

class LoginService {
  // constructor(baseURL = `${import.meta.env.VITE_API_URL}/api/v1`) {
  //   this.apiClient = createApiClient(baseURL);
  // }

  constructor(baseURL = `/api/v1`) {
    this.apiClient = createApiClient(baseURL);
  }

  async login(email, password) {
    let data = {
      email: email,
      password: password,
    };
    try {
      console.log("logging in...");
      const response = await this.apiClient.post("/login", data);
      console.log("Service response: ", response);
      return response;
    } catch (error) {
      console.error("Error fetching all statements:", error);
      throw error;
    }
  }

  async sendResetPasswordEmail(email) {
    let request = {
      email: email,
    };
    try {
      const response = await this.apiClient.post(
        "/send_email/reset_password",
        request
      );
      console.log("Service response: ", response);
      return response;
    } catch (error) {
      console.error("Error fetching all statements:", error);
      throw error;
    }
  }

  async resetPassword(tokenResetPassword, newPassword, confirmPassword) {
    let requestBody = {
      new_password: newPassword,
      confirm_password: confirmPassword,
      token: tokenResetPassword,
    };
    try {
      const response = await this.apiClient.post(
        "/reset_password",
        requestBody
      );
      console.log("Service response: ", response);
      return response;
    } catch (error) {
      console.error("Error fetching all statements:", error);
      throw error;
    }
  }

  async setPassword(tokenSetPassword, newPassword, confirmPassword) {
    let requestBody = {
      new_password: newPassword,
      confirm_password: confirmPassword,
      token: tokenSetPassword,
    };
    try {
      const response = await this.apiClient.post(
        "/active_account",
        requestBody
      );
      console.log("Service response: ", response);
      return response;
    } catch (error) {
      console.error("Error fetching all statements:", error);
      throw error;
    }
  }

  async checkValidateSetPasswordToken(token) {
    try {
      const response = await this.apiClient.get("/active_account", {
        params: { token: token },
      });
      console.log("Service response: ", response);
      return response;
    } catch (error) {
      console.error("Error fetching all statements:", error);
      throw error;
    }
  }

  async checkValidateResetPasswordToken(token) {
    try {
      const response = await this.apiClient.get("/reset_password", {
        params: { token: token },
      });
      console.log("Service response: ", response);
      return response;
    } catch (error) {
      console.error("Error fetching all statements:", error);
      throw error;
    }
  }
}

export default new LoginService();
