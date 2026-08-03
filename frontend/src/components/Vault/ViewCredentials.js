import { Link } from "react-router-dom";
import "./Vault.css";

function ViewCredential() {
    return (
        <div className="vault-container">

            <div className="vault-box">

                <h2>View Credential</h2>

                <p><strong>Website:</strong> Gmail</p>
                <p><strong>Username:</strong> kowsika@gmail.com</p>
                <p><strong>Password:</strong> ********</p>

                <Link to="/dashboard">
                    <button>Back</button>
                </Link>

            </div>

        </div>
    );
}

export default ViewCredential;