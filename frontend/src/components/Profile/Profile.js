import Header from "../Common/Header";
import "./Profile.css";

function Profile() {

    const email =
        localStorage.getItem("email") || "Not available";

    return (

        <div className="profile-page">

            <Header />

            <main className="profile-content">

                <div className="profile-card">

                    <div className="profile-avatar">
                        👤
                    </div>

                    <h1>
                        My Profile
                    </h1>

                    <p className="profile-subtitle">
                        Your SecureVault account details
                    </p>


                    <div className="profile-details">

                        <div className="profile-row">

                            <span>
                                Email
                            </span>

                            <strong>
                                {email}
                            </strong>

                        </div>


                        <div className="profile-row">

                            <span>
                                Account Status
                            </span>

                            <strong className="active-status">
                                Active
                            </strong>

                        </div>

                    </div>

                </div>

            </main>

        </div>

    );
}

export default Profile;