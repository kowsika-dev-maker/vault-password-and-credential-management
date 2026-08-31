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

            console.log("LOGIN REQUEST:", formData.email);

            const response =
                await API.post(
                    "/auth/login",
                    formData
                );

            console.log(
                "LOGIN RESPONSE:",
                response.data
            );


            /*
             * Backend response:
             *
             * {
             *   message: "Login Successful",
             *   token: "JWT_TOKEN",
             *   userId: 1
             * }
             */


            if (
                response.data &&
                response.data.message ===
                "Login Successful"
            ) {

                const token =
                    response.data.token;


                if (!token) {

                    alert(
                        "Login successful but JWT token was not received."
                    );

                    return;
                }


                // =============================================
                // SAVE JWT TOKEN
                // =============================================

                localStorage.setItem(
                    "token",
                    token
                );


                // =============================================
                // SAVE LOGGED-IN USER EMAIL
                // =============================================

                localStorage.setItem(
                    "email",
                    formData.email
                );


                // =============================================
                // SAVE LOGGED-IN USER ID
                // =============================================

                localStorage.setItem(
                    "userId",
                    response.data.userId
                );


                // =============================================
                // DEBUG LOGS
                // =============================================

                console.log(
                    "JWT SAVED:",
                    localStorage.getItem("token")
                );

                console.log(
                    "EMAIL SAVED:",
                    localStorage.getItem("email")
                );

                console.log(
                    "USER ID SAVED:",
                    localStorage.getItem("userId")
                );


                alert(
                    "Login Successful"
                );


                navigate("/dashboard");

            } else {

                alert(
                    response.data?.message ||
                    "Login Failed"
                );

            }


        } catch (error) {

            console.error(
                "LOGIN ERROR:",
                error
            );


            if (error.response) {

                console.error(
                    "LOGIN STATUS:",
                    error.response.status
                );

                console.error(
                    "LOGIN RESPONSE:",
                    error.response.data
                );


                const serverMessage =
                    error.response.data?.message ||
                    (
                        typeof error.response.data ===
                        "string"
                            ? error.response.data
                            : null
                    ) ||
                    "Login Failed";


                alert(
                    serverMessage
                );

            } else {

                alert(
                    "Server Error / Network Issue"
                );

            }

        }

    };


    return (

        <div className="login-container">

            <div className="login-box">

                <h1>
                    SecureVault
                </h1>


                <h2>
                    Login
                </h2>


                <form
                    onSubmit={handleSubmit}
                >

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


                    <button
                        type="submit"
                    >
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