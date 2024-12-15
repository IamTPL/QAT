import {
  DashOutlined,
  DeleteOutlined,
  DownloadOutlined,
  FileSyncOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import { Modal } from "antd";

const ActionDropdown = ({
  onDeleteItem,
  status,
  onDownloadItem,
  onConvertItem,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  const showConfirmModal = () => {
    setIsConfirmModalOpen(true);
  };
  const handleOk = () => {
    setIsConfirmModalOpen(false);
    onDeleteItem();
  };
  const handleCancel = () => {
    setIsConfirmModalOpen(false);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="p-2 rounded-full hover:bg-gray-100 focus:outline-none"
      >
        <DashOutlined />
      </button>
      {isOpen && (
        <div className="absolute top-10 -left-16 w-42 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          <div className="p-2 font-bold text-gray-700 border-b border-gray-200">
            Document actions
          </div>
          <ul className="mb-0">
            {status === "new" && (
              <li
                className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
                onClick={() => onConvertItem()}
              >
                <span className="mr-2">
                  <FileSyncOutlined />
                </span>{" "}
                Convert
              </li>
            )}
            {status === "failed" && (
              <li
                className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
                onClick={() => onConvertItem()}
              >
                <span className="mr-2">
                  <ReloadOutlined />
                </span>{" "}
                Re-run
              </li>
            )}
            {status === "success" && (
              <li
                className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
                onClick={() => onDownloadItem()}
              >
                <span className="mr-2">
                  <DownloadOutlined />
                </span>{" "}
                Download
              </li>
            )}
            {status !== "processing" && (
              <li
                className="p-2 hover:bg-gray-100 cursor-pointer text-red-500 flex items-center"
                onClick={() => showConfirmModal()}
              >
                <span className="mr-2">
                  <DeleteOutlined />
                </span>{" "}
                Delete
              </li>
            )}
            {status === "processing" && (
              <li className="p-2 hover:bg-gray-100 text-sm text-nowrap">
                No actions for processing
              </li>
            )}
          </ul>
        </div>
      )}
      {/* Modal Confirm Delete Selected */}
      <Modal
        title="Are you absolutely sure?"
        open={isConfirmModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{
          className: "primary-button",
        }}
        cancelButtonProps={{
          className: "secondary-button",
        }}
      >
        <p>This action cannot be undone.</p>
      </Modal>
    </div>
  );
};

export default ActionDropdown;
