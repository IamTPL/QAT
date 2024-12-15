import React, { useState } from 'react';
import { Table, Button, Modal } from 'antd';
import {
    DeleteOutlined,
    FileSyncOutlined,
    FileTextOutlined,
} from '@ant-design/icons';

const UploadTable = ({
    data,
    onDeleteDocument,
    onConvertDocument,
    isLoading,
}) => {
    const [fileNeedDelete, setFileNeedDelete] = useState({
        id: '',
        status: '',
    });
    const convertFileSize = (fileSize) =>
        fileSize >= 1000000.0
            ? Number((fileSize / 1000000.0).toFixed(1)) + ' MB'
            : Number((fileSize / 1000.0).toFixed(1)) + ' KB';

    data = data.map((item, index) => ({
        ...item,
        key: index,
    }));

    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    const showConfirmModal = (id, status) => {
        setIsConfirmModalOpen(true);
        setFileNeedDelete({
            id,
            status,
        });
    };
    const handleOk = () => {
        setIsConfirmModalOpen(false);
        onDeleteDocument(fileNeedDelete.id, fileNeedDelete.status);
    };
    const handleCancel = () => {
        setIsConfirmModalOpen(false);
    };
    const columns = [
        {
            title: 'File Name',
            dataIndex: 'originalName',
            key: 'name',
            render: (_, record) => (
                <div className="flex gap-4">
                    <FileTextOutlined className="text-2xl" />
                    <div>
                        <div>{record.original_name}</div>
                        <div className="text-gray-500 text-sm">
                            {convertFileSize(record.file_size)}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (_, record) => (
                <span
                    className={`inline-flex items-center rounded-md px-3 pb-1 text-xs font-medium ring-1 ring-inset ${
                        record.status === 'uploading'
                            ? 'bg-gray-400 text-white ring-gray-500/10'
                            : record.status === 'new'
                            ? 'bg-blue-400 text-white ring-gray-500/10'
                            : record.status === 'processing'
                            ? 'bg-yellow-500 text-white ring-gray-500/10'
                            : record.status === 'success'
                            ? 'bg-green-600 text-white ring-gray-500/10'
                            : 'bg-red-300 text-white ring-gray-500/10'
                    }`}
                >
                    {record.status}
                </span>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <div className="flex space-x-2">
                    {(record.status == 'new' || record.status == 'failed') && (
                        <Button
                            onClick={() => onConvertDocument(record.id)}
                            className="p-2"
                            color="primary"
                            variant="outlined"
                        >
                            <FileSyncOutlined />
                            Convert
                        </Button>
                    )}
                    {(record.status == 'new' ||
                        record.status == 'failed' ||
                        record.status == 'success') && (
                        <Button
                            icon={<DeleteOutlined />}
                            danger
                            type="text"
                            style={{ lineHeight: 'normal' }}
                            onClick={() =>
                                showConfirmModal(record.id, record.status)
                            }
                        />
                    )}
                </div>
            ),
        },
    ];

    return (
        <>
            <Table
                columns={columns}
                dataSource={data}
                pagination={{ pageSize: 5 }}
                loading={isLoading}
            />
            <Modal
                title="Are you absolutely sure?"
                open={isConfirmModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okButtonProps={{
                    className: 'primary-button',
                }}
                cancelButtonProps={{
                    className: 'secondary-button',
                }}
            >
                <p>This action cannot be undone.</p>
            </Modal>
        </>
    );
};

export default UploadTable;
