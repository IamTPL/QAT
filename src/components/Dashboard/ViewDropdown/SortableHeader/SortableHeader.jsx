import React from "react";
import {
  ArrowDownOutlined,
  ArrowsAltOutlined,
  ArrowUpOutlined,
} from "@ant-design/icons";

const SortableHeader = ({
  title,
  columnKey,
  activeSortColumn,
  sortState,
  setActiveSortColumn,
  handleActiveSortColumn,
  handleSortChange,
}) => {
  const isActive = activeSortColumn === columnKey;

  const handleSortClick = () => {
    setActiveSortColumn &&
      setActiveSortColumn((prevColumn) =>
        prevColumn === columnKey ? false : columnKey
      );
    handleActiveSortColumn && handleActiveSortColumn(columnKey);
  };

  const renderSortIcon = () => {
    if (sortState[columnKey] === "asc") return <ArrowUpOutlined />;
    if (sortState[columnKey] === "desc") return <ArrowDownOutlined />;
    return <ArrowsAltOutlined className="-rotate-45" />;
  };

  const renderSortOptions = () => (
    <div className="absolute mt-2 w-30 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
      <ul className="py-2 mb-0">
        <li
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 text-sm"
          onClick={() => handleSortChange(columnKey, "asc")}
        >
          <ArrowUpOutlined />
          ASC
        </li>
        <li
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 text-sm"
          onClick={() => handleSortChange(columnKey, "desc")}
        >
          <ArrowDownOutlined />
          DESC
        </li>
      </ul>
    </div>
  );

  return (
    <div className="relative">
      <div
        onClick={handleSortClick}
        className="cursor-pointer hover:text-orange-400 select-none"
      >
        {title}
        <span className="pl-2">{renderSortIcon()}</span>
      </div>
      {isActive && renderSortOptions()}
    </div>
  );
};

export default SortableHeader;
