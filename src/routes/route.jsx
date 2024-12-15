import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "../layout/Layout";
import DashBoard from "../pages/DashBoard/DashBoard";
import Login from "../pages/Login/Login";
import PasswordReset from "../pages/PasswordReset/PasswordReset";
import EmailReset from "../pages/EmailReset/EmailReset";
import Check from "../pages/Check/Check";
import StatementReview from "../pages/Review/StatementReview";
import CheckReview from "../pages/Review/CheckReview";
import UpdateTitle from "../components/UploadTitle/UploadTitle";
// import AdmDashBoard from '../pages/Admin/AdmDashBoard';
import AdmManagement from "../pages/Admin/AdmManagement";
import { AuthProvider } from "../context/AuthContext";
import ProtectedRoute from "./protect_route";
import ErrorPage from "../pages/Error/ErrorPage";
import ErrorPage404 from "../pages/Error/ErrorPage404";

const Router = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <UpdateTitle />
        <Routes>
          {/* Sign in/ out routes */}
          <Route path="/login" element={<Login></Login>} />
          <Route path="/login/reset" element={<EmailReset></EmailReset>} />
          <Route
            path="/login/reset/password"
            element={<PasswordReset isResetPassword={true}></PasswordReset>}
          />
          <Route
            path="/activate-account/set-password"
            element={<PasswordReset isResetPassword={false}></PasswordReset>}
          />

          {/* Admin routes */}
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute roles={["admin"]}>
                <Layout Component={AdmManagement} />
              </ProtectedRoute>
            }
          />

          {/* Common routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute roles={["user", "admin"]}>
                <Layout Component={DashBoard} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checks"
            element={
              <ProtectedRoute roles={["user", "admin"]}>
                <Layout Component={Check} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/statement-review/:id"
            element={<Layout Component={StatementReview}></Layout>}
          />

          <Route
            path="/check-review/:id"
            element={<Layout Component={CheckReview}></Layout>}
          />
          <Route path="/error" element={<ErrorPage />} />

          {/* Catch-all route for invalid URLs */}
          <Route path="*" element={<ErrorPage404 />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default Router;
