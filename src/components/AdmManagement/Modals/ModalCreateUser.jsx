import { Button, Form, Input, Modal } from 'antd';
import React from 'react';

const ModalCreateUser = ({
    isCreateUserModalOpen,
    onCloseModalCreateUser,
    onCreate,
}) => {
    const [form] = Form.useForm();
    return (
        <Modal
            title={<span className="text-xl">Create New User</span>}
            open={isCreateUserModalOpen}
            onCancel={onCloseModalCreateUser}
            footer={false}
        >
            <div className="mb-6 text-gray-500">Please enter user info</div>
            <Form
                form={form}
                name="create user"
                onFinish={onCreate}
                initialValues={{
                    username: '',
                    email: '',
                }}
            >
                <Form.Item
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: "Please enter user's full name!",
                        },
                        {
                            validator: (_, value) => {
                                if (value && value.trim().length < 3) {
                                    return Promise.reject(
                                        new Error(
                                            "User's full name must be at least 3 characters!"
                                        )
                                    );
                                }
                                return Promise.resolve();
                            },
                        },
                        {
                            validator: (_, value) => {
                                if (value && value.trim().length > 50) {
                                    return Promise.reject(
                                        new Error(
                                            "User's full name cannot exceed 50 characters!"
                                        )
                                    );
                                }
                                return Promise.resolve();
                            },
                        },
                    ]}
                >
                    <div>
                        <span className="text-gray-700 font-semibold mb-2 block">
                            Full Name
                        </span>
                        <Input
                            placeholder="Bestarion"
                            size="large"
                            className=""
                        />
                    </div>
                </Form.Item>

                <Form.Item
                    name="email"
                    rules={[
                        {
                            required: true,
                            message: "Please enter user's email!",
                        },
                        {
                            type: 'email',
                            message: 'Invalid email format!',
                        },
                    ]}
                >
                    <div>
                        <span className="text-gray-700 font-semibold mb-2 block">
                            Email
                        </span>
                        <Input
                            placeholder="bestarion@gmail.com"
                            size="large"
                            className=""
                        />
                    </div>
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        className="w-full primary-button"
                        size="large"
                    >
                        Save
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default React.memo(ModalCreateUser);
