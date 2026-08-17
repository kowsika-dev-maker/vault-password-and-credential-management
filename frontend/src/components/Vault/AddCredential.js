import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Vault.css";
import API from "../../services/api";

import PasswordGenerator from "../PasswordManagement/PasswordGenerator";
import PasswordStrength from "../PasswordManagement/PasswordStrength";
import PasswordSuggestions from "../PasswordManagement/PasswordSuggestions";

function AddCredential() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        website: "",
        username: "",
        password: ""
    });

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    // Receive generated password
    const handleGeneratedPassword = (password) => {

        setFormData({
            ...formData,
            password: password
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const email = localStorage.getItem("email");
            const token = localStorage.getItem("token");

            console.log("Email:", email);
            console.log("Token:", token);

            if (!token) {

                alert("Please login again. JWT token not found.");
                navigate("/");
                return;

            }

            if (!email) {

                alert("User email not found. Please login again.");
                navigate("/");
                return;

            }

            const response = await API.post("/credentials/add", {

                website: formData.website,
                username: formData.username,
                password: formData.password,
                email: email

            });

            console.log(
                "ADD CREDENTIAL RESPONSE:",
                response.data
            );

            alert("Credential Saved Successfully");

            navigate("/dashboard");

        } catch (error) {

            console.log(
                "ADD CREDENTIAL ERROR:",
                error
            );

            if (error.response) {

                console.log(
                    "STATUS:",
                    error.response.status
                );

                console.log(
                    "DATA:",
                    error.response.data
                );

                alert(
                    "Status: " +
                    error.response.status +
                    "\nResponse: " +
                    JSON.stringify(error.response.data)
                );

            } else {

                console.log(
                    "ERROR:",
                    error.message
                );

                alert(error.message);

            }

        }

    };

    return (

        <div className="vault-container">

            <div className="vault-box">

                <h2>Add Credential</h2>

                <form onSubmit={handleSubmit}>

                    <input
                        type="text"
                        name="website"
                        placeholder="Website Name"
                        value={formData.website}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="text"
                        name="username"
                        placeholder="Username / Email"
                        value={formData.username}
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

                    {/* Password Strength */}

                    <PasswordStrength
                        password={formData.password}
                    />

                    {/* Password Suggestions */}

                    <PasswordSuggestions
                        password={formData.password}
                    />

                    {/* Password Generator */}

                    <PasswordGenerator
                        onGenerate={handleGeneratedPassword}
                    />

                    <button type="submit">
                        Save Credential
                    </button>

                </form>

            </div>

        </div>

    );

}

export default AddCredential;