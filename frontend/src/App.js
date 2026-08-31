import { BrowserRouter, Routes, Route } from "react-router-dom";


// =========================================================
// AUTHENTICATION
// =========================================================

import LoginForm from "./components/Login/LoginForm";
import RegisterForm from "./components/Register/RegisterForm";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import ResetPassword from "./components/ResetPassword/ResetPassword";


// =========================================================
// DASHBOARD
// =========================================================

import Dashboard from "./components/Dashboard/Dashboard";


// =========================================================
// CREDENTIAL MANAGEMENT
// =========================================================

import Credentials from "./components/Vault/Credentials";
import AddCredential from "./components/Vault/AddCredential";
import EditCredential from "./components/Vault/EditCredential";


// =========================================================
// SHARING
// =========================================================

import ShareCredential from "./components/Sharing/ShareCredential";
import SharedCredentials from "./components/Sharing/SharedCredentials";


// =========================================================
// SECURITY
// =========================================================

import LoginSecurity from "./components/Security/LoginSecurity";


// =========================================================
// SECURITY MONITORING
// =========================================================

import SuspiciousActivity from "./components/Reports/SuspiciousActivity";
import AuditLogs from "./components/Reports/AuditLogs";
import SecurityAlerts from "./components/Reports/SecurityAlerts";


// =========================================================
// PROFILE
// =========================================================

import Profile from "./components/Profile/Profile";


// =========================================================
// REPORTS
// =========================================================

import Reports from "./components/Reports/Reports";


function App() {

    return (

        <BrowserRouter>

            <Routes>


                {/* =================================================
                    AUTHENTICATION
                ================================================= */}

                <Route
                    path="/"
                    element={<LoginForm />}
                />

                <Route
                    path="/register"
                    element={<RegisterForm />}
                />

                <Route
                    path="/forgot-password"
                    element={<ForgotPassword />}
                />

                <Route
                    path="/reset-password"
                    element={<ResetPassword />}
                />


                {/* =================================================
                    DASHBOARD
                ================================================= */}

                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />


                {/* =================================================
                    CREDENTIAL MANAGEMENT
                ================================================= */}

                <Route
                    path="/credentials"
                    element={<Credentials />}
                />

                <Route
                    path="/add-credential"
                    element={<AddCredential />}
                />

                <Route
                    path="/edit-credential/:id"
                    element={<EditCredential />}
                />


                {/* =================================================
                    SHARING
                ================================================= */}

                <Route
                    path="/share-credential/:id"
                    element={<ShareCredential />}
                />

                <Route
                    path="/shared-credentials"
                    element={<SharedCredentials />}
                />


                {/* =================================================
                    SECURITY MAIN PAGE
                ================================================= */}

                <Route
                    path="/security"
                    element={<LoginSecurity />}
                />


                {/* =================================================
                    SECURITY DROPDOWN PAGES
                ================================================= */}

                <Route
                    path="/security/suspicious"
                    element={<SuspiciousActivity />}
                />

                <Route
                    path="/security/audit-logs"
                    element={<AuditLogs />}
                />

                <Route
                    path="/security/alerts"
                    element={<SecurityAlerts />}
                />


                {/* =================================================
                    REPORTS
                ================================================= */}

                <Route
                    path="/reports"
                    element={<Reports />}
                />


                {/* =================================================
                    PROFILE
                ================================================= */}

                <Route
                    path="/profile"
                    element={<Profile />}
                />


            </Routes>

        </BrowserRouter>

    );
}


export default App;