import createApiClient from "./config/api.auth.service";

class DocumentResultCheckService {
  // constructor(baseURL = `${import.meta.env.VITE_API_URL}/api/v1/check_results`) {
  //   this.apiClient = createApiClient(baseURL);
  // }

  constructor(baseURL = `/api/v1/check_results`) {
    this.apiClient = createApiClient(baseURL);
  }

  async getAll(documentId) {
    const params = {
      document_id: documentId,
    };
    try {
      const response = await this.apiClient.get(`/check_images_review_data`, {
        params,
      });
      console.log(
        "Service Document Result Bank Statement Response: ",
        response
      );
      return response;
    } catch (error) {
      console.error("Error fetching all document result checks:", error);
      throw error;
    }
  }

  async updateRow(data) {
    try {
      const response = await this.apiClient.patch("/edit_data", data);
      console.log("Service Document Result Check Response: ", response);
      return response;
    } catch (error) {
      console.error(`Error updating document result check with:`, error);
      throw error;
    }
  }

  async insertRow(documentId, page, rowIndex) {
    const reqData = {
      document_id: documentId,
      page: page,
      row_index: rowIndex,
    };
    try {
      const response = await this.apiClient.post("/", reqData);
      console.log("Service Document Result Check Response: ", response);
      return response;
    } catch (error) {
      console.error(`Error inserting document result check with:`, error);
      throw error;
    }
  }

  async deleteRow(documentId, page, rowIndex) {
    const reqData = {
      document_id: documentId,
      page: page,
      row_index: rowIndex,
    };
    try {
      const response = await this.apiClient.post("/delete_data", reqData);
      console.log("Service Document Result Check Response: ", response);
      return response;
    } catch (error) {
      console.error(`Error deleting document result check with:`, error);
      throw error;
    }
  }

  //get xlsx file
  async downloadXLSXFile(document_id) {
    let params = {
      document_id: document_id,
      page_num: 0,
    };
    try {
      const response = await this.apiClient.get("/export_xlsx", {
        params,
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `ocr.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error(`Error download xlsx file with:`, error);
      throw error;
    }
  }

  //get xlsx files
  async downloadXLSXFiles(documentIds) {
    let reqData = {
      document_ids: documentIds,
    };
    console.log("documentIds: ", reqData);

    try {
      const response = await this.apiClient.post("/export_xlsx", reqData, {
        responseType: "blob",
      });
      const contentDisposition = response.headers["content-disposition"];
      let fileName = "default-file.xlsx";

      if (contentDisposition) {
        const match = contentDisposition.match(
          /filename\*?=(?:UTF-8'')?(.+?\.(xlsx|zip))/i
        );
        if (match && match[1]) {
          fileName = decodeURIComponent(match[1].replace(/['"]/g, ""));
        }
      }
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error(`Error downloading xlsx file with:`, error);
      throw error;
    }
  }

  setQuery(documentPage) {
    let params = {};
    if (documentPage >= 0) params["page"] = documentPage;
    return params;
  }
}

export default new DocumentResultCheckService();
