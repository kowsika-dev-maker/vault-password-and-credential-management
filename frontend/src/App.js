import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginForm from "./components/Login/LoginForm";
import RegisterForm from "./components/Register/RegisterForm";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import ResetPassword from "./components/ResetPassword/ResetPassword";

import Dashboard from "./components/Dashboard/Dashboard";

import AddCredential from "./components/Vault/AddCredential";
import EditCredential from "./components/Vault/EditCredential";

// Milestone 2 - Sharing
import ShareCredential from "./components/Sharing/ShareCredential";
import SharedCredentials from "./components/Sharing/SharedCredentials";


function App() {

    return (

        <BrowserRouter>

            <Routes>

                {/* Authentication */}

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


                {/* Dashboard */}

                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />


                {/* Credential Management */}

                <Route
                    path="/add-credential"
                    element={<AddCredential />}
                />

                <Route
                    path="/edit-credential/:id"
                    element={<EditCredential />}
                />


                {/* Milestone 2 - Sharing */}

                <Route
                    path="/share-credential/:id"
                    element={<ShareCredential />}
                />

                <Route
                    path="/shared-credentials"
                    element={<SharedCredentials />}
                />

            </Routes>

        </BrowserRouter>

    );

}

export default App;