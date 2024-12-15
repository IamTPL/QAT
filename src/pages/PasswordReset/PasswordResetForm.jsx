import React, { useState } from "react";
import { Form, Input, Button, Card, message } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  LockOutlined,
} from "@ant-design/icons";
import LoginService from "../../services/api.login.service";
import { useNavigate } from "react-router-dom";

const PasswordResetForm = ({ tokenResetPassword, isResetPassword }) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [password, setPassword] = useState("");

  const [requirements, setRequirements] = useState({
    minLength: false,
    maxLength: false,
    bothCases: false,
    number: false,
    specialChar: false,
  });

  const isPasswordInvalidFormat = () => {
    return !(
      requirements.minLength &&
      requirements.maxLength &&
      requirements.bothCases &&
      requirements.number &&
      requirements.specialChar
    );
  };

  const checkRequirements = (password) => {
    setRequirements({
      minLength: password.length >= 10,
      maxLength: password.length <= 20,
      bothCases: /(?=.*[a-z])(?=.*[A-Z])/.test(password),
      number: /\d/.test(password),
      specialChar: /[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/.test(password),
    });
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    checkRequirements(newPassword);
  };

  const onSubmit = async (values) => {
    const { newPassword, confirmPassword } = values;

    try {
      let response;
      if (!isResetPassword) {
        response = await LoginService.setPassword(
          tokenResetPassword,
          newPassword,
          confirmPassword
        );
      } else {
        response = await LoginService.resetPassword(
          tokenResetPassword,
          newPassword,
          confirmPassword
        );
      }
      if (response.data) {
        const messageSuccess = isResetPassword
          ? "Password has been reset successfully!"
          : "Password has been created successfully! Your account is now active.";
        message.success(messageSuccess);
        navigate("/login");
      }
    } catch (error) {
      message.error("Failed to reset password. Please try again.");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card style={{ width: "600px" }} className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-left mb-8">
          {" "}
          {isResetPassword ? "Reset Password" : "Create Password"}
        </h2>
        <p className="text-gray-500 text-left mb-8">
          {isResetPassword
            ? "Please enter your new password"
            : "Please set your password to complete the account activation process."}
        </p>
        <Form
          form={form}
          name="passwordReset"
          onFinish={onSubmit}
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item
            label={isResetPassword ? "New Password" : "Password"}
            name="newPassword"
            rules={[
              { required: true, message: "Please input your new password!" },
              {
                pattern:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])[A-Za-z\d!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]{10,20}$/,
                message: "",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder={
                isResetPassword ? "Enter new password" : "Enter password"
              }
              size="large"
              value={password}
              onChange={handlePasswordChange}
            />
          </Form.Item>
          {password != "" && isPasswordInvalidFormat() && (
            <div className="password-requirements">
              <p className="m-0 text-red-500">Password must include:</p>
              {/* <p>{isPasswordInvalidFormat()}</p> */}
              <ul>
                <li>
                  {requirements.minLength ? (
                    <CheckCircleOutlined style={{ color: "green" }} />
                  ) : (
                    <CloseCircleOutlined style={{ color: "red" }} />
                  )}
                  &nbsp; A minimum length of 10 characters
                </li>
                <li>
                  {requirements.maxLength ? (
                    <CheckCircleOutlined style={{ color: "green" }} />
                  ) : (
                    <CloseCircleOutlined style={{ color: "red" }} />
                  )}
                  &nbsp; A maximum length of 20 characters
                </li>
                <li>
                  {requirements.bothCases ? (
                    <CheckCircleOutlined style={{ color: "green" }} />
                  ) : (
                    <CloseCircleOutlined style={{ color: "red" }} />
                  )}
                  &nbsp; Both uppercase and lowercase letters
                </li>

                <li>
                  {requirements.number ? (
                    <CheckCircleOutlined style={{ color: "green" }} />
                  ) : (
                    <CloseCircleOutlined style={{ color: "red" }} />
                  )}
                  &nbsp; At least 1 numeric character
                </li>
                <li>
                  {requirements.specialChar ? (
                    <CheckCircleOutlined style={{ color: "green" }} />
                  ) : (
                    <CloseCircleOutlined style={{ color: "red" }} />
                  )}
                  &nbsp; At least 1 special character (@$!%*?&#_-+=.)
                </li>
              </ul>
            </div>
          )}

          <Form.Item
            label={
              isResetPassword ? "Confirm New Password" : "Confirm Password"
            }
            name="confirmPassword"
            dependencies={["newPassword"]}
            rules={[
              {
                required: true,
                message: "Please confirm your password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      "Password confirmation does not match new password!"
                    )
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder={
                isResetPassword ? "Confirm new password" : "Confirm password"
              }
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              className="w-full primary-button submit-button-reset"
              size="large"
              htmlType="submit"
            >
              Save
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default PasswordResetForm;
