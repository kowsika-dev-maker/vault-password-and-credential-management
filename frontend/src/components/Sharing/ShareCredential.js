import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../services/api";
import "./Sharing.css";
import Header from "../Common/Header";

function ShareCredential() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");

    const [permission, setPermission] =
        useState("VIEW_ONLY");


    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const ownerEmail =
                localStorage.getItem("email");

            const token =
                localStorage.getItem("token");


            // Check JWT
            if (!token) {

                alert(
                    "Please login again. JWT token not found."
                );

                navigate("/");

                return;
            }


            // Check owner email
            if (!ownerEmail) {

                alert(
                    "User email not found. Please login again."
                );

                navigate("/");

                return;
            }


            // Check credential ID
            if (!id) {

                alert(
                    "Credential ID not found."
                );

                navigate("/dashboard");

                return;
            }


            // Check recipient email
            if (!email.trim()) {

                alert(
                    "Please enter recipient email."
                );

                return;
            }


            const response = await API.post(
                "/sharing/share",
                {
                    credentialId: Number(id),

                    ownerEmail: ownerEmail,

                    recipientEmail: email.trim(),

                    permission: permission
                }
            );


            console.log(
                "SHARE RESPONSE:",
                response.data
            );


            alert(response.data);


            if (
                response.data ===
                "Credential Shared Successfully"
            ) {

                navigate("/dashboard");

            }

        } catch (error) {

            console.log(
                "SHARE ERROR:",
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
                    JSON.stringify(
                        error.response.data
                    )
                );

            } else {

                alert(
                    "Failed to Share Credential\n" +
                    error.message
                );

            }

        }

    };


    return (

        <div className="sharing-page">

            <Header />

            <div className="sharing-container">

            <div className="sharing-box">

                <h2>
                    Share Credential
                </h2>


                <form onSubmit={handleSubmit}>

                    <input
                        type="email"
                        placeholder="Enter user's email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        required
                    />


                    <select
                        value={permission}
                        onChange={(e) =>
                            setPermission(
                                e.target.value
                            )
                        }
                    >

                        <option value="VIEW_ONLY">
                            View Only
                        </option>


                        <option value="EDIT">
                            Edit Access
                        </option>


                        <option value="FULL_MANAGEMENT">
                            Full Management
                        </option>

                    </select>


                    <button type="submit">

                        Share Credential

                    </button>

                </form>

            </div>

        </div>

    </div>

);

}

export default ShareCredential;