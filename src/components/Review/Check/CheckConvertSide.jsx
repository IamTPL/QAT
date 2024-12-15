import React, { useCallback, useEffect, useState } from "react";
import { Table, Input, Button, Modal, message } from "antd";
import {
  CloudOutlined,
  DeleteOutlined,
  DownloadOutlined,
  PlusCircleOutlined,
  RedoOutlined,
} from "@ant-design/icons";
import DocumentResultCheckService from "../../../services/api.document-result-check.service";
import DocumentService from "../../../services/api.document.service";
const { confirm } = Modal;

const DEFAULT_HEADERS = [
  "check_number",
  "post_date",
  "date_in_check",
  "pay_to_the_order_of",
  "amount",
  "amount_in_words",
  "memo",
  "account",
];

const CheckConvertSide = ({ pageNumber, documentId }) => {
  const [tableData, setTableData] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  // format header from snake_case to normal text
  const formatHeader = (key) => {
    return key
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Fetch data API
  const fetchTableData = useCallback(async () => {
    try {
      const response = await DocumentResultCheckService.getAll(documentId);
      const fetchedTables = response.data || {};
      const pageData = fetchedTables[pageNumber.toString()] || [];

      // set key for each row
      const formattedData = pageData.map((row, index) => ({
        ...row,
        key: `${pageNumber}-${index}-${Date.now()}`,
      }));
      setTableData(formattedData);
    } catch (error) {
      console.error("Error fetching table data:", error);
    }
  }, [documentId, pageNumber]);

  // handle body table change
  const handleBodyChange = async (e, key, rowKey) => {
    const newValue = e.target.value?.toString().trim() || "";
    const rowIndex = tableData.findIndex((row) => row.key === rowKey);
    const currentValue = tableData[rowIndex]?.[key]?.toString()?.trim() || "";

    if (newValue === currentValue) return;

    setIsSaving(true);
    try {
      // call API update row
      await DocumentResultCheckService.updateRow({
        document_id: documentId,
        page: pageNumber,
        row_index: rowIndex + 1,
        header_key: key,
        new_value: newValue,
      });

      const updatedData = [...tableData];
      updatedData[rowIndex] = {
        ...updatedData[rowIndex],
        [key]: newValue,
      };

      // check row is empty
      const { key: _, ...rowWithoutKey } = updatedData[rowIndex];
      const isRowEmpty = Object.values(rowWithoutKey).every(
        (value) => value === "" || value === null || value === undefined
      );

      if (isRowEmpty) {
        console.log("Deleting row:", rowKey);
        await handleDeleteRow(rowKey);
      } else {
        setTableData(updatedData);
      }
    } catch (error) {
      console.error("Error updating row:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDeleteRow = useCallback((rowKey) => {
    confirm({
      title: "Are you sure ?",
      content: "Deleting this row will remove all its data.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        await handleDeleteRow(rowKey);
      },
      onCancel() {
        console.log("Cancel deletion");
      },
    });
  });

  const handleDeleteRow = async (rowKey) => {
    setIsSaving(true);
    const updatedData = tableData.filter((row) => row.key !== rowKey);
    const rowIndex = tableData.findIndex((row) => row.key === rowKey) + 1;

    try {
      await DocumentResultCheckService.deleteRow(
        documentId,
        pageNumber,
        rowIndex
      );
      setTableData(updatedData);
    } catch (error) {
      console.error("Error deleting row:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddRow = async (index) => {
    setIsSaving(true);

    const newRow = {
      key: `new-${Date.now()}`,
      ...DEFAULT_HEADERS.reduce((acc, header) => {
        acc[header] = "";
        return acc;
      }, {}),
    };

    try {
      await DocumentResultCheckService.insertRow(
        documentId,
        pageNumber,
        index + 1
      );

      const updatedData = [...tableData];
      updatedData.splice(index + 1, 0, newRow);

      setTableData(updatedData);
    } catch (error) {
      console.error("Error adding row:", error);
    } finally {
      setIsSaving(false);
    }
  };

  //handle reset
  const handleReset = async () => {
    confirm({
      title: "Are you sure ?",
      content: "Resetting will erase all changes made to the converted file.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          await DocumentService.resetFile(documentId);
          fetchTableData();
        } catch (error) {
          message.error("Error resetting page");
          console.error("Error resetting page:", error);
        }
      },
      onCancel() {
        console.log("Cancel deletion");
      },
    });
  };

  const columns = DEFAULT_HEADERS.map((key) => {
    let width;
    switch (key) {
      case "check_number":
        width = 110;
        break;
      case "pay_to_the_order_of":
        width = 150;
        break;
      case "amount_in_words":
        width = 170;
        break;
      case "company_name":
        width = 170;
        break;
      case "memo":
        width = 170;
        break;
      default:
        width = 110;
        break;
    }

    return {
      title: <div style={{ textAlign: "center" }}>{formatHeader(key)}</div>,
      dataIndex: key,
      width: width,
      onHeaderCell: () => ({
        style: {
          paddingLeft: "4px",
          paddingRight: "4px",
        },
      }),
      onCell: () => ({
        style: {
          paddingLeft: "4px",
          paddingRight: "4px",
        },
      }),
      render: (text, record) => (
        <Input
          defaultValue={text}
          onBlur={(e) => handleBodyChange(e, key, record.key)}
          title={text}
        />
      ),
    };
  });

  columns.push({
    title: "Action",
    fixed: "right",
    width: 70,
    onHeaderCell: () => ({
      style: {
        paddingLeft: "10px",
        paddingRight: "2px",
      },
    }),
    onCell: () => ({
      style: {
        paddingLeft: "2px",
        paddingRight: "2px",
      },
    }),
    render: (_, record, index) => (
      <div className="flex gap-2">
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleConfirmDeleteRow(record.key)}
        />
        <Button
          type="text"
          style={{ color: "#60a5fa" }}
          icon={<PlusCircleOutlined />}
          onClick={() => handleAddRow(index)}
        />
      </div>
    ),
  });

  const handleDownload = async (documentId) => {
    try {
      await DocumentResultCheckService.downloadXLSXFiles([documentId]);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  useEffect(() => {
    fetchTableData();
  }, [fetchTableData]);

  return (
    <div className="convert_check">
      <h2 className="text-end font-bold mb-4">Page {pageNumber}</h2>
      <div className="flex justify-between items-center mb-4">
        <div className="font-bold">Review (update as necessary)</div>
        <div className="flex gap-4 items-center">
          <span className="px-2 py-1 border rounded-lg text-xs text-gray-500">
            {isSaving ? (
              <>
                <CloudOutlined className="mr-2" />
                Saving...
              </>
            ) : (
              <>
                <CloudOutlined className="mr-2" />
                Saved
              </>
            )}
          </span>
          <button
            className="px-4 py-1 text-sm font-bold bg-gray-100  rounded-lg flex items-center space-x-2"
            onClick={handleReset}
          >
            Reset <RedoOutlined className="ml-2" />
          </button>
          <button
            className="px-4 py-1 text-sm font-bold bg-orange-400 text-white rounded-lg flex items-center space-x-2 hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
            onClick={() => {
              handleDownload(documentId);
            }}
          >
            Download <DownloadOutlined className="ml-2" />
          </button>
        </div>
      </div>
      <div className="mb-4 text-end">
        <span
          className="cursor-pointer mr-4 font-bold text-sm hover:underline text-blue-400"
          onClick={() => handleAddRow(-1)}
        >
          Add First Row
        </span>
      </div>
      <Table
        dataSource={tableData}
        columns={columns}
        rowKey="key"
        pagination={false}
        scroll={{ x: "100%", y: "70vh" }}
      />
    </div>
  );
};

export default CheckConvertSide;
