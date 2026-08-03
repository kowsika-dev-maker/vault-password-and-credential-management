import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";
import "./RegisterForm.css";

function RegisterForm() {

    const [formData, setFormData] = useState({
        name: "",
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

            const response = await API.post("/auth/register", formData);

            alert(response.data);

            setFormData({
                name: "",
                email: "",
                password: ""
            });

        } catch (error) {
    console.log("ERROR:", error);

    if (error.response) {
        console.log("Status:", error.response.status);
        console.log("Data:", error.response.data);
        alert(error.response.data);
    } else {
        console.log(error.message);
        alert(error.message);
    }
}

    };

    return (

        <div className="register-container">

            <h2>Register</h2>

            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />

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
                    Register
                </button>

            </form>

            <p>
                Already have an account?
                <Link to="/">
                    Login
                </Link>
            </p>

        </div>

    );

}

export default RegisterForm;