import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginForm from "./components/Login/LoginForm";
import RegisterForm from "./components/Register/RegisterForm";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import ResetPassword from "./components/ResetPassword/ResetPassword";

import Dashboard from "./components/Dashboard/Dashboard";

import AddCredential from "./components/Vault/AddCredential";
import EditCredential from "./components/Vault/EditCredential";
//import ViewCredential from "./components/Vault/ViewCredential";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/add-credential" element={<AddCredential />} />
        <Route path="/edit-credential/:id" element={<EditCredential />} />
        

      </Routes>

    </BrowserRouter>
  );
}

export default App;