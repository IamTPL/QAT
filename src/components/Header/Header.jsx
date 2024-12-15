import React, { useState } from "react";
import userAvatar from "../../assets/user-avatar.png";
import bestLogo from "../../assets/best-logo.png";
import { Dropdown, message } from "antd";
import { useNavigate } from "react-router-dom";
import LogoutConfirmation from "../LogoutConfirmation/LogoutConfirmation";
import { InfoCircleOutlined, LogoutOutlined } from "@ant-design/icons";
import { useAuth } from "../../context/AuthContext";
import "./HeaderStyle.css";

const Header = () => {
  const navigate = useNavigate();
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const { user, logout } = useAuth();

  const items = [
    {
      key: "user name",
      label: user ? (
        <div className="border-b-2">
          <div className="pt-1 pb-2 text-lg">{user.userInfo?.fullName}</div>
        </div>
      ) : null,
    },
    {
      key: "logout",
      label: (
        <div className="py-1">
          <LogoutOutlined className="" /> Logout{" "}
        </div>
      ),
    },
  ];

  const handleMenuClick = async (e) => {
    switch (e.key) {
      case "logout":
        try {
          await logout();
          navigate("/login");
          message.success("Logged out successfully");
        } catch (error) {
          message.error("Failed to logout");
        }
        break;
      default:
        break;
    }
  };

  return (
    <header className="header flex items-center justify-between pl-8 pr-16 h-[8vh] border-b-[1px]">
      <div className="flex items-center">
        <a href="/">
          <img
            src={bestLogo}
            style={{ width: "84px", height: "45px" }}
            className="rounded-full"
            alt="profile"
          />
        </a>
        <p className="font-bold text-xl mb-0">QBO Automation Tool</p>
        <span className="px-2 ml-6 rounded-full bg-gray-200 text-sm ">
          {" "}
          <InfoCircleOutlined className="mr-1" />
          Beta
        </span>
      </div>
      <div className="flex items-center gap-2 mb-0">
        <button>
          <span
            className="px-4 py-2 font-bold hover:bg-slate-100 cursor-pointer rounded-lg"
            onClick={() => {
              navigate("/");
            }}
          >
            Dashboard
          </span>
        </button>
        {user.role === "admin" && (
          <button>
            <span
              className="px-4 py-2 font-bold hover:bg-slate-100 cursor-pointer rounded-lg"
              onClick={() => {
                navigate("/admin/users");
              }}
            >
              Users
            </span>
          </button>
        )}
        <Dropdown
          menu={{ items, onClick: handleMenuClick }}
          placement="bottomRight"
          trigger={["click"]}
        >
          <button className="ml-2">
            <img
              src={userAvatar}
              className="rounded-full h-8 w-8"
              alt="profile"
            />
          </button>
        </Dropdown>
      </div>
      <LogoutConfirmation
        isVisible={isLogoutModalVisible}
        onCancel={() => setIsLogoutModalVisible(false)}
      />
    </header>
  );
};

export default Header;
