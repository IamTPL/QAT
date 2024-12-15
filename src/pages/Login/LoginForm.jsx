import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
// import accountsData from "../../../database/accountAPI/accounts.json";
import { useAuth } from '../../context/AuthContext';

const LoginForm = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { login } = useAuth();

    const onLogin = async (values) => {
        try {
            const { username, password } = values;
            const {
                success,
                role,
                message: errorMsg,
            } = await login(username, password);

            if (success) {
                navigate('/');
                message.success('Login successful!');
            } else {
                message.error(errorMsg || 'Login failed. Please try again.');
            }
        } catch (error) {
            console.error('Login error:', error);
            message.error('An unexpected error occurred. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <Card style={{ width: '600px' }} className="w-full max-w-md">
                <h2 className="text-2xl font-bold text-left mb-8">Login</h2>

                <Form
                    form={form}
                    name="login"
                    onFinish={onLogin}
                    layout="vertical"
                    autoComplete="off"
                >
                    <Form.Item
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your email!',
                            },
                        ]}
                    >
                        <div>
                            <span className="text-gray-700 font-semibold mb-1 block">
                                Email
                            </span>
                            <Input
                                prefix={
                                    <UserOutlined className="text-gray-400" />
                                }
                                placeholder="bestarion@gmail.com"
                                size="large"
                            />
                        </div>
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your password!',
                            },
                        ]}
                    >
                        <div>
                            <span className="text-gray-700 font-semibold mb-1 block">
                                Password
                            </span>
                            <Input.Password
                                prefix={
                                    <LockOutlined className="text-gray-400" />
                                }
                                placeholder="**********"
                                size="large"
                            />
                        </div>
                    </Form.Item>

                    <div className="text-right mb-4">
                        <span className="text-gray-600">
                            Forgot your password?{' '}
                        </span>
                        <a
                            href="/login/reset"
                            className="text-orange-400 hover:text-orange-500"
                        >
                            Reset Password
                        </a>
                    </div>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="w-full primary-button"
                            size="large"
                        >
                            Log in
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default LoginForm;
