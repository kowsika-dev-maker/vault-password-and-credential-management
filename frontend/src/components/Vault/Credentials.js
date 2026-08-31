import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../services/api";
import "./Credentials.css";

function Credentials() {

    const navigate = useNavigate();

    const [credentials, setCredentials] = useState([]);

    const [visiblePasswords, setVisiblePasswords] = useState({});


    // =========================================================
    // LOAD CREDENTIALS
    // =========================================================

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

            const response = await API.get(
                "/credentials/all/" + email
            );

            setCredentials(response.data);

        } catch (error) {

            console.log(error);

            alert("Unable to load credentials");

        }

    };


    // =========================================================
    // SHOW / HIDE PASSWORD
    // =========================================================

    const togglePassword = (id) => {

        setVisiblePasswords((previous) => ({

            ...previous,

            [id]: !previous[id]

        }));

    };


    // =========================================================
    // DELETE CREDENTIAL
    // =========================================================

    const handleDelete = async (id) => {

        try {

            await API.delete(
                "/credentials/delete/" + id
            );

            alert("Credential Deleted Successfully");

            loadCredentials();

        } catch (error) {

            console.log(error);

            alert("Failed to Delete Credential");

        }

    };


    // =========================================================
    // LOGOUT
    // =========================================================

    const handleLogout = () => {

        localStorage.removeItem("token");

        localStorage.removeItem("email");

        navigate("/");

    };


    // =========================================================
    // UI
    // =========================================================

    return (

        <div className="credentials-container">

            <div className="credentials-box">


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="credentials-header">

                    <div>

                        <h1>
                            SecureVault
                        </h1>

                        <p>
                            Password Vault
                        </p>

                    </div>


                    <button
                        className="logout-btn"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>


                {/* =================================================
                    NAVIGATION
                ================================================= */}

                <div className="credentials-navigation">

                    <button
                        onClick={() =>
                            navigate("/dashboard")
                        }
                    >
                        Dashboard
                    </button>


                    <button
                        className="active"
                        onClick={() =>
                            navigate("/credentials")
                        }
                    >
                        Credentials
                    </button>


                    <button
                        onClick={() =>
                            navigate("/security")
                        }
                    >
                        Security
                    </button>


                    <button
                        onClick={() =>
                            navigate("/profile")
                        }
                    >
                        Profile
                    </button>

                </div>


                {/* =================================================
                    TITLE
                ================================================= */}

                <div className="credentials-title">

                    <h2>
                        Password Vault
                    </h2>

                    <p>
                        Manage your saved credentials securely.
                    </p>

                </div>


                {/* =================================================
                    TOP BAR
                ================================================= */}

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


                    <button
                        className="add-btn"
                        onClick={() =>
                            navigate("/shared-credentials")
                        }
                    >
                        Shared With Me
                    </button>

                </div>


                {/* =================================================
                    CREDENTIAL TABLE
                ================================================= */}

                <div className="table-container">

                    <table>

                        <thead>

                            <tr>

                                <th>
                                    Website
                                </th>

                                <th>
                                    Username
                                </th>

                                <th>
                                    Password
                                </th>

                                <th>
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {credentials.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="4"
                                        className="no-credentials"
                                    >
                                        No Credentials Found
                                    </td>

                                </tr>

                            ) : (

                                credentials.map(
                                    (credential) => (

                                        <tr
                                            key={credential.id}
                                        >

                                            {/* WEBSITE */}

                                            <td>
                                                {credential.website}
                                            </td>


                                            {/* USERNAME */}

                                            <td>
                                                {credential.username}
                                            </td>


                                            {/* PASSWORD */}

                                            <td>

                                                <div className="password-display">

                                                    <span>

                                                        {
                                                            visiblePasswords[
                                                                credential.id
                                                            ]
                                                                ? credential.password
                                                                : "••••••••"
                                                        }

                                                    </span>


                                                    <button
                                                        type="button"
                                                        className="password-toggle-btn"
                                                        onClick={() =>
                                                            togglePassword(
                                                                credential.id
                                                            )
                                                        }
                                                    >

                                                        {
                                                            visiblePasswords[
                                                                credential.id
                                                            ]
                                                                ? "Hide"
                                                                : "Show"
                                                        }

                                                    </button>

                                                </div>

                                            </td>


                                            {/* ACTIONS */}

                                            <td>

                                                <button
                                                    className="edit-btn"
                                                    onClick={() =>
                                                        navigate(
                                                            "/edit-credential/" +
                                                            credential.id
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </button>


                                                <button
                                                    className="share-btn"
                                                    onClick={() =>
                                                        navigate(
                                                            "/share-credential/" +
                                                            credential.id
                                                        )
                                                    }
                                                >
                                                    Share
                                                </button>


                                                <button
                                                    className="delete-btn"
                                                    onClick={() =>
                                                        handleDelete(
                                                            credential.id
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>

                                            </td>

                                        </tr>

                                    )
                                )

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    );

}

export default Credentials;