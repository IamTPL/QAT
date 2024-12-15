import React, { useState } from 'react';
import EmailResetForm from './EmailResetForm';
import EmailResetSuccessful from './EmailResetSuccessful';
import loginImage from '../../assets/login.png';

const EmailReset = () => {
    const [isResetSuccessful, setIsResetSuccessful] = useState(false);

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <div
                style={{
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                {isResetSuccessful ? (
                    <EmailResetSuccessful />
                ) : (
                    <EmailResetForm
                        onResetSuccess={() => setIsResetSuccessful(true)}
                    />
                )}
            </div>
            <div
                style={{
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <img
                    src={loginImage}
                    alt="Login"
                    style={{ maxWidth: '100%', height: 'auto' }}
                />
            </div>
        </div>
    );
};

export default EmailReset;
