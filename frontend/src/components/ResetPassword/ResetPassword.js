import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../services/api";
import "./ResetPassword.css";

function ResetPassword() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: localStorage.getItem("resetEmail") || "",
        otp: "",
        newPassword: ""
    });

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const response = await API.post(
                "/auth/reset-password",
                formData
            );

            alert(response.data);

            if (response.data === "Password Reset Successful") {

                localStorage.removeItem("resetEmail");

                navigate("/");
            }

        } catch (error) {

            console.log("Reset Password Error:", error);

            if (error.response) {

                console.log("Status:", error.response.status);
                console.log("Data:", error.response.data);

                alert(
                    error.response.data.message ||
                    error.response.data ||
                    "Password Reset Failed"
                );

            } else {

                alert("Unable to connect to server");

            }

        }

    };

    return (

        <div className="reset-container">

            <div className="reset-box">

                <h1>SecureVault</h1>

                <h2>Reset Password</h2>

                <form onSubmit={handleSubmit}>

                    <input
                        type="email"
                        name="email"
                        placeholder="Enter Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="text"
                        name="otp"
                        placeholder="Enter OTP"
                        value={formData.otp}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="password"
                        name="newPassword"
                        placeholder="Enter New Password"
                        value={formData.newPassword}
                        onChange={handleChange}
                        required
                    />

                    <button type="submit">
                        Reset Password
                    </button>

                </form>

                <p className="back-login">

                    <Link to="/">
                        Back to Login
                    </Link>

                </p>

            </div>

        </div>

    );

}

export default ResetPassword;