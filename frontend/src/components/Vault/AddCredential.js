import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Vault.css";
import API from "../../services/api";

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

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const email = localStorage.getItem("email");

            await API.post("/credentials/add", {

                website: formData.website,
                username: formData.username,
                password: formData.password,
                email: email

            });

            alert("Credential Saved Successfully");

            navigate("/dashboard");

        } catch (error) {

            console.log(error);

            alert("Failed to Save Credential");

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

                    <button type="submit">
                        Save Credential
                    </button>

                </form>

            </div>

        </div>

    );

}

export default AddCredential;