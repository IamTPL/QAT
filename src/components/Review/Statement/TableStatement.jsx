import React, { useCallback } from "react";
import { Table, Input, Button, Modal, Popover } from "antd";
import {
  ArrowRightOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  MoreOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import apiDocumentResultStatementService from "../../../services/api.document-result-statement.service";
const { confirm } = Modal;
import { message } from "antd";

const TableStatement = ({
  data,
  setData,
  columnHeaders,
  setColumnHeaders,
  tableIndex,
  pageNumber,
  documentId,
  setIsSaving,
}) => {
  // handle header table change
  const handleHeaderChange = useCallback(
    async (e, headerIndex) => {
      const newValue = e.target.value?.toString().trim() || "";
      const currentValue = columnHeaders[headerIndex]?.toString()?.trim() || "";

      if (newValue != currentValue) {
        setIsSaving(true);
        // console.log('change header:', newValue);
        try {
          // Call API to update header
          const path = `${tableIndex},${headerIndex}`;
          await apiDocumentResultStatementService.updateHeader(
            path,
            newValue,
            documentId,
            pageNumber
          );
          console.log(pageNumber);

          const updatedHeaders = [...columnHeaders];
          updatedHeaders[headerIndex] = newValue;
          setColumnHeaders(updatedHeaders);

          console.log("Header updated successfully");
        } catch (error) {
          console.error("Error updating header:", error);
        } finally {
          setIsSaving(false);
        }
      }
    },
    [columnHeaders, tableIndex]
  );

  //handle body table change
  const handleBodyChange = useCallback(
    async (e, record, rowIndex, colIndex) => {
      const newValue = e.target.value?.toString().trim() || "";
      const currentValue = record?.[`col_${colIndex}`]?.toString().trim() || "";

      if (newValue != currentValue) {
        setIsSaving(true);
        try {
          const path = `${tableIndex},${rowIndex},${colIndex}`;

          // Call API to update cell value
          await apiDocumentResultStatementService.updateData(
            path,
            newValue,
            documentId,
            pageNumber
          );

          // Update local state after successful API call
          const updatedData = data.map((row, i) =>
            i === rowIndex ? { ...row, [`col_${colIndex}`]: newValue } : row
          );
          console.log("updatedData:", updatedData);

          const isRowEmpty = Object.entries(updatedData[rowIndex])
            .filter(([field]) => field !== "key")
            .every(
              ([, value]) =>
                value === "" || value === null || value === undefined
            );
          if (isRowEmpty) {
            handleDeleteRow(rowIndex);
          } else {
            setData(updatedData);
            console.log("Body cell updated successfully");
          }
        } catch (error) {
          console.error("Error updating body cell:", error);
        } finally {
          setIsSaving(false);
        }
      }
    },
    [data, tableIndex]
  );

  const handleAddColumn = useCallback(async () => {
    setIsSaving(true);

    const newHeader = "New Column"; // Default name for the new column

    try {
      // Call API to add a new column at the end
      await apiDocumentResultStatementService.addHeader(
        tableIndex,
        columnHeaders.length, // Add column at the end
        documentId,
        pageNumber
      );

      // Add the new header to the end of the headers
      const updatedHeaders = [...columnHeaders, newHeader];

      // Add a new column with empty values to all rows in the data
      const updatedData = data.map((row) => ({
        ...row,
        [`col_${columnHeaders.length}`]: "", // Add the new column as the last column
      }));

      // Update state
      setColumnHeaders(updatedHeaders);
      setData(updatedData);

      console.log("Column added successfully at the end");
    } catch (error) {
      console.error("Error adding column:", error);
    } finally {
      setIsSaving(false);
    }
  }, [data, columnHeaders, tableIndex]);

  const handleDeleteColumn = useCallback(
    async (colIndex) => {
      Modal.confirm({
        title: "Are you sure you want to delete this column?",
        content: "Deleting this column will remove all its data.",
        okText: "Yes",
        okType: "danger",
        cancelText: "No",
        onOk: async () => {
          setIsSaving(true);
          try {
            // Call API to delete column
            await apiDocumentResultStatementService.deleteHeader(
              tableIndex,
              colIndex,
              documentId,
              pageNumber
            );

            // Update headers by removing the deleted column
            const updatedHeaders = columnHeaders.filter(
              (_, index) => index !== colIndex
            );
            setColumnHeaders(updatedHeaders);

            // Update data by removing the corresponding column
            const updatedData = data.map((row) => {
              const newRow = { ...row };
              delete newRow[`col_${colIndex}`];

              // Adjust column keys after the deleted column
              Object.keys(newRow).forEach((key) => {
                if (key.startsWith("col_")) {
                  const columnIndex = parseInt(key.split("_")[1], 10);
                  if (columnIndex > colIndex) {
                    newRow[`col_${columnIndex - 1}`] = newRow[key];
                    delete newRow[key];
                  }
                }
              });

              return newRow;
            });
            setData(updatedData);

            console.log(`Column ${colIndex} deleted successfully.`);
          } catch (error) {
            console.error(`Error deleting column ${colIndex}:`, error);
          } finally {
            setIsSaving(false);
          }
        },
      });
    },
    [data, columnHeaders, tableIndex, documentId, pageNumber]
  );

  const handleAddRow = useCallback(
    async (index) => {
      setIsSaving(true);

      // Create a new row with empty values for all columns
      const newRow = columnHeaders.reduce((acc, header, colIndex) => {
        acc[`col_${colIndex}`] = ""; // Initialize each column as an empty string
        return acc;
      }, {});

      try {
        // Call the API to add a new row
        await apiDocumentResultStatementService.addRow(
          tableIndex,
          index + 1,
          documentId,
          pageNumber
        );

        // Update the local state after the API call succeeds
        const updatedData = [...data];
        updatedData.splice(index + 1, 0, newRow);
        setData(updatedData);

        console.log("Row added successfully at index:", index + 1);
      } catch (error) {
        console.error("Error adding row:", error);
      } finally {
        setIsSaving(false);
      }
    },

    [data, tableIndex]
  );

  const handleConfirmDeleteRow = useCallback((indexRowDelete) => {
    confirm({
      title: "Are you sure ?",
      content: "Deleting this row will remove all its data.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        await handleDeleteRow(indexRowDelete);
      },
      onCancel() {
        console.log("Cancel deletion");
      },
    });
  });

  const handleDeleteRow = useCallback(
    async (indexRowDelete) => {
      setIsSaving(true);
      try {
        await apiDocumentResultStatementService.deleteRow(
          tableIndex,
          indexRowDelete,
          documentId,
          pageNumber
        );
        console.log("Row deleted successfully at index:", indexRowDelete);
        const updatedData = data.filter((_, index) => index != indexRowDelete);
        setData(updatedData);
      } catch (error) {
        console.error("Error deleting row:", error);
      } finally {
        setIsSaving(false);
      }
    },
    [data, tableIndex]
  );

  const handleMergeColumn = useCallback(
    async (colIndex) => {
      if (colIndex >= columnHeaders.length - 1) {
        message.error("Cannot merge the last column.");
        return;
      }
      let separator = " ";

      const handleSeparatorChange = (e) => {
        separator = e.target.value;
        console.log("Separator:", separator);
      };

      Modal.confirm({
        title: "Are you sure you want to merge this column with the next one?",
        content: (
          <div>
            <p>This action will combine both columns into one.</p>
            <Input
              placeholder="Enter separator (e.g., -, /, space)"
              onChange={handleSeparatorChange}
            />
          </div>
        ),
        okText: "Yes",
        okType: "danger",
        cancelText: "No",
        onOk: async () => {
          setIsSaving(true);
          try {
            // Call API to merge columns
            const response =
              await apiDocumentResultStatementService.mergeColumn(
                tableIndex,
                colIndex,
                documentId,
                pageNumber,
                separator
              );
            console.log("API Response:", response);

            // Merge Header
            const mergedHeader = `${columnHeaders[colIndex]}${separator}${
              columnHeaders[colIndex + 1]
            }`;
            const updatedHeaders = [...columnHeaders];
            updatedHeaders[colIndex] = mergedHeader;
            updatedHeaders.splice(colIndex + 1, 1);

            console.log("Updated Headers:", updatedHeaders);

            // Merge Body
            const updatedData = data.map((row) => {
              const mergedValue = `${row[`col_${colIndex}`] || ""}${separator}${
                row[`col_${colIndex + 1}`] || ""
              }`.trim();

              const newRow = { ...row };
              newRow[`col_${colIndex}`] = mergedValue;
              delete newRow[`col_${colIndex + 1}`];

              Object.keys(newRow).forEach((key) => {
                if (key.startsWith("col_")) {
                  const columnIndex = parseInt(key.split("_")[1], 10);
                  if (columnIndex > colIndex + 1) {
                    newRow[`col_${columnIndex - 1}`] = newRow[key];
                    delete newRow[key];
                  }
                }
              });

              return newRow;
            });

            setColumnHeaders([...updatedHeaders]);
            setData([...updatedData]);

            console.log(
              `Columns ${colIndex} and ${
                colIndex + 1
              } merged successfully with separator "${separator}".`
            );
          } catch (error) {
            console.error("Error merging columns:", error);
          } finally {
            setIsSaving(false);
          }
        },
      });
    },
    [data, columnHeaders, setColumnHeaders, setData]
  );

  const getContent = useCallback(
    (colIndex) => (
      <>
        <button
          className="text-black block mb-2"
          onClick={() => handleDeleteColumn(colIndex)}
        >
          Delete
          <CloseCircleOutlined className=" ml-2 text-red-500" />
        </button>
        <button
          className="text-black block"
          onClick={() => handleMergeColumn(colIndex)}
        >
          Merge
          <ArrowRightOutlined className="ml-2 text-blue-500" />
        </button>
      </>
    ),
    [handleDeleteColumn, handleMergeColumn]
  );

  const columns = columnHeaders.map((header, colIndex) => ({
    title: (
      <div className="flex items-center">
        <Input
          defaultValue={header}
          onBlur={(e) => handleHeaderChange(e, colIndex)}
          style={{ width: "100%" }}
          title={header}
        />
        <Popover content={getContent(colIndex)} trigger="click">
          <MoreOutlined className="font-bold text-lg hover:text-orange-400" />
        </Popover>
      </div>
    ),
    dataIndex: `col_${colIndex}`,
    width: 150,
    onHeaderCell: () => ({
      style: {
        position: "relative",
        padding: "12px 4px",
      },
    }),
    onCell: () => ({
      style: {
        padding: "12px 4px",
      },
    }),
    render: (text, record, index) => (
      <Input
        defaultValue={text || ""}
        onBlur={(e) => handleBodyChange(e, record, index, `${colIndex}`)}
        style={{ width: "100%" }}
        title={text}
      />
    ),
  }));

  if (data.length > 0)
    columns.push({
      title: "Action",
      dataIndex: "action",
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
      fixed: "right",
      render: (_, record, index) => (
        <div>
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleConfirmDeleteRow(index)}
          />
          <Button
            type="text"
            style={{ color: "#60a5fa" }}
            icon={<PlusCircleOutlined />}
            onClick={() => handleAddRow(index)}
          ></Button>
        </div>
      ),
    });

  console.log("data:", data);
  console.log("tableIndex :", tableIndex);
  return (
    <div>
      <div className="text-end font-bold text-sm  mb-4">
        <span
          className="cursor-pointer mr-4 hover:underline text-blue-400"
          onClick={() => handleAddRow(-1)}
        >
          Add First Row
        </span>
        <span
          className="cursor-pointer mr-4 hover:underline text-orange-400"
          onClick={handleAddColumn}
        >
          Add Column
        </span>
      </div>
      <Table
        // key={columnHeaders.length}
        // key={columnHeaders.join("~.~")}
        key={`${data[0]["col_0"]} + ${columnHeaders.join("~.~")}`}
        dataSource={data}
        columns={columns}
        rowKey="key"
        pagination={false}
        scroll={{ x: "100%", y: "70vh" }}
      />
    </div>
  );
};

export default React.memo(TableStatement);
