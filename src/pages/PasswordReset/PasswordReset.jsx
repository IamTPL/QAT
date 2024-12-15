import React, { useEffect, useState } from "react";
import PasswordResetForm from "./PasswordResetForm";
import loginImage from "../../assets/login.png";
import { useSearchParams } from "react-router-dom";
import LoginService from "../../services/api.login.service";
import ResetPasswordExpired from "./ResetPasswordExpired";
import SetPasswordExpired from "./SetPasswordExpired";

const PasswordReset = ({ isResetPassword }) => {
  const [searchParams] = useSearchParams();
  const tokenResetPassword = searchParams.get("token");
  const [validToken, setValidToken] = useState(null);

  const checkValidateResetPasswordToken = async () => {
    try {
      const response = isResetPassword
        ? await LoginService.checkValidateResetPasswordToken(tokenResetPassword)
        : await LoginService.checkValidateSetPasswordToken(tokenResetPassword);
      if (response.data && response.data.valid) {
        setValidToken(true);
      } else {
        setValidToken(false);
      }
    } catch (error) {
      console.error("Error checking token:", error);
      setValidToken(false);
    }
  };

  useEffect(() => {
    checkValidateResetPasswordToken();
  }, [tokenResetPassword]);

  return (
    <>
      {isResetPassword && validToken === false ? (
        <ResetPasswordExpired />
      ) : !isResetPassword && validToken === false ? (
        <SetPasswordExpired />
      ) : (
        <div style={{ display: "flex", height: "100vh" }}>
          <div
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <PasswordResetForm
              tokenResetPassword={tokenResetPassword}
              isResetPassword={isResetPassword}
            />
          </div>
          <div
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src={loginImage}
              alt="Login"
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default PasswordReset;
