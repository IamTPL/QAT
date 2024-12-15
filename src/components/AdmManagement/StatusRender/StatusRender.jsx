import React from 'react';

const StatusRender = ({ status }) => {
    const getStatusContent = () => {
        switch (status) {
            case 'active':
                return (
                    <span className="text-lime-500 text-[15px]">Active</span>
                );
            case 'disabled':
                return (
                    <span className="text-gray-400 text-[15px]">Disabled</span>
                );
            case 'expired':
                return (
                    <span className="text-yellow-500 text-[15px]">Expired</span>
                );
            default:
                return (
                    <span className="text-blue-400 text-[15px]">Waiting</span>
                );
        }
    };

    return <>{getStatusContent()}</>;
};

export default React.memo(StatusRender);
