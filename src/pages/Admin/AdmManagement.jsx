import React, { useReducer, useEffect, useCallback, useState } from "react";
import {
  Table,
  Button,
  Input,
  Dropdown,
  Pagination,
  message,
  Flex,
  Modal,
} from "antd";
import {
  PlusOutlined,
  CheckOutlined,
  CaretDownOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import UserManagementService from "../../services/api.user-management.service";
import StatusDropdown from "../../components/Dashboard/StatusDropdown/StatusDropdown";
import ActionUserDropdown from "../../components/AdmManagement/ActionUserDropdown/ActionUserDropdown";
import StatusRender from "../../components/AdmManagement/StatusRender/StatusRender";
import ModalCreateUser from "../../components/AdmManagement/Modals/ModalCreateUser";
import ModalEditUser from "../../components/AdmManagement/Modals/ModalEditUser";
import SortableHeader from "../../components/Dashboard/ViewDropdown/SortableHeader/SortableHeader";
import "./AdmPageStyle.css";
import {
  admManagementReducer,
  initialState,
} from "../../reducers/admManagementReducer";

const AdmManagement = () => {
  const [state, dispatch] = useReducer(admManagementReducer, initialState);
  const options = [10, 20, 30, 40, 50];
  const [inputName, setInputName] = useState("");

  const statusList = [
    {
      id: "active",
      name: "Active",
    },
    {
      id: "waiting",
      name: "Waiting",
    },
    {
      id: "disabled",
      name: "Disabled",
    },
    {
      id: "expired",
      name: "Expired",
    },
  ];
  // const userEditing = useRef({ id: null, fullName: null });
  const [idEditing, setIdEditing] = useState(null);
  const [nameEditing, setNameEditing] = useState(null);

  const retrieveUsers = useCallback(async () => {
    try {
      dispatch({ type: "SET_IS_LOADING", payload: true });
      const params = UserManagementService.setQuery(
        state.pagination.currentPage,
        state.pagination.itemsPerPage,
        state.searchObject,
        state.sortState
      );
      const response = await UserManagementService.getAll(params);
      console.log("Response: ", response);
      if (
        response.data.users.length === 0 &&
        state.pagination.currentPage > 1
      ) {
        dispatch({
          type: "UPDATE_PAGINATION",
          payload: { currentPage: 1 },
        });
      }
      updatePageData(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, [state.pagination, state.searchObject, state.sortState]);

  const updatePageData = (data) => {
    if (data?.num_of_pages >= 0) {
      dispatch({
        type: "UPDATE_PAGINATION",
        payload: { totalPage: data.num_of_pages },
      });
    }
    console.log("dâta:", data);
    console.log("data current page", data.page_id);
    console.log("state current page", state.pagination.currentPage);
    if (data?.page_id && state.pagination.currentPage !== data.page_id) {
      console.log("data.page_id:", data.page_id);
      dispatch({
        type: "UPDATE_PAGINATION",
        payload: { currentPage: data.page_id },
      });
    }
    if (data?.page_size && state.pagination.itemsPerPage !== data.page_size) {
      dispatch({
        type: "UPDATE_PAGINATION",
        payload: { itemsPerPage: data.page_size },
      });
    }
    if (data?.users) {
      dispatch({ type: "SET_USERS", payload: data.users });
    }
    dispatch({ type: "SET_IS_LOADING", payload: false });
  };

  const handleActiveSortColumn = (columnKey) => {
    const activeSortColumn =
      state.activeSortColumn == columnKey ? false : columnKey;
    dispatch({ type: "SET_ACTIVE_SORT_COLUMN", payload: activeSortColumn });
  };

  const handleSortChange = (columnKey, direction) => {
    dispatch({
      type: "UPDATE_SORT_STATE",
      payload: { [columnKey]: direction },
    });
    dispatch({ type: "SET_ACTIVE_SORT_COLUMN", payload: false });
  };

  const handlePageChange = (page, pageSize) => {
    dispatch({
      type: "UPDATE_PAGINATION",
      payload: { currentPage: page, itemsPerPage: pageSize },
    });
  };

  const handleSearchSubmit = (e) => {
    dispatch({
      type: "UPDATE_SEARCH_OBJECT",
      payload: { fullName: e.target.value },
    });
  };

  const handleStatusChange = (selectedStatusList) => {
    dispatch({
      type: "UPDATE_SEARCH_OBJECT",
      payload: { status: selectedStatusList },
    });
    console.log("Selected status: ", state.searchObject);
  };

  const handleMenuClick = (e) => {
    dispatch({
      type: "SET_SELECTED_ITEM_PER_PAGE",
      payload: parseInt(e.key, 10),
    });
    dispatch({
      type: "UPDATE_PAGINATION",
      payload: {
        itemsPerPage: parseInt(e.key, 10),
        currentPage: 1,
      },
    });
  };

  const listItemsPerPage = options.map((option) => ({
    key: option.toString(),
    label: (
      <span>
        {option} {state.selectedItemPerPage === option && <CheckOutlined />}
      </span>
    ),
  }));

  //resend email
  const handleResend = async (email) => {
    try {
      await UserManagementService.resendEmail(email);
      message.success("Email sent successfully");
      retrieveUsers();
    } catch (error) {
      console.log("Error resending email: ", error);
    }
  };

  //change status
  const handleChangeStatus = async (id, status) => {
    try {
      status = status === "active" ? "disabled" : "active";
      await UserManagementService.updateStatus(id, status);
      message.success("Status changed successfully");
      retrieveUsers();
    } catch (error) {
      console.log("Error changing status: ", error);
    }
  };

  //delete user
  const handleDelete = async (id) => {
    try {
      const userDocsResponse =
        await UserManagementService.checkValidateToDeleteUser(id);
      if (!userDocsResponse.data.has_doc) {
        Modal.confirm({
          title: "Are you sure you want to delete this user?",
          content: "Deleting this user will remove all its data.",
          okText: "Delete",
          okType: "danger",
          cancelText: "No",
          onOk: async () => {
            try {
              await UserManagementService.delete(id);
              message.success("User deleted successfully");
              retrieveUsers();
            } catch (error) {
              message.error("Error deleting user");
            }
          },
        });
      } else {
        Modal.confirm({
          title: "You can not delete this user who has documents !",
          content: (
            <>
              <p className="mt-4 text-gray-500">
                Please delete all documents of this user before deleting!
              </p>
              <p className="text-gray-500">
                Or you can <span className="font-bold">disable</span> this user!
              </p>
            </>
          ),
          okText: "Disable",
          okType: "danger",
          cancelText: "No",
          onOk: async () => {
            try {
              handleChangeStatus(id, "active");
            } catch (error) {
              message.error("Error disable user");
              console.log("Error disable user:", error);
            }
          },
        });
      }
    } catch (error) {
      message.error("Error check user has doc");
      console.log("Error check has doc:", error);
    }
  };

  //handle create User
  const onCreate = async (values) => {
    try {
      const { email, username } = values;
      await UserManagementService.createAccount(username, email);
      message.success("User created successfully");
      dispatch({ type: "SET_IS_MODAL_CREATE_OPEN", payload: false });
      retrieveUsers();
    } catch (error) {
      console.error("Error creating user:", error.response.data.error);
      message.error(error.response.data.error);
    }
  };

  // handle close modal create user
  const onCloseModalCreateUser = () => {
    dispatch({ type: "SET_IS_MODAL_CREATE_OPEN", payload: false });
  };

  // handle update user
  const handleUpdateUser = async (nameUpdate) => {
    try {
      const userId = idEditing;
      console.log("nameUpdate:", nameUpdate);

      await UserManagementService.update(userId, nameUpdate);
      message.success("User updated successfully");
      dispatch({ type: "SET_IS_MODAL_EDIT_OPEN", payload: false });
      retrieveUsers();
    } catch (error) {
      console.error("Error updating user:", error.response.data.error);
      message.error(error.response.data.error);
    }
  };

  // handle close modal edit user
  const onCloseModalEditUser = () => {
    dispatch({ type: "SET_IS_MODAL_EDIT_OPEN", payload: false });
  };

  //handle open modal edit user
  const onEditUser = (userId, fullName) => {
    // userEditing.current.id = userId;
    // userEditing.current.fullName = fullName;
    setIdEditing(userId);
    setNameEditing(fullName);
    dispatch({ type: "SET_IS_MODAL_EDIT_OPEN", payload: true });
  };

  // handle reset filter Status
  const handleReset = useCallback(() => {
    dispatch({
      type: "UPDATE_SEARCH_OBJECT",
      payload: {
        fullName: "",
        status: [],
      },
    });
    setInputName("");
  }, []);

  //handle enable reset button when filtered
  useEffect(() => {
    if (state.searchObject.status.length > 0 || inputName) {
      dispatch({ type: "SET_IS_RESET_ENABLED", payload: true });
    } else {
      dispatch({ type: "SET_IS_RESET_ENABLED", payload: false });
    }
  }, [state.searchObject]);

  useEffect(() => {
    retrieveUsers();
  }, [
    state.pagination.currentPage,
    state.pagination.itemsPerPage,
    state.searchObject,
    state.sortState,
  ]);

  const columns = [
    {
      title: (
        <SortableHeader
          title="Full Name"
          columnKey="fullName"
          activeSortColumn={state.activeSortColumn}
          sortState={state.sortState}
          handleActiveSortColumn={handleActiveSortColumn}
          handleSortChange={handleSortChange}
        />
      ),
      dataIndex: "full_name",
      key: "name",
      width: "16.66%",
      ellipsis: true,
      render: (text) => <span>{text}</span>,
    },
    {
      title: (
        <SortableHeader
          title="Email"
          columnKey="email"
          activeSortColumn={state.activeSortColumn}
          sortState={state.sortState}
          handleActiveSortColumn={handleActiveSortColumn}
          handleSortChange={handleSortChange}
        />
      ),
      dataIndex: "email",
      key: "email",
      width: "23.32%",
      ellipsis: true,
    },
    {
      title: (
        <SortableHeader
          title="Status"
          columnKey="status"
          activeSortColumn={state.activeSortColumn}
          sortState={state.sortState}
          handleActiveSortColumn={handleActiveSortColumn}
          handleSortChange={handleSortChange}
        />
      ),
      dataIndex: "status",
      key: "status",
      width: "16.66%",
      render: (text) => <StatusRender status={text}></StatusRender>,
    },
    {
      title: (
        <SortableHeader
          title="Created At"
          columnKey="createdAt"
          activeSortColumn={state.activeSortColumn}
          sortState={state.sortState}
          handleActiveSortColumn={handleActiveSortColumn}
          handleSortChange={handleSortChange}
        />
      ),
      dataIndex: "created_at",
      key: "createdAt",
      width: "16.66%",
    },
    {
      title: (
        <SortableHeader
          title="Updated At"
          columnKey="updatedAt"
          activeSortColumn={state.activeSortColumn}
          sortState={state.sortState}
          handleActiveSortColumn={handleActiveSortColumn}
          handleSortChange={handleSortChange}
        />
      ),
      dataIndex: "updated_at",
      key: "updatedAt",
      width: "16.66%",
    },
    {
      title: "Action",
      key: "action",
      width: "10%",
      render: (_, record) => (
        <ActionUserDropdown
          status={record.status}
          onDeleteItem={() => handleDelete(record.user_id)}
          onChangeStatus={() =>
            handleChangeStatus(record.user_id, record.status)
          }
          onResendItem={() => handleResend(record.email, record.full_name)}
          onEditUser={() => onEditUser(record.user_id, record.full_name)}
        />
      ),
    },
  ];

  const renderFooter = () => (
    <div className="flex justify-end items-center">
      <div className="flex items-center gap-14">
        <span className="text-gray-500">
          Rows per page:{" "}
          <Dropdown
            menu={{
              items: listItemsPerPage,
              onClick: handleMenuClick,
            }}
            trigger={["click"]}
          >
            <Button className="button-row-per-page">
              {state.selectedItemPerPage} <CaretDownOutlined />
            </Button>
          </Dropdown>
        </span>
        <Pagination
          current={state.pagination.currentPage}
          pageSize={state.pagination.itemsPerPage}
          total={state.pagination.totalPage * state.pagination.itemsPerPage}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      </div>
    </div>
  );

  return (
    <div className="admin-management py-8 px-24">
      <h1 className="text-3xl font-bold mb-2 mt-2">User Management</h1>
      <p>Manage and view accounts</p>
      <Flex style={{ marginBottom: 16 }} justify="space-between">
        <Flex gap={12}>
          <Input
            value={inputName}
            onChange={(e) => {
              setInputName(e.target.value);
            }}
            placeholder="Enter full name or email..."
            onBlur={handleSearchSubmit}
            style={{ width: 200 }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearchSubmit(e);
              }
            }}
          />
          <StatusDropdown
            statusList={statusList}
            selectedStatusList={state.searchObject.status}
            onStatusChange={handleStatusChange}
            parent="user-management"
          />
          {state.isResetEnabled && (
            <button
              className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none text-sm font-semibold"
              onClick={() => handleReset()}
            >
              Reset
              <CloseOutlined className="ml-2" />
            </button>
          )}
        </Flex>
        <Button
          icon={<PlusOutlined />}
          onClick={() => {
            dispatch({
              type: "SET_IS_MODAL_CREATE_OPEN",
              payload: true,
            });
          }}
          className="primary-button"
          style={{ color: "white" }}
        >
          Add User
        </Button>
      </Flex>
      <Table
        rowKey="user_id"
        columns={columns}
        dataSource={state.users}
        loading={state.isLoading}
        footer={renderFooter}
        pagination={false}
      />
      {/* Modal Create User */}
      {state.isCreateUserModalOpen && (
        <ModalCreateUser
          isCreateUserModalOpen={state.isCreateUserModalOpen}
          onCreate={onCreate}
          onCloseModalCreateUser={onCloseModalCreateUser}
        ></ModalCreateUser>
      )}
      {/* Modal Edit User */}
      {state.isEditUserModalOpen && (
        <ModalEditUser
          isEditUserModalOpen={state.isEditUserModalOpen}
          onCloseModalEditUser={onCloseModalEditUser}
          onUpdate={handleUpdateUser}
          userFullName={nameEditing}
          setUserFullName={setNameEditing}
        ></ModalEditUser>
      )}
    </div>
  );
};

export default AdmManagement;
