import React from 'react';
import {
    CheckCircleOutlined,
    LoadingOutlined,
    InfoCircleOutlined,
    CloseCircleOutlined,
} from '@ant-design/icons';

const UploadStatus = ({ status }) => {
    const getStatusContent = () => {
        switch (status) {
            case 'success':
                return (
                    <span className="text-lime-500 text-[15px]">
                        <CheckCircleOutlined /> Success
                    </span>
                );
            case 'processing':
                return (
                    <span className="text-yellow-500 text-[15px]">
                        <LoadingOutlined /> Processing
                    </span>
                );
            case 'new':
                return (
                    <span className="text-blue-400 text-[15px]">
                        <InfoCircleOutlined /> New
                    </span>
                );
            default:
                return (
                    <span className="text-red-400 text-[15px]">
                        <CloseCircleOutlined /> Failed
                    </span>
                );
        }
    };

    return <>{getStatusContent()}</>;
};

export default React.memo(UploadStatus);
