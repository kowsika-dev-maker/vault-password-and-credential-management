import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";
import "./LoginForm.css";

function LoginForm() {

    const [formData, setFormData] = useState({
        email: "",
        password: ""
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

            const response = await API.post("/login", formData);

            alert(response.data);

        } catch (error) {

            alert("Login Failed");

        }

    };

    return (

        <div className="login-container">

            <h2>Login</h2>

            <form onSubmit={handleSubmit}>

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />

                <button type="submit">
                    Login
                </button>

            </form>

            <p>
                Don't have an account?
                <Link to="/register">
                    Register
                </Link>
            </p>

        </div>

    );

}

export default LoginForm;