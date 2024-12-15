import React, { useState, useEffect } from "react";
import StatusDropdown from "../StatusDropdown/StatusDropdown";
import DateUploadPopup from "../DateUploadPopup/DateUploadPopup";
// import { errorFactory } from "less-loader/dist/utils";
import { Popover } from "antd";
import "./FilterBarStyle.css";
import { CloseOutlined } from "@ant-design/icons";

const initialQueryState = {
  name: "",
  status: [],
  startDate: null,
  endDate: null,
};

const FilterBar = ({ externalQuery, onChangeExternalQuery }) => {
  const [query, setQuery] = useState(initialQueryState);
  const [inputError, setInputError] = useState({
    name: "",
    date: "",
  });
  const [isResetEnabled, setIsResetEnabled] = useState(false);
  const [inputName, setInputName] = useState("");
  const statusList = [
    {
      id: "new",
      name: "New",
    },
    {
      id: "processing",
      name: "Processing",
    },
    {
      id: "success",
      name: "Success",
    },
    {
      id: "failed",
      name: "Failed",
    },
  ];

  useEffect(() => {
    const hasQueryChanged =
      JSON.stringify(query) !== JSON.stringify(initialQueryState);
    setIsResetEnabled(hasQueryChanged);

    if (JSON.stringify(query) !== JSON.stringify(externalQuery)) {
      console.log("Query changed");
      onChangeExternalQuery(query);
    }
  }, [query, externalQuery]);

  useEffect(() => {
    if (externalQuery) {
      if (externalQuery.name) {
        setQuery((previousQuery) => ({
          ...previousQuery,
          name: externalQuery.name,
        }));
      }
      if (externalQuery.status) {
        setQuery((previousQuery) => ({
          ...previousQuery,
          status: externalQuery.status,
        }));
      }
      if (externalQuery.startDate) {
        setQuery((previousQuery) => ({
          ...previousQuery,
          startDate: externalQuery.startDate,
        }));
      }
      if (externalQuery.endDate) {
        setQuery((previousQuery) => ({
          ...previousQuery,
          endDate: externalQuery.endDate,
        }));
      }
    }
  }, [externalQuery]);

  const handleNameChange = (e) => {
    const value = e.target.value;
    setInputName(value);

    if (value.trim().length < 2 && value !== "") {
      setInputError({ name: "Name must be at least 2 characters" });
    } else if (value.length > 50) {
      setInputError({ name: "Name must be less than 50 characters" });
    } else {
      setInputError({ name: "" });
    }
  };

  const handleStatusChange = (selectedStatusList) => {
    setQuery((previousQuery) => ({
      ...previousQuery,
      status: selectedStatusList,
    }));
  };

  const handleDateChange = (selectedStartDate, selectedEndDate) => {
    const today = new Date();
    const isStartDateValid = selectedStartDate && selectedStartDate <= today;
    const isEndDateValid = selectedEndDate && selectedEndDate <= today;

    setInputError({ date: "" });
    if (selectedStartDate && selectedEndDate) {
      if (selectedStartDate > selectedEndDate) {
        setInputError({
          date: "Start date must be earlier than or equal to end date",
        });
        return;
      }
    }

    if (!isStartDateValid && selectedStartDate !== null) {
      setInputError({ date: "Start date must not be later than today" });
      return;
    }

    if (!isEndDateValid && selectedEndDate !== null) {
      setInputError({ date: "End date must not be later than today" });
      return;
    }
    setQuery((previousQuery) => ({
      ...previousQuery,
      startDate: selectedStartDate,
      endDate: selectedEndDate,
    }));
  };

  const handleReset = () => {
    setQuery(initialQueryState);
    setInputError({ name: "", date: "" });
    setInputName("");
  };

  const handleBeforeSubmit = () => {
    if (inputError.name == "") {
      setQuery({ ...query, name: inputName });
    }
    // onSubmit();
  };

  return (
    <div className="flex items-center gap-4 py-4">
      <div>
        <Popover
          content={inputError.name}
          open={!!inputError.name}
          placement="top"
        >
          <input
            type="text"
            placeholder="Filter name..."
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-orange-500"
            value={inputName}
            onChange={handleNameChange}
            onBlur={handleBeforeSubmit}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleBeforeSubmit();
              }
            }}
          />
        </Popover>
      </div>

      <StatusDropdown
        statusList={statusList}
        selectedStatusList={query.status}
        onStatusChange={handleStatusChange}
        parent="dashboard"
      />

      <Popover
        content={inputError.date}
        open={!!inputError.date}
        placement="top"
        overlayClassName="custom-popover"
      >
        <DateUploadPopup
          selectedStartDate={query.startDate}
          selectedEndDate={query.endDate}
          onDateChange={handleDateChange}
          onBlur={handleBeforeSubmit}
        />
      </Popover>

      {isResetEnabled && (
        <button
          className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none text-sm font-semibold"
          onClick={() => handleReset()}
        >
          Reset
          <CloseOutlined className="ml-2" />
        </button>
      )}
    </div>
  );
};

export default FilterBar;
