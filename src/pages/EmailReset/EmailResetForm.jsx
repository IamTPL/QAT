import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import LoginService from '../../services/api.login.service';

const EmailResetForm = ({ onResetSuccess }) => {
    const [form] = Form.useForm();

    const onSubmit = async (values) => {
        try {
            const response = await LoginService.sendResetPasswordEmail(
                values.email
            );
            if (response.data) {
                console.log('Response data:', response.data);
            }
            message.success('Reset link sent!');
            onResetSuccess();
        } catch (error) {
            message.error(
                error.response?.data?.message == 'Account is not active'
                    ? 'Your account is currently locked! Please contact administrators for assistance'
                    : 'Failed to send reset email. Please try again.'
            );
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <Card style={{ width: '600px' }} className="w-full max-w-md">
                <h2 className="text-2xl font-bold text-left mb-8">
                    Reset Password
                </h2>
                <p className="text-gray-500 text-left mb-8">
                    Enter your email address and we'll send you a link to reset
                    your password
                </p>

                <Form
                    form={form}
                    name="emailReset"
                    onFinish={onSubmit}
                    layout="vertical"
                    autoComplete="off"
                >
                    <Form.Item
                        name="email"
                        rules={[
                            {
                                type: 'email',
                                message: 'Please enter a valid email!',
                            },
                            {
                                required: true,
                                message: 'Please input your email!',
                            },
                        ]}
                    >
                        <div>
                            <span className="text-gray-700 font-semibold mb-1 block">
                                Email Address
                            </span>
                            <Input
                                prefix={
                                    <MailOutlined className="text-gray-400" />
                                }
                                placeholder="Enter your email"
                                size="large"
                            />
                        </div>
                    </Form.Item>

                    <Form.Item>
                        <Button
                            className="w-full primary-button submit-button-reset"
                            size="large"
                            htmlType="submit"
                        >
                            Send Reset Link
                        </Button>
                    </Form.Item>

                    <div className="text-center">
                        <a
                            href="/login"
                            className="text-orange-400 font-bold hover:text-black"
                        >
                            Back to Login
                        </a>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default EmailResetForm;
