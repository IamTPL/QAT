import React from "react";
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

const ErrorPage404 = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <Result
          status="403"
          title={<h1 className="text-6xl font-bold text-orange-400">404</h1>}
          subTitle={<p className="text-lg font-bold">Page not found.</p>}
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
            The reason might be mistyped or expired URL. Try searching for
            something else.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage404;
