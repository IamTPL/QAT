import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const EmailResetSuccessful = () => {
    const navigate = useNavigate();

    return (
        <Result
            status="success"
            title="Reset Mail Has Been Sent To Your Email"
            subTitle="Please check your email inbox and follow the instructions to reset your password."
            extra={[
                <Button
                    type="primary"
                    key="home"
                    onClick={() => navigate('/login')}
                    className="primary-button"
                >
                    Back to Login
                </Button>,
            ]}
        />
    );
};

export default EmailResetSuccessful;
