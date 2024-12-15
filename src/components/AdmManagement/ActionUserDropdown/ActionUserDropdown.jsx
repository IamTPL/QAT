import React from 'react';
import {
    CheckCircleOutlined,
    DashOutlined,
    DeleteOutlined,
    EditOutlined,
    ReloadOutlined,
    StopOutlined,
} from '@ant-design/icons';
import { Popover } from 'antd';

const ActionUserDropdown = ({
    onDeleteItem,
    status,
    onChangeStatus,
    onResendItem,
    onEditUser,
}) => {
    const menuItems = (
        <div className="w-40">
            <div className="pb-2 font-bold text-gray-700 border-b border-gray-200">
                User actions
            </div>
            <ul className="mb-0">
                {(status === 'expired' || status === 'waiting') && (
                    <li
                        className="p-2 hover:bg-gray-100 text-blue-400 cursor-pointer flex items-center"
                        onClick={() => onResendItem()}
                    >
                        <span className="mr-2">
                            <ReloadOutlined />
                        </span>{' '}
                        Resend
                    </li>
                )}
                {status === 'active' && (
                    <li
                        className="p-2 hover:bg-gray-100 cursor-pointer text-gray-500 flex items-center"
                        onClick={() => onChangeStatus()}
                    >
                        <span className="mr-2">
                            <StopOutlined />
                        </span>{' '}
                        Disable
                    </li>
                )}
                {status === 'disabled' && (
                    <li
                        className="p-2 hover:bg-gray-100 text-green-500 cursor-pointer flex items-center"
                        onClick={() => onChangeStatus()}
                    >
                        <span className="mr-2">
                            <CheckCircleOutlined />
                        </span>{' '}
                        Active
                    </li>
                )}
                <li
                    className="p-2 hover:bg-gray-100 text-yellow-500 cursor-pointer flex items-center"
                    onClick={() => onEditUser()}
                >
                    <span className="mr-2">
                        <EditOutlined />
                    </span>{' '}
                    Edit
                </li>
                <li
                    className="p-2 hover:bg-gray-100 cursor-pointer text-red-500 flex items-center"
                    onClick={() => onDeleteItem()}
                >
                    <span className="mr-2">
                        <DeleteOutlined />
                    </span>{' '}
                    Delete
                </li>
            </ul>
        </div>
    );

    return (
        <div>
            <Popover
                content={menuItems}
                trigger="click"
                placement="bottomLeft"
                overlayClassName="action-popover"
            >
                <button className="px-2 rounded-lg hover:bg-gray-100 focus:outline-none">
                    <DashOutlined />
                </button>
            </Popover>

            {/* Modal Confirm Delete Selected */}
            {/* <Modal
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
            </Modal> */}
        </div>
    );
};

export default React.memo(ActionUserDropdown);
