import React, { useCallback, useEffect, useRef, useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import ModalUpload from "../../components/Dashboard/UploadFile/PopUpUploadFile/ModalUpload";
import ActionDropdown from "../../components/Dashboard/ActionDropdown/ActionDropdown";
import UploadStatus from "../../components/Statuses/UploadStatus/UploadStatus";
import FilterBar from "../../components/Dashboard/Filter/FilterBar";
import DocumentService from "../../services/api.document.service";
import AdminDocumentService from "../../services/api.document-admin.service";
import DocumentResultStatementService from "../../services/api.document-result-statement.service";
import { useNavigate } from "react-router-dom";
import ActionButtons from "../../components/Dashboard/ActionButtonBar/ActionButtons";
import { Button, Dropdown, Empty, Pagination, Table } from "antd";
import { CaretDownOutlined, CheckOutlined } from "@ant-design/icons";
import SortableHeader from "../../components/Dashboard/ViewDropdown/SortableHeader/SortableHeader";
import "./DashBoardStyle.css";
import { message } from "antd";
import { useAuth } from "../../context/AuthContext";

const DashBoard = () => {
  const { user } = useAuth();
  const ApiClass =
    user.role === "admin" ? AdminDocumentService : DocumentService;
  const navigate = useNavigate();
  const currentProcessingChecks = useRef([]);
  const [items, setItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedOption, setSelectedOption] = useState(10);
  const options = [10, 20, 30, 40, 50];
  const [selectedColumns, setSelectedColumns] = useState({
    Status: true,
    "Date Upload": true,
    Actions: true,
  });
  const [searchObject, setSearchObject] = useState({
    name: "",
    status: [],
    startDate: null,
    endDate: null,
  });
  const [activeSortColumn, setActiveSortColumn] = useState(false);
  const [sortState, setSortState] = useState({
    name: null,
    userName: null,
    status: null,
    dateUpload: null,
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 10,
    totalPage: 0,
  });
  const [isMessageVisible, setIsMessageVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const retrieveData = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = ApiClass.setQuery(
        pagination.currentPage,
        pagination.itemsPerPage,
        searchObject,
        sortState
      );
      const response = await ApiClass.getAll(params);
      console.log("Response:", response);
      if (response.data.documents.length === 0 && pagination.currentPage > 1) {
        updatePagination("currentPage", 1);
      }
      updatePageData(response.data);
      currentProcessingChecks.current = [];
      updateProcessItems(response.data.documents);
    } catch (error) {
      console.error(error);
    }
  }, [
    pagination.currentPage,
    pagination.itemsPerPage,
    searchObject,
    sortState,
  ]);

  const updatePagination = (key, value) => {
    setPagination((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const updatePageData = (data) => {
    if (data?.num_of_pages >= 0) {
      updatePagination("totalPage", data.num_of_pages);
    }
    if (data?.page_id && pagination.currentPage !== data.page_id) {
      updatePagination("currentPage", data.page_id);
    }
    if (data?.page_size && pagination.itemsPerPage !== data.page_size) {
      updatePagination("itemsPerPage", data.page_size);
    }
    if (data?.documents) {
      console.log("Data documents:", data.documents);

      setItems(data.documents);
    }
    setIsLoading(false);
  };

  const handleCheckItem = (id) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((itemId) => itemId !== id)
        : [...prevSelected, id]
    );
  };

  const handleSortChange = (column, direction) => {
    setSortState({
      name: null,
      status: null,
      dateUpload: null,
      [column]: direction,
    });
    setActiveSortColumn(false);
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({
      ...prev,
      currentPage: page,
    }));
  };

  //footer pagination
  const setPaginationFields = (updates) => {
    setPagination((prev) => ({
      ...prev,
      ...updates,
    }));
  };
  const handleMenuClick = (e) => {
    setSelectedItems([]);
    setSelectedOption(parseInt(e.key, 10));
    setPaginationFields({
      itemsPerPage: parseInt(e.key, 10),
      currentPage: 1,
    });
  };

  const menuItems = options.map((option) => ({
    key: option.toString(),
    label: (
      <span>
        {option} {selectedOption === option && <CheckOutlined />}
      </span>
    ),
  }));

  const renderFooter = () => (
    <div className="flex justify-between items-center">
      <span className="text-gray-500">
        Rows selected: {selectedItems.length}
      </span>
      <div className="flex items-center gap-14">
        <span className="text-gray-500">
          Rows per page:{" "}
          <Dropdown
            menu={{
              items: menuItems,
              onClick: handleMenuClick,
            }}
            trigger={["click"]}
          >
            <Button className="button-row-per-page">
              {selectedOption} <CaretDownOutlined />
            </Button>
          </Dropdown>
        </span>
        <Pagination
          current={pagination.currentPage}
          pageSize={pagination.itemsPerPage}
          total={pagination.totalPage * pagination.itemsPerPage}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      </div>
    </div>
  );

  const columns = [
    {
      title: (
        <input
          type="checkbox"
          onChange={(e) => {
            if (e.target.checked) {
              const allIds = items
                .slice(0, pagination.itemsPerPage)
                .map((item) => item.id);
              setSelectedItems(allIds);
            } else {
              setSelectedItems([]);
            }
          }}
          checked={
            selectedItems.length ===
            items.slice(0, pagination.itemsPerPage).length
          }
          className="w-4 h-4 accent-orange-400 cursor-pointer"
        />
      ),
      dataIndex: "select",
      key: "select",
      width: "5%",
      render: (_, record) => (
        <input
          type="checkbox"
          value={record.id}
          checked={selectedItems.includes(record.id)}
          onChange={() => handleCheckItem(record.id)}
          className="w-4 h-4 accent-orange-400 cursor-pointer"
        />
      ),
    },
    {
      title: () => (
        <SortableHeader
          title="Name"
          columnKey="name"
          activeSortColumn={activeSortColumn}
          sortState={sortState}
          setActiveSortColumn={setActiveSortColumn}
          handleSortChange={handleSortChange}
        />
      ),
      dataIndex: "original_name",
      key: "name",
      width: "45%",
      ellipsis: true,
      render: (text, record) => (
        <span
          onClick={() => {
            if (record.status === "success") {
              navigate(`/statement-review/${record.id}`);
            } else {
              if (!isMessageVisible) {
                setIsMessageVisible(true);
                message.error("Document is not converted yet", 1.5);
                setTimeout(() => {
                  setIsMessageVisible(false);
                }, 1500);
              }
            }
          }}
          className="hover:underline cursor-pointer text-[15px] truncate"
        >
          {text}
        </span>
      ),
    },
    ...(user.role === "admin"
      ? [
          {
            title: () => (
              <SortableHeader
                title="User Name"
                columnKey="userName"
                activeSortColumn={activeSortColumn}
                sortState={sortState}
                setActiveSortColumn={setActiveSortColumn}
                handleSortChange={handleSortChange}
              />
            ),
            dataIndex: "full_name",
            key: "user_name",
            width: "14%",
            ellipsis: true,
            render: (text) => text,
          },
        ]
      : []),

    ...["Status", "Date Upload", "Actions"]
      .map(
        (column) =>
          selectedColumns[column] && {
            title:
              column === "Status" ? (
                <SortableHeader
                  title="Status"
                  columnKey="status"
                  activeSortColumn={activeSortColumn}
                  sortState={sortState}
                  setActiveSortColumn={setActiveSortColumn}
                  handleSortChange={handleSortChange}
                />
              ) : column === "Date Upload" ? (
                <SortableHeader
                  title="Date Upload"
                  columnKey="dateUpload"
                  activeSortColumn={activeSortColumn}
                  sortState={sortState}
                  setActiveSortColumn={setActiveSortColumn}
                  handleSortChange={handleSortChange}
                />
              ) : (
                "Actions"
              ),
            dataIndex:
              column === "Status"
                ? "status"
                : column === "Date Upload"
                ? "created_at"
                : "actions",
            key: column,
            width: "12%",
            render:
              column === "Status"
                ? (status) => <UploadStatus status={status} />
                : column === "Date Upload"
                ? (date) => <span className="text-[15px]">{date}</span>
                : (_, record) => (
                    <ActionDropdown
                      status={record.status}
                      onDeleteItem={() =>
                        handleDelete(record.id, record.status)
                      }
                      onDownloadItem={() => handleDownloadItem(record.id)}
                      onConvertItem={() => handleConvertItem(record.id)}
                    />
                  ),
          }
      )
      .filter(Boolean),
  ];

  //Local Storage Selected Column
  useEffect(() => {
    const saveSelectedColumns = localStorage.getItem("selectedColumns/");
    if (saveSelectedColumns) {
      setSelectedColumns(JSON.parse(saveSelectedColumns));
    }
  }, []);

  useEffect(() => {
    setSelectedItems([]);
    retrieveData();
  }, [
    searchObject,
    pagination.currentPage,
    pagination.itemsPerPage,
    sortState,
  ]);

  //handle actions buttons
  const [messageApi, contextHolder] = message.useMessage();

  const showSuccess = () => {
    messageApi.open({
      type: "success",
      content: "Success",
    });
  };
  const showWarning = (message) => {
    messageApi.open({
      type: "warning",
      content: message,
      duration: 5,
    });
  };

  //delete selected items
  const handleDeleteSelectedItems = async () => {
    let hasProcessingItems = false;
    let deletedItemsRequest = {
      documents: [],
    };

    items.forEach((item) => {
      if (selectedItems.includes(item.id)) {
        if (item.status === "processing") {
          hasProcessingItems = true;
        }
        deletedItemsRequest.documents.push({
          id: item.id,
          status: item.status,
        });
      }
    });
    const response = await ApiClass.deleteSelected(deletedItemsRequest);

    if (response && response.status === 200) {
      retrieveData();
      setSelectedItems([]);
      showSuccess();
    }

    if (hasProcessingItems) {
      showWarning("Processing items cannot be deleted");
    }
  };

  //download selected items
  const handleDownloadSelectedItems = async () => {
    const hasSuccessItems = items.some(
      (item) => selectedItems.includes(item.id) && item.status !== "success"
    );
    if (hasSuccessItems) {
      showWarning("Only success items can be downloaded");
      setSelectedItems([]);
    }
    await DocumentResultStatementService.downloadXLSXFiles(selectedItems);
    setSelectedItems([]);
    showSuccess();
  };

  const handleDownloadItem = async (id) => {
    try {
      await DocumentResultStatementService.downloadXLSXFiles([id]);
      setSelectedItems([]);
      showSuccess();
    } catch (error) {
      showWarning("Error downloading file");
    }
  };

  const updateItemStatus = (id, newStatus) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    );
  };

  const updateProcessItems = (dataItems) => {
    // console.log('Current Items:', currentProcessingChecks.current);

    const needDeleteItems = [];
    dataItems.forEach((item) => {
      if (item.status === "processing") {
        if (!currentProcessingChecks.current.includes(item.id)) {
          currentProcessingChecks.current.push(item.id);
        }
      } else {
        // console.log('Need Removing item from processing:', item.id);
        needDeleteItems.push(item.id);
      }
    });

    // Remove items that no longer need processing
    currentProcessingChecks.current = currentProcessingChecks.current.filter(
      (id) => !needDeleteItems.includes(id)
    );

    console.log(
      "Updated currentProcessingChecks after update:",
      currentProcessingChecks.current
    );

    if (currentProcessingChecks.current.length > 0) {
      console.log("Calling requestIntervalTask");
      requestIntervalTask();
    }
  };

  const requestIntervalTask = () => {
    const interval = setInterval(async () => {
      if (currentProcessingChecks.current.length === 0) {
        console.log("Interval stopped because no items to process");
        clearInterval(interval);
      } else {
        const documentIds = currentProcessingChecks.current;
        console.log("Calling backend with document IDs:", documentIds);
        const response = await DocumentService.checkStatusConverting(
          documentIds
        );

        if (response && response.data) {
          console.log(
            "Check status converting response:",
            response.data.result
          );
          response.data.result.forEach((item) => {
            if (item.status !== "processing") {
              updateItemStatus(item.document_id, item.status);
              currentProcessingChecks.current =
                currentProcessingChecks.current.filter(
                  (id) => id !== item.document_id
                );
            }
          });
        }
      }
    }, 7000);
  };

  const handleConvertSelectedItems = async () => {
    let isShowWarning = false;
    let isNeedRetrieveData = false;
    const newAndFailedItems = items.filter(
      (item) =>
        selectedItems.includes(item.id) &&
        (item.status === "new" || item.status === "failed")
    );
    if (
      newAndFailedItems.length === 0 ||
      newAndFailedItems.length !== selectedItems.length
    ) {
      isShowWarning = true;
    }
    if (newAndFailedItems.length > 0) {
      const documentIds = newAndFailedItems.map((item) => item.id);
      try {
        const response = await DocumentService.convertStatementSelected(
          documentIds
        );
        console.log("Convert selected items response", response);

        if (response.data.response.documents.length > 0) {
          showSuccess();
          isNeedRetrieveData = true;
        }
        if (response.data.response.documents_error.length > 0) {
          isShowWarning = true;
          isNeedRetrieveData = true;
        }
      } catch (error) {
        console.error(error);
      }
    }
    if (isShowWarning) {
      showWarning("Only new and failed items can be converted");
    }
    if (isNeedRetrieveData) {
      retrieveData();
    }
    setSelectedItems([]);
  };

  const handleConvertItem = async (id) => {
    try {
      const response = await DocumentService.convertStatementSelected([id]);

      if (
        response.data.response &&
        response.data.response.documents.length > 0
      ) {
        showSuccess();
        updateItemStatus(id, "processing");
        updateProcessItems([{ id: id, status: "processing" }]);
        retrieveData();
      } else {
        showWarning("Only new and failed items can be converted");
        retrieveData();
      }
    } catch (error) {
      console.error(error);
      showWarning("Only new and failed items can be converted");
    }
  };

  //delete single item
  const handleDelete = async (id, status) => {
    const deletedItemsRequest = {
      documents: [{ id: id, status: status }],
    };
    const response = await ApiClass.deleteSelected(deletedItemsRequest);
    if (response && response.status === 200) {
      setSelectedItems([]);
      retrieveData();
      showSuccess();
    }
  };

  useEffect(() => {
    return () => {
      currentProcessingChecks.current = [];
    };
  }, []);

  const handleChangeMenuSidebar = () => {
    currentProcessingChecks.current = [];
  };

  const handleCloseModalUpload = (isNeedRetrieveData = false) => {
    console.log("Close Modal Upload");
    if (isNeedRetrieveData) {
      retrieveData();
    }
    setIsModalOpen(false);
  };

  return (
    <div className="dashboard_page px-8 flex">
      <Sidebar onChangeMenuSidebar={handleChangeMenuSidebar} />
      <div className="dashboard-right-side min-h-[93vh] flex-1 py-8 pl-12 pr-8">
        <h1 className="text-3xl font-bold mb-2 mt-2">
          Bank Statement Converter
        </h1>
        <h2 className="text-lg text-gray-600">
          Manage and view your documents
        </h2>
        <div className="flex justify-between items-center py-2 border-gray-300">
          <FilterBar
            externalQuery={searchObject}
            onChangeExternalQuery={setSearchObject}
            onSubmit={retrieveData}
          />
          <ActionButtons
            showModal={() => setIsModalOpen(true)}
            selectedColumns={selectedColumns}
            setSelectedColumns={setSelectedColumns}
            selectedItems={selectedItems}
            onDeleteSelectedItems={handleDeleteSelectedItems}
            onDownloadSelectedItems={handleDownloadSelectedItems}
            onConvertSelectedItems={handleConvertSelectedItems}
          />
        </div>

        <Table
          dataSource={items}
          columns={columns}
          pagination={false}
          footer={renderFooter}
          loading={isLoading}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_DEFAULT}
                description="No result"
              />
            ),
          }}
          headerColor="rgb(242, 244, 246)"
          rowKey="id"
        />
      </div>
      {/* Upload modal */}
      {isModalOpen && (
        <ModalUpload
          onClose={(isNeedRetrieveData) =>
            handleCloseModalUpload(isNeedRetrieveData)
          }
          typeOfDoc={"statement"}
        />
      )}
      {contextHolder}
    </div>
  );
};

export default DashBoard;
