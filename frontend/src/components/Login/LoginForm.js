import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../services/api";
import "./LoginForm.css";

function LoginForm() {

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const response = await API.post("/auth/login", formData);

            if (response.data.message === "Login Successful") {

                // Save JWT Token
                localStorage.setItem("token", response.data.token);

                // Save Logged-in Email
                localStorage.setItem("email", formData.email);

                alert("Login Successful");

                navigate("/dashboard");

            } else {

                alert(response.data.message);

            }

        } catch (error) {

            if (error.response) {
                alert(error.response.data.message || "Login Failed");
            } else {
                alert("Server Error");
            }

        }

    };

    return (

        <div className="login-container">

            <div className="login-box">

                <h1>SecureVault</h1>

                <h2>Login</h2>

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
                        type="password"
                        name="password"
                        placeholder="Enter Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    <button type="submit">
                        Login
                    </button>

                </form>

                <p className="forgot-password">
                    <Link to="/forgot-password">
                        Forgot Password?
                    </Link>
                </p>

                <p className="register-text">
                    Don't have an account?
                    <Link to="/register">
                        {" "}Register
                    </Link>
                </p>

            </div>

        </div>

    );

}

export default LoginForm;