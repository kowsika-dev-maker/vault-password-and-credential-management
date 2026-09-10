import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../services/api";
import "./Vault.css";
import Header from "../Common/Header";

import PasswordGenerator from "../PasswordManagement/PasswordGenerator";
import PasswordStrength from "../PasswordManagement/PasswordStrength";
import PasswordSuggestions from "../PasswordManagement/PasswordSuggestions";

function EditCredential() {

    const navigate = useNavigate();
    const { id } = useParams();

    const [formData, setFormData] = useState({
        website: "",
        username: "",
        password: ""
    });

    useEffect(() => {

        const loadCredential = async () => {

            try {

                const email = localStorage.getItem("email");

                const response = await API.get(
                    "/credentials/all/" + email
                );

                const credential = response.data.find(
                    c => c.id === Number(id)
                );

                if (credential) {

                    setFormData({
                        website: credential.website,
                        username: credential.username,
                        password: credential.password
                    });

                } else {

                    alert("Credential Not Found");
                    navigate("/dashboard");

                }

            } catch (error) {

                console.log(error);
                alert("Unable to Load Credential");

            }

        };

        loadCredential();

    }, [id, navigate]);

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

            await API.put(
                "/credentials/update/" + id,
                formData
            );

            alert("Credential Updated Successfully");

            navigate("/dashboard");

        } catch (error) {

            console.log("UPDATE CREDENTIAL ERROR:", error);

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

                alert("Update Failed");

            }

        }

    };

    return (

        <div className="vault-page">

            <Header />

            <div className="vault-container">

            <div className="vault-box">

                <h2>Edit Credential</h2>

                <form onSubmit={handleSubmit}>

                    <input
                        type="text"
                        name="website"
                        placeholder="Website"
                        value={formData.website}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
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
                        Update Credential
                    </button>

                </form>

            </div>

        </div>

    </div>

);

}

export default EditCredential;