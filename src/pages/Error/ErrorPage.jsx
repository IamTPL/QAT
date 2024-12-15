import React from "react";
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Import AuthContext

const ErrorPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <Result
          status="403"
          title={<h1 className="text-6xl font-bold text-orange-400">403</h1>}
          subTitle={
            <p className="text-lg text-gray-600">
              Sorry, you are not authorized to access this page.
            </p>
          }
          extra={
            <Button
              size="large"
              className="primary-button"
              onClick={() => navigate("/")}
            >
              Back to Home
            </Button>
          }
        />
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            If you believe this is a mistake, please contact the administrator.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
