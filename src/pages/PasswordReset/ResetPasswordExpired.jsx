import React from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom"; // Import AuthContext
import svgExpireImg from "../../assets/expire.svg";

const ResetPasswordExpired = () => {
  const navigate = useNavigate();

  const resetPasswordRoute = "/login/reset";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12">
      <div className="w-full max-w-2xl mx-auto p-8 bg-white shadow-xl rounded-lg">
        {/* Header section with icon */}
        <div className="text-center">
          <img
            src={svgExpireImg} // Thay đổi thành URL của một icon phù hợp
            alt="Expired Link"
            className="w-16 h-16 mx-auto mb-4"
          />
          <h1 className="text-xl font-bold text-red-600">Link Expired</h1>
        </div>

        {/* Description */}
        <p className="text-lg text-gray-600 text-center mt-4">
          Sorry, the password reset link has expired. Please request a new one.
        </p>

        {/* Action Button */}
        <div className="text-center mt-8">
          <Button
            type="primary"
            size="large"
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md transition duration-300 ease-in-out transform"
            onClick={() => navigate(resetPasswordRoute)}
          >
            Request a New Reset Link
          </Button>
        </div>

        {/* Footer message */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            If you believe this is a mistake, please contact the administrator.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordExpired;
