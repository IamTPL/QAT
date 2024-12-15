import React, { useEffect, useState } from "react";
import { Table, Space, Select } from "antd";
import { FileTextOutlined } from "@ant-design/icons";
import BankService from "../../../services/api.bank.service";

const DropFileTable = ({ data, onChangeSelectedBank, isDisabledBank }) => {
  const [selectedBank, setSelectedBank] = useState({});
  const [bankOptions, setBankOptions] = useState([]);

  const retriveBanksForSelect = async () => {
    try {
      const response = await BankService.getAllForSelect();
      if (response.data) {
        setBankOptions(response.data.banks);
      }
      console.log("Response banks: ", response);
    } catch (error) {
      console.log("Error fetching banks: ", error);
    }
  };

  const convertFileSize = (fileSize) =>
    fileSize >= 1000000.0
      ? Number((fileSize / 1000000.0).toFixed(1)) + " MB"
      : Number((fileSize / 1000.0).toFixed(1)) + " KB";

  useEffect(() => {
    onChangeSelectedBank(selectedBank);
  }, [selectedBank]);

  const handleChange = (value, key) => {
    setSelectedBank((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  data = data.map((item, index) => ({
    ...item,
    key: index,
  }));

  const columns = [
    {
      title: "File Name",
      dataIndex: "name",
      key: "name",
      render: (_, record) => (
        <div className="flex gap-4">
          <FileTextOutlined className="text-2xl" />
          <div>
            <div>{record.file.name}</div>
            <div className="text-gray-500 text-sm">
              {convertFileSize(record.file.size)}
            </div>
          </div>
        </div>
      ),
    },
    ...(isDisabledBank
      ? []
      : [
          {
            title: "Bank Name",
            key: "bank",
            render: (_, record) => (
              <div className="flex space-x-2">
                <Space wrap>
                  <Select
                    showSearch
                    placeholder="Select Bank Name..."
                    onChange={(value) => handleChange(value, record.key)}
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={bankOptions.map((option) => ({
                      value: option.id,
                      label: option.name,
                    }))}
                    value={selectedBank[record.key]}
                    style={{
                      width: 200,
                    }}
                  />
                </Space>
              </div>
            ),
          },
        ]),
  ];

  useEffect(() => {
    retriveBanksForSelect();
  }, []);

  return (
    <Table columns={columns} dataSource={data} pagination={{ pageSize: 5 }} />
  );
};

export default DropFileTable;
