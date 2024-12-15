import { PlusCircleOutlined } from "@ant-design/icons";
import { useState, useEffect, useRef } from "react";
import { Popover } from "antd";
import UploadStatus from "../../Statuses/UploadStatus/UploadStatus";
import StatusRender from "../../AdmManagement/StatusRender/StatusRender";

const StatusDropdown = ({
  statusList,
  selectedStatusList,
  onStatusChange,
  parent,
}) => {
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (
      selectedStatusList &&
      JSON.stringify(selectedStatus) !== JSON.stringify(selectedStatusList)
    ) {
      setSelectedStatus(selectedStatusList);
    }
  }, [selectedStatusList]);

  useEffect(() => {
    if (typeof onStatusChange === "function") {
      onStatusChange(selectedStatus);
      //   onBlurDropdown();
    }
  }, [selectedStatus]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Close dropdown when clicking outside
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  //handle status selection
  const handleStatusSelection = (statusId) => {
    setSelectedStatus((previousSelectedStatus) => {
      if (previousSelectedStatus.includes(statusId)) {
        return previousSelectedStatus.filter(
          (selectedStatus) => selectedStatus !== statusId
        );
      } else {
        return [...previousSelectedStatus, statusId];
      }
    });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="px-4 py-2 bg-white border border-dashed border-gray-300 rounded-md shadow-sm focus:outline-none text-sm font-semibold hover:bg-gray-100"
      >
        <PlusCircleOutlined className="mr-2" />
        Status
        {selectedStatus.length > 0 && (
          <Popover
            content={
              <ul>
                {selectedStatus.map((status) => (
                  <li key={status} className="px-4 py-2">
                    {parent === "dashboard" ? (
                      <UploadStatus status={status} />
                    ) : (
                      <StatusRender status={status}></StatusRender>
                    )}
                  </li>
                ))}
              </ul>
            }
            placement="top"
            trigger="hover"
          >
            <span className=""> | </span>
            <span className="ml-1 text-sm font-normal bg-gray-200 px-2 py-1 rounded-md">
              {selectedStatus.length} selected
            </span>
          </Popover>
        )}
      </button>
      {isOpen && (
        <div className="absolute mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          <ul className="py-2">
            {statusList.map((status) => (
              <li
                key={status.id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                onClick={(e) => {
                  if (e.target.tagName !== "INPUT") {
                    handleStatusSelection(status.id);
                  }
                }}
              >
                <input
                  type="checkbox"
                  id={status.id}
                  className="mr-2 cursor-pointer accent-orange-400"
                  checked={selectedStatus.includes(status.id)}
                  onChange={() => {
                    handleStatusSelection(status.id);
                  }}
                  readOnly
                />
                <span>{status.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default StatusDropdown;
