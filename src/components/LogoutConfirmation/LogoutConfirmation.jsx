import React from 'react';
import { Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import 'antd/dist/reset.css';
import { useAuth } from '../../context/AuthContext';

const LogoutConfirmation = ({ isVisible, onCancel }) => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const onConfirm = () => {
        onCancel();
        logout();
        navigate('/login');
    };

    return (
        <Modal
            title="Logout Confirmation"
            open={isVisible}
            onOk={onConfirm}
            onCancel={onCancel}
            okText="Yes"
            cancelText="No"
            okButtonProps={{
                className: 'primary-button',
            }}
            cancelButtonProps={{
                className: 'secondary-button',
            }}
        >
            <p>Are you sure you want to logout?</p>
        </Modal>
    );
};

export default LogoutConfirmation;
