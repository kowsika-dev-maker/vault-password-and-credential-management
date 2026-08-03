import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../services/api";
import "./Dashboard.css";

function Dashboard() {

    const navigate = useNavigate();

    const [credentials, setCredentials] = useState([]);

    useEffect(() => {

        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/");
            return;
        }

        loadCredentials();

    }, [navigate]);

    const loadCredentials = async () => {

        try {

            const email = localStorage.getItem("email");

            const response = await API.get("/credentials/all/" + email);

            setCredentials(response.data);

        } catch (error) {

            console.log(error);

            alert("Unable to load credentials");

        }

    };

    const handleDelete = async (id) => {

        try {

            await API.delete("/credentials/delete/" + id);

            alert("Credential Deleted Successfully");

            loadCredentials();

        } catch (error) {

            console.log(error);

            alert("Failed to Delete Credential");

        }

    };

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("email");

        navigate("/");

    };

    return (

        <div className="dashboard-container">

            <div className="dashboard-box">

                <div className="dashboard-header">

                    <h1>SecureVault</h1>

                    <button
                        className="logout-btn"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

                <h2>Password Vault</h2>

                <div className="top-bar">

                    <input
                        type="text"
                        placeholder="Search Website..."
                    />

                    <Link to="/add-credential">
                        <button className="add-btn">
                            + Add Credential
                        </button>
                    </Link>

                </div>

                <table>

                    <thead>

                        <tr>
                            <th>Website</th>
                            <th>Username</th>
                            <th>Password</th>
                            <th>Actions</th>
                        </tr>

                    </thead>

                    <tbody>

                        {credentials.length === 0 ? (

                            <tr>
                                <td colSpan="4">
                                    No Credentials Found
                                </td>
                            </tr>

                        ) : (

                            credentials.map((credential) => (

                                <tr key={credential.id}>

                                    <td>{credential.website}</td>
                                    <td>{credential.username}</td>
                                    <td>{credential.password}</td>

                                    <td>

                                        <button
                                            onClick={() =>
                                                navigate("/edit-credential/" + credential.id)
                                            }
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() =>
                                                handleDelete(credential.id)
                                            }
                                        >
                                            Delete
                                        </button>

                                    </td>

                                </tr>

                            ))

                        )}

                    </tbody>

                </table>

            </div>

        </div>

    );

}

export default Dashboard;