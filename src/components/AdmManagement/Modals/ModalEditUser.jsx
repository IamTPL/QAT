import { Button, Form, Input, Modal } from 'antd';
import React from 'react';

const ModalEditUser = ({
    isEditUserModalOpen,
    onCloseModalEditUser,
    onUpdate,
    userFullName,
    setUserFullName,
}) => {
    const [form] = Form.useForm();

    const onChangName = (e) => {
        setUserFullName(e.target.value);
    };

    return (
        <Modal
            title={<span className="text-xl">Update User</span>}
            open={isEditUserModalOpen}
            onCancel={onCloseModalEditUser}
            footer={false}
        >
            <Form
                form={form}
                name="update user"
                onFinish={() => onUpdate(userFullName)}
                layout="vertical"
                autoComplete="off"
                initialValues={{
                    fullname: userFullName,
                }}
            >
                <Form.Item
                    name="fullname"
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
                        <div className="mt-6 font-semibold mb-2 block">
                            Full Name
                        </div>
                        <Input
                            value={userFullName}
                            onChange={onChangName}
                            placeholder="Bestarion"
                            size="large"
                        />
                    </div>
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        className="w-full mt-5 primary-button"
                        size="large"
                    >
                        Save
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default React.memo(ModalEditUser);
