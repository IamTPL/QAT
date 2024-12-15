// import createApiClient from "./config/api.service";
import createApiClient from "./config/api.auth.service";
import { convertDateToMMDDYYYY } from "../helpers/dateFormats/dateFormats";
class AdminDocumentService {
  // constructor(baseURL = `${import.meta.env.VITE_API_URL}/api/v1/admins`) {
  //     this.apiClient = createApiClient(baseURL);
  // }

  constructor(baseURL = `/api/v1/admins`) {
    this.apiClient = createApiClient(baseURL);
  }

  updateHeaders(newHeaders) {
    this.apiClient.defaults.headers = {
      ...this.apiClient.defaults.headers,
      ...newHeaders,
    };
  }

  async getAll(params, type = "statement") {
    try {
      if (type) {
        params["type_of_doc"] = type;
      }
      const response = await this.apiClient.get("/search_docs", {
        params,
      });
      console.log("Service response: ", response);
      return response;
    } catch (error) {
      console.error("Error fetching all statements:", error);
      throw error;
    }
  }

  //reset statement
  async resetFile(documentId) {
    const reqData = {
      document_id: documentId,
      user_id: `${import.meta.env.VITE_USER_ID_TEST}`,
    };
    try {
      const response = await this.apiClient.post("/reset_result", reqData);
      console.log(
        "Service Document Result Bank Statement Response: ",
        response
      );
      return response;
    } catch (error) {
      console.error("Error fetching all document result statments:", error);
      throw error;
    }
  }

  async deleteSelected(data, type) {
    console.log("deleting.....: ", data);

    try {
      let params = {};
      if (type) {
        params["type_of_doc"] = type;
      }
      const response = await this.apiClient.post("/destroy_multiple", data, {
        params,
      });
      return response;
    } catch (error) {
      console.error("Error deleting selected statements:", error);
    }
  }

  //get PDF file
  async getPDF(document_id) {
    let params = {};
    params["document_id"] = document_id;
    // params["user_id"] = `${import.meta.env.VITE_USER_ID_TEST}`;
    try {
      const response = await this.apiClient.get("/show_pdf", {
        params,
        responseType: "blob",
      });
      console.log("Response from back-end", response);
      return response;
    } catch (error) {
      console.error("Error connect back-end", error);
      throw error;
    }
  }

  //convert selected statements
  async convertStatementSelected(documentIds) {
    let reqData = {
      user_id: `${import.meta.env.VITE_USER_ID_TEST}`,
      document_ids: documentIds,
    };
    try {
      const response = await this.apiClient.post("/convert_statement", reqData);
      return response;
    } catch (error) {
      console.error("Error converting selected statements:", error);
    }
  }

  //convert selected checks
  async covertCheckSelected(documentIds) {
    let reqData = {
      user_id: `${import.meta.env.VITE_USER_ID_TEST}`,
      document_ids: documentIds,
    };
    console.log("reqData: ", reqData);
    try {
      const response = await this.apiClient.post("/convert_check", reqData);
      return response;
    } catch (error) {
      console.error("Error converting selected checks:", error);
    }
  }

  //check status of converting
  async checkStatusConverting(documentIds) {
    let reqData = {
      user_id: `${import.meta.env.VITE_USER_ID_TEST}`,
      document_ids: documentIds,
    };
    try {
      const response = await this.apiClient.post("/status", reqData);
      return response;
    } catch (error) {
      console.error("Error checking status of converting:", error);
    }
  }

  setQuery(page, pageSize, searchObject, sortObject) {
    let params = {};
    if (page >= 0) params["page_id"] = page;
    if (pageSize > 0) params["page_size"] = pageSize;
    if (searchObject) {
      if (searchObject.name) params["original_name"] = searchObject.name;
      if (
        searchObject.status &&
        searchObject.status != [] &&
        searchObject.status.length > 0
      ) {
        params["status"] = searchObject.status.join(",");
      }
      if (searchObject.startDate)
        params["start_date"] = convertDateToMMDDYYYY(searchObject.startDate);
      if (searchObject.endDate)
        params["end_date"] = convertDateToMMDDYYYY(searchObject.endDate);
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
        if (filteredKey == "dateUpload") {
          params["sort"] = `created_at,${filteredValue}`;
        } else if (filteredKey == "name") {
          params["sort"] = `original_name,${filteredValue}`;
        } else if (filteredKey == "userName") {
          params["sort"] = `full_name,${filteredValue}`;
        } else {
          params["sort"] = `${filteredKey},${filteredValue}`;
        }
      }
    }
    // params["user_id"] = `${import.meta.env.VITE_USER_ID_TEST}`;
    console.log("resquest query: ", params);
    return params;
  }
}

export default new AdminDocumentService();
