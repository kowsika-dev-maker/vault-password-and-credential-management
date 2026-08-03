import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../services/api";
import "./ForgotPassword.css";

function ForgotPassword() {

    const [email, setEmail] = useState("");

    const navigate = useNavigate();
    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const response = await API.post("/forgot-password", {
                email
            });

            alert(response.data);
            navigate("/reset-password");

        } catch (error) {

            alert("Failed to send OTP");

        }

    };

    return (

        <div className="forgot-container">

            <div className="forgot-card">

                <h2>Forgot Password</h2>

                <p className="subtitle">
                    Enter your registered email to receive an OTP.
                </p>

                <form onSubmit={handleSubmit}>

                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <button type="submit">
                        Send OTP
                    </button>

                </form>

                <p className="back-login">
                    Remember your password?
                    <Link to="/login"> Login</Link>
                </p>

            </div>

        </div>

    );

}

export default ForgotPassword;