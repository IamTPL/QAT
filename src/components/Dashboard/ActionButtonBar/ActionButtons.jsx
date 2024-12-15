import { UploadOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import ViewDropdown from '../ViewDropdown/ViewDropdown';
import { Modal } from 'antd';

const ActionButtons = ({
    showModal,
    selectedColumns,
    setSelectedColumns,
    selectedItems,
    onDeleteSelectedItems,
    onDownloadSelectedItems,
    onConvertSelectedItems,
}) => {
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    const showConfirmModal = () => {
        setIsConfirmModalOpen(true);
    };
    const handleOk = () => {
        setIsConfirmModalOpen(false);
        onDeleteSelectedItems();
    };
    const handleCancel = () => {
        setIsConfirmModalOpen(false);
    };
    return (
        <div className="flex items-center space-x-2">
            {/* {contextHolder} */}

            {selectedItems.length > 0 && (
                <>
                    {/*Button Delete*/}
                    <button
                        className="px-4 py-2 bg-red-500 text-white rounded-lg flex items-center space-x-2 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
                        onClick={() => {
                            showConfirmModal();
                        }}
                    >
                        <span>Delete</span>
                    </button>

                    {/*Button Download or combine*/}
                    <button
                        className="px-4 py-2 bg-blue-400 text-white rounded-lg flex items-center space-x-2 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-gray-300"
                        onClick={() => {
                            onDownloadSelectedItems();
                        }}
                    >
                        <span>Download</span>
                    </button>

                    {/*Button Download*/}
                    <button
                        className="px-4 py-2 bg-orange-400 text-white rounded-lg flex items-center space-x-2 hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-gray-300"
                        onClick={() => {
                            onConvertSelectedItems();
                        }}
                    >
                        <span>Convert</span>
                    </button>
                </>
            )}

            {/*Button Upload */}
            {selectedItems.length == 0 && (
                <button
                    className="primary-button px-4 py-2 rounded-lg flex items-center space-x-2"
                    onClick={() => showModal()}
                >
                    <span>Upload files</span>
                    <UploadOutlined />
                </button>
            )}

            {/* Button View */}
            <ViewDropdown
                selectedColumns={selectedColumns}
                setSelectedColumns={setSelectedColumns}
            />
            {/* Modal Confirm Delete Selected */}
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
        </div>
    );
};

export default ActionButtons;
