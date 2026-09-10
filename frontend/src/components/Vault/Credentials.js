import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import API from "../../services/api";
import Header from "../Common/Header";

import "./Credentials.css";

function Credentials() {

    const navigate = useNavigate();

    const [credentials, setCredentials] = useState([]);
    const [visiblePasswords, setVisiblePasswords] = useState({});
    const [searchTerm, setSearchTerm] = useState("");


    // =========================================================
    // CHECK LOGIN + LOAD CREDENTIALS
    // =========================================================

    useEffect(() => {

        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/");
            return;
        }

        loadCredentials();

    }, [navigate]);


    // =========================================================
    // LOAD CREDENTIALS
    // =========================================================

    const loadCredentials = async () => {

        try {

            const email = localStorage.getItem("email");

            const response =
                await API.get(
                    "/credentials/all/" + email
                );

            setCredentials(response.data);

        } catch (error) {

            console.error(
                "Unable to load credentials:",
                error
            );

            alert(
                "Unable to load your credentials. Please try again."
            );
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

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this credential?"
            );

        if (!confirmed) {
            return;
        }

        try {

            await API.delete(
                "/credentials/delete/" + id
            );

            alert(
                "Credential deleted successfully."
            );

            loadCredentials();

        } catch (error) {

            console.error(
                "Failed to delete credential:",
                error
            );

            alert(
                "Failed to delete credential. Please try again."
            );
        }
    };


    // =========================================================
    // SEARCH
    // =========================================================

    const filteredCredentials =
        credentials.filter((credential) => {

            const search =
                searchTerm.toLowerCase().trim();

            if (!search) {
                return true;
            }

            return (
                credential.website
                    ?.toLowerCase()
                    .includes(search)
                ||
                credential.username
                    ?.toLowerCase()
                    .includes(search)
            );
        });


    // =========================================================
    // UI
    // =========================================================

    return (

        <div className="credentials-container">

            {/* =================================================
                COMMON RESPONSIVE HEADER
            ================================================= */}

            <Header />


            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <main className="credentials-content">

                <div className="credentials-box">


                    {/* =================================================
                        PAGE TITLE
                    ================================================= */}

                    <section className="credentials-title">

                        <h1>
                            Password Vault
                        </h1>

                        <p>
                            Manage your saved credentials securely.
                        </p>

                    </section>


                    {/* =================================================
                        TOP BAR
                    ================================================= */}

                    <div className="top-bar">

                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(event) =>
                                setSearchTerm(event.target.value)
                            }
                            placeholder="Search website or username..."
                            aria-label="Search credentials"
                        />


                        <Link to="/add-credential">

                            <button
                                type="button"
                                className="add-btn"
                            >
                                + Add Credential
                            </button>

                        </Link>


                        <button
                            type="button"
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

                                {filteredCredentials.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="4"
                                            className="no-credentials"
                                        >
                                            {searchTerm
                                                ? "No matching credentials found."
                                                : "No credentials found."
                                            }
                                        </td>

                                    </tr>

                                ) : (

                                    filteredCredentials.map(
                                        (credential) => (

                                            <tr
                                                key={credential.id}
                                            >

                                                <td>
                                                    {credential.website}
                                                </td>


                                                <td>
                                                    {credential.username}
                                                </td>


                                                <td>

                                                    <div className="password-display">

                                                        <span>

                                                            {visiblePasswords[
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

                                                            {visiblePasswords[
                                                                credential.id
                                                            ]
                                                                ? "Hide"
                                                                : "Show"
                                                            }

                                                        </button>

                                                    </div>

                                                </td>


                                                <td>

                                                    <button
                                                        type="button"
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
                                                        type="button"
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
                                                        type="button"
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

            </main>

        </div>
    );
}

export default Credentials;