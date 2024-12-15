import createApiClient from "./config/api.auth.service";

class DocumentResultStatementService {
  // constructor(baseURL = `${import.meta.env.VITE_API_URL}/api/v1/statement_results`) {
  //   this.apiClient = createApiClient(baseURL);
  // }

  constructor(baseURL = `/api/v1/statement_results`) {
    this.apiClient = createApiClient(baseURL);
  }

  async getPerPage(documentId, documentPage) {
    const params = {
      document_id: documentId,
      page_num: documentPage,
      // user_id: `${import.meta.env.VITE_USER_ID_TEST}`,
    };
    console.log("Service Document Result Statement Params: ", params);
    try {
      const response = await this.apiClient.get("/", { params });
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

  //deleteTable
  async deleteTable(documentId, pageNum, tableIndex) {
    let reqData = {
      document_id: documentId,
      page_num: pageNum,
      tables_index: tableIndex,
      update_index: "1",
    };
    console.log("reqData:", reqData);
    try {
      const response = await this.apiClient.put("/delete_table", reqData);
      console.log("Service Document Result Check Response: ", response);
      return response;
    } catch (error) {
      console.error(`Error updating document result check with:`, error);
      throw error;
    }
  }

  //backend checked
  async updateHeader(path, newValue, documentId, pageNum) {
    let reqData = {
      path: path,
      new_value: newValue,
      document_id: documentId,
      page_num: pageNum,
    };
    console.log("reqData:", reqData);
    try {
      const response = await this.apiClient.put("/edit_header", reqData);
      console.log("Service Document Result Check Response: ", response);
      return response;
    } catch (error) {
      console.error(`Error updating document result check with:`, error);
      throw error;
    }
  }

  //backend checked
  async updateData(path, newValue, documentId, pageNum) {
    let reqData = {
      path: path,
      new_value: newValue,
      document_id: documentId,
      page_num: pageNum,
    };
    console.log("reqData:", reqData);
    try {
      const response = await this.apiClient.put("/edit_data", reqData);
      console.log("Service Document Result Check Response: ", response);
      return response;
    } catch (error) {
      console.error(`Error updating document result check with:`, error);
      throw error;
    }
  }

  //backend checked
  async addRow(tablesIndex, rowsIndex, documentId, pageNum) {
    let reqData = {
      tables_index: tablesIndex,
      update_index: rowsIndex,
      document_id: documentId,
      page_num: pageNum,
    };
    try {
      const response = await this.apiClient.put("/add_row", reqData);
      return response;
    } catch (error) {
      console.error(`Error add row document result check with:`, error);
      throw error;
    }
  }

  //backend checked
  async deleteRow(tablesIndex, rowsIndex, documentId, pageNum) {
    let reqData = {
      tables_index: tablesIndex,
      update_index: rowsIndex,
      document_id: documentId,
      page_num: pageNum,
    };
    try {
      const response = await this.apiClient.put("/delete_row", reqData);
      return response;
    } catch (error) {
      console.error(`Error delete row document result check with:`, error);
      throw error;
    }
  }

  //backend checked
  async deleteHeader(tablesIndex, headerIndex, documentId, pageNum) {
    let reqData = {
      tables_index: tablesIndex,
      update_index: headerIndex,
      document_id: documentId,
      page_num: pageNum,
    };
    try {
      const response = await this.apiClient.put("/delete_header", reqData);
      return response;
    } catch (error) {
      console.error(`Error delete header document result check with:`, error);
      throw error;
    }
  }

  //backend checked
  async addHeader(tablesIndex, headerIndex, documentId, pageNum) {
    let reqData = {
      tables_index: tablesIndex,
      update_index: headerIndex,
      document_id: documentId,
      page_num: pageNum,
    };
    try {
      const response = await this.apiClient.put("/add_header", reqData);
      return response;
    } catch (error) {
      console.error(`Error delete header document result check with:`, error);
      throw error;
    }
  }

  //merge column
  async mergeColumn(tablesIndex, headerIndex, documentId, pageNum, separate) {
    let reqData = {
      tables_index: tablesIndex,
      first_header_idx: headerIndex,
      second_header_idx: headerIndex + 1,
      document_id: documentId,
      page_num: pageNum,
      separate: separate,
    };
    try {
      const response = await this.apiClient.put("/merge_column", reqData);
      return response;
    } catch (error) {
      console.error(`Error merge column statement result with:`, error);
      throw error;
    }
  }

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

export default new DocumentResultStatementService();
