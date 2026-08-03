import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";
import "./ResetPassword.css";

function ResetPassword() {

    const [formData, setFormData] = useState({
        email: "",
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

            const response = await API.post("/reset-password", formData);

            alert(response.data);

        } catch (error) {

            alert("Password Reset Failed");

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