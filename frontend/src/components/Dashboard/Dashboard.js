import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../../services/api";
import Header from "../Common/Header";

import "./Dashboard.css";


function Dashboard() {

    const navigate = useNavigate();

    const [credentialCount, setCredentialCount] = useState(0);

    const email = localStorage.getItem("email");


    // =========================================================
    // CHECK LOGIN + LOAD DASHBOARD DATA
    // =========================================================

    useEffect(() => {

        const loadDashboardData = async () => {

            const token = localStorage.getItem("token");

            if (!token) {

                navigate("/");

                return;
            }


            try {

                const response =
                    await API.get(
                        "/credentials/all/" + email
                    );


                setCredentialCount(
                    response.data.length
                );


            } catch (error) {

                console.log(
                    "Unable to load dashboard data:",
                    error
                );

            }

        };


        loadDashboardData();

    }, [navigate, email]);


    return (

        <div className="dashboard-container">


            {/* =================================================
                COMMON RESPONSIVE HEADER
            ================================================= */}

            <Header />


            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <main className="dashboard-content">


                {/* =================================================
                    WELCOME
                ================================================= */}

                <section className="welcome-section">

                    <div>

                        <span className="welcome-label">
                            SECUREVAULT
                        </span>

                        <h1>
                            Welcome back 👋
                        </h1>

                        <p>
                            Manage your digital credentials securely
                            from one place.
                        </p>

                        <span className="welcome-email">
                            {email}
                        </span>

                    </div>


                    <div className="welcome-icon">
                        🔐
                    </div>

                </section>


                {/* =================================================
                    OVERVIEW
                ================================================= */}

                <section className="dashboard-section">

                    <div className="section-title">

                        <h2>
                            Overview
                        </h2>

                        <p>
                            Your vault at a glance.
                        </p>

                    </div>


                    <div className="overview-grid">


                        {/* CREDENTIALS */}

                        <div className="overview-card">

                            <div className="overview-icon">
                                🔑
                            </div>

                            <div>

                                <span>
                                    CREDENTIALS
                                </span>

                                <h3>
                                    {credentialCount}
                                </h3>

                                <p>
                                    Stored credentials
                                </p>

                            </div>

                        </div>


                        {/* VAULT STATUS */}

                        <div className="overview-card">

                            <div className="overview-icon">
                                ✓
                            </div>

                            <div>

                                <span>
                                    VAULT STATUS
                                </span>

                                <h3 className="status-active">
                                    Active
                                </h3>

                                <p>
                                    Ready to use
                                </p>

                            </div>

                        </div>


                        {/* PRIVACY */}

                        <div className="overview-card">

                            <div className="overview-icon">
                                🛡️
                            </div>

                            <div>

                                <span>
                                    PRIVACY
                                </span>

                                <h3 className="status-active">
                                    Protected
                                </h3>

                                <p>
                                    Your data stays private
                                </p>

                            </div>

                        </div>

                    </div>

                </section>


                {/* =================================================
                    QUICK ACTIONS
                ================================================= */}

                <section className="dashboard-section">

                    <div className="section-title">

                        <h2>
                            Quick Actions
                        </h2>

                        <p>
                            Manage your SecureVault account.
                        </p>

                    </div>


                    <div className="quick-actions">


                        {/* CREDENTIALS */}

                        <button
                            className="action-card"
                            onClick={() =>
                                navigate("/credentials")
                            }
                        >

                            <span className="action-icon">
                                🔑
                            </span>

                            <span className="action-content">

                                <strong>
                                    Credentials
                                </strong>

                                <small>
                                    Manage your saved credentials
                                </small>

                            </span>

                            <span className="action-arrow">
                                →
                            </span>

                        </button>


                        {/* SECURITY */}

                        <button
                            className="action-card"
                            onClick={() =>
                                navigate("/security")
                            }
                        >

                            <span className="action-icon">
                                🛡️
                            </span>

                            <span className="action-content">

                                <strong>
                                    Security
                                </strong>

                                <small>
                                    Review your account security
                                </small>

                            </span>

                            <span className="action-arrow">
                                →
                            </span>

                        </button>


                        {/* PROFILE */}

                        <button
                            className="action-card"
                            onClick={() =>
                                navigate("/profile")
                            }
                        >

                            <span className="action-icon">
                                👤
                            </span>

                            <span className="action-content">

                                <strong>
                                    Profile
                                </strong>

                                <small>
                                    Manage your account details
                                </small>

                            </span>

                            <span className="action-arrow">
                                →
                            </span>

                        </button>

                    </div>

                </section>


                {/* =================================================
                    FOOTER INFO
                ================================================= */}

                <section className="vault-message">

                    <span>
                        🔒
                    </span>

                    <div>

                        <strong>
                            Your credentials, your vault.
                        </strong>

                        <p>
                            SecureVault helps you keep your
                            important credentials organized and protected.
                        </p>

                    </div>

                </section>


            </main>

        </div>

    );

}


export default Dashboard;