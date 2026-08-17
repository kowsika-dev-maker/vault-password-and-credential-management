import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import "./Sharing.css";

function SharedCredentials() {

    const navigate = useNavigate();

    const [sharedCredentials, setSharedCredentials] = useState([]);

    const [loading, setLoading] = useState(true);

    const [editingCredential, setEditingCredential] =
        useState(null);

    const [editWebsite, setEditWebsite] =
        useState("");

    const [editUsername, setEditUsername] =
        useState("");

    const [editPassword, setEditPassword] =
        useState("");


    // =========================================================
    // LOAD SHARED CREDENTIALS
    // =========================================================

    useEffect(() => {

        const loadSharedCredentials = async () => {

            try {

                const email =
                    localStorage.getItem("email");

                if (!email) {

                    alert(
                        "User email not found. Please login again."
                    );

                    navigate("/");

                    return;
                }


                const response = await API.get(
                    "/sharing/shared/" + email
                );


                console.log(
                    "SHARED CREDENTIALS:",
                    response.data
                );


                setSharedCredentials(
                    response.data
                );


            } catch (error) {

                console.log(
                    "SHARED CREDENTIAL ERROR:",
                    error
                );


                if (error.response) {

                    alert(
                        "Status: " +
                        error.response.status +
                        "\nResponse: " +
                        JSON.stringify(
                            error.response.data
                        )
                    );

                } else {

                    alert(
                        "Unable to load shared credentials"
                    );

                }

            } finally {

                setLoading(false);

            }

        };


        const token =
            localStorage.getItem("token");


        if (!token) {

            navigate("/");

            return;
        }


        loadSharedCredentials();

    }, [navigate]);


    // =========================================================
    // PERMISSION TEXT
    // =========================================================

    const getPermissionText = (permission) => {

        if (permission === "VIEW_ONLY") {

            return "View Only";

        }


        if (permission === "EDIT") {

            return "Edit Access";

        }


        if (permission === "FULL_MANAGEMENT") {

            return "Full Management";

        }


        return permission;

    };


    // =========================================================
    // START EDITING
    // =========================================================

    const handleEdit = (credential) => {

        setEditingCredential(credential);

        setEditWebsite(
            credential.website
        );

        setEditUsername(
            credential.username
        );

        setEditPassword(
            credential.password
        );

    };


    // =========================================================
    // CANCEL EDIT
    // =========================================================

    const handleCancelEdit = () => {

        setEditingCredential(null);

        setEditWebsite("");

        setEditUsername("");

        setEditPassword("");

    };


    // =========================================================
    // UPDATE SHARED CREDENTIAL
    // =========================================================

    const handleUpdate = async (credentialId) => {

        try {

            const response = await API.put(
                "/sharing/update/" + credentialId,
                {
                    website: editWebsite,
                    username: editUsername,
                    password: editPassword
                }
            );


            console.log(
                "UPDATE SHARED CREDENTIAL RESPONSE:",
                response.data
            );


            alert(response.data);


            if (
                response.data ===
                "Shared Credential Updated Successfully"
            ) {

                setSharedCredentials(
                    (previousCredentials) =>
                        previousCredentials.map(
                            (credential) => {

                                if (
                                    credential.credentialId ===
                                    credentialId
                                ) {

                                    return {
                                        ...credential,

                                        website:
                                            editWebsite,

                                        username:
                                            editUsername,

                                        password:
                                            editPassword
                                    };

                                }

                                return credential;

                            }
                        )
                );


                handleCancelEdit();

            }

        } catch (error) {

            console.log(
                "UPDATE SHARED CREDENTIAL ERROR:",
                error
            );


            if (error.response) {

                alert(
                    "Status: " +
                    error.response.status +
                    "\nResponse: " +
                    JSON.stringify(
                        error.response.data
                    )
                );

            } else {

                alert(
                    "Failed to update shared credential"
                );

            }

        }

    };


    // =========================================================
    // DELETE SHARED CREDENTIAL
    // =========================================================

    const handleDelete = async (credentialId) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this credential?"
            );


        if (!confirmDelete) {

            return;

        }


        try {

            const response = await API.delete(
                "/sharing/delete/" + credentialId
            );


            console.log(
                "DELETE SHARED CREDENTIAL RESPONSE:",
                response.data
            );


            alert(response.data);


            if (
                response.data ===
                "Shared Credential Deleted Successfully"
            ) {

                setSharedCredentials(
                    (previousCredentials) =>
                        previousCredentials.filter(
                            (credential) =>
                                credential.credentialId !==
                                credentialId
                        )
                );

            }

        } catch (error) {

            console.log(
                "DELETE SHARED CREDENTIAL ERROR:",
                error
            );


            if (error.response) {

                alert(
                    "Status: " +
                    error.response.status +
                    "\nResponse: " +
                    JSON.stringify(
                        error.response.data
                    )
                );

            } else {

                alert(
                    "Failed to delete shared credential"
                );

            }

        }

    };


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (

            <div className="shared-container">

                <h2>
                    Loading Shared Credentials...
                </h2>

            </div>

        );

    }


    // =========================================================
    // PAGE
    // =========================================================

    return (

        <div className="shared-container">

            <h2>
                Shared With Me
            </h2>


            <button
                type="button"
                onClick={() =>
                    navigate("/dashboard")
                }
            >
                Back to Dashboard
            </button>


            {sharedCredentials.length === 0 ? (

                <p>
                    No credentials have been
                    shared with you.
                </p>

            ) : (

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
                                Owner
                            </th>

                            <th>
                                Permission
                            </th>

                            <th>
                                Actions
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {sharedCredentials.map(
                            (credential) => (

                                <tr
                                    key={
                                        credential.shareId
                                    }
                                >

                                    <td>
                                        {
                                            credential.website
                                        }
                                    </td>


                                    <td>
                                        {
                                            credential.username
                                        }
                                    </td>


                                    <td>
                                        {
                                            credential.password
                                        }
                                    </td>


                                    <td>
                                        {
                                            credential.ownerEmail
                                        }
                                    </td>


                                    <td>
                                        {
                                            getPermissionText(
                                                credential.permission
                                            )
                                        }
                                    </td>


                                    <td>

                                        {/* ==================
                                            VIEW ONLY
                                        ================== */}

                                        {credential.permission ===
                                            "VIEW_ONLY" && (

                                            <span>
                                                View Only
                                            </span>

                                        )}


                                        {/* ==================
                                            EDIT ACCESS
                                        ================== */}

                                        {(
                                            credential.permission ===
                                                "EDIT" ||
                                            credential.permission ===
                                                "FULL_MANAGEMENT"
                                        ) && (

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleEdit(
                                                        credential
                                                    )
                                                }
                                            >
                                                Edit
                                            </button>

                                        )}


                                        {/* ==================
                                            FULL MANAGEMENT
                                        ================== */}

                                        {credential.permission ===
                                            "FULL_MANAGEMENT" && (

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDelete(
                                                        credential.credentialId
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>

                                        )}

                                    </td>

                                </tr>

                            )
                        )}

                    </tbody>

                </table>

            )}


            {/* =================================================
                EDIT FORM
            ================================================= */}

            {editingCredential && (

                <div className="sharing-box">

                    <h2>
                        Edit Shared Credential
                    </h2>


                    <form
                        onSubmit={(e) => {

                            e.preventDefault();

                            handleUpdate(
                                editingCredential.credentialId
                            );

                        }}
                    >

                        <input
                            type="text"
                            placeholder="Website"
                            value={editWebsite}
                            onChange={(e) =>
                                setEditWebsite(
                                    e.target.value
                                )
                            }
                            required
                        />


                        <input
                            type="text"
                            placeholder="Username"
                            value={editUsername}
                            onChange={(e) =>
                                setEditUsername(
                                    e.target.value
                                )
                            }
                            required
                        />


                        <input
                            type="text"
                            placeholder="Password"
                            value={editPassword}
                            onChange={(e) =>
                                setEditPassword(
                                    e.target.value
                                )
                            }
                            required
                        />


                        <button
                            type="submit"
                        >
                            Save Changes
                        </button>


                        <button
                            type="button"
                            onClick={
                                handleCancelEdit
                            }
                        >
                            Cancel
                        </button>

                    </form>

                </div>

            )}

        </div>

    );

}

export default SharedCredentials;