import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../../services/api";
import Header from "../Common/Header";

import "./Reports.css";


function Reports() {

    const navigate = useNavigate();

    const [passwordHealth, setPasswordHealth] = useState(null);
    const [loginActivity, setLoginActivity] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // =========================================================
    // FETCH REPORTS
    // =========================================================

    useEffect(() => {

        const fetchReports = async () => {

            try {

                // =================================================
                // GET LOGIN DETAILS
                // =================================================

                const token =
                    localStorage.getItem("token");

                const userId =
                    localStorage.getItem("userId");

                const email =
                    localStorage.getItem("email");


                console.log(
                    "REPORT TOKEN:",
                    token
                );

                console.log(
                    "REPORT USER ID:",
                    userId
                );

                console.log(
                    "REPORT EMAIL:",
                    email
                );


                // =================================================
                // CHECK LOGIN SESSION
                // =================================================

                if (!token || !userId || !email) {

                    setError(
                        "Session expired. Please login again."
                    );

                    setLoading(false);

                    return;
                }


                // =================================================
                // PASSWORD HEALTH REPORT
                // Backend expects userId
                // =================================================

                const passwordResponse =
                    await API.get(
                        `/reports/password-health?userId=${userId}`
                    );


                console.log(
                    "PASSWORD HEALTH RESPONSE:",
                    passwordResponse.data
                );


                // =================================================
                // LOGIN ACTIVITY REPORT
                // Backend expects email
                // =================================================

                const loginResponse =
    await API.get(
        `/reports/login-activity?email=${encodeURIComponent(
            localStorage.getItem("email")
        )}`
    );


                console.log(
                    "LOGIN ACTIVITY RESPONSE:",
                    loginResponse.data
                );


                // =================================================
                // SAVE REPORT DATA
                // =================================================

                setPasswordHealth(
                    passwordResponse.data
                );

                setLoginActivity(
                    loginResponse.data
                );


            } catch (error) {

                console.error(
                    "REPORT ERROR:",
                    error
                );


                // =================================================
                // SERVER RESPONSE ERROR
                // =================================================

                if (error.response) {

                    console.error(
                        "REPORT STATUS:",
                        error.response.status
                    );

                    console.error(
                        "REPORT RESPONSE:",
                        error.response.data
                    );


                    if (
                        error.response.status === 401 ||
                        error.response.status === 403
                    ) {

                        setError(
                            "Access denied. Please login again."
                        );

                    } else {

                        setError(
                            error.response.data?.message ||
                            "Unable to load reports."
                        );

                    }

                } else {

                    setError(
                        "Server error. Please make sure the backend is running."
                    );

                }

            } finally {

                setLoading(false);

            }

        };


        fetchReports();

    }, []);


    // =========================================================
    // FORMAT DATE
    // =========================================================

    const formatDate = (dateTime) => {

        if (!dateTime) {
            return "—";
        }

        return new Date(dateTime)
            .toLocaleDateString(
                "en-IN"
            );
    };


    // =========================================================
    // FORMAT TIME
    // =========================================================

    const formatTime = (dateTime) => {

        if (!dateTime) {
            return "—";
        }

        return new Date(dateTime)
            .toLocaleTimeString(
                "en-IN",
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );
    };


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (

            <div className="reports-page">

                <Header />

                <main className="reports-content">

                    <div className="reports-loading">

                        Loading security reports...

                    </div>

                </main>

            </div>

        );

    }


    // =========================================================
    // ERROR
    // =========================================================

    if (error) {

        return (

            <div className="reports-page">

                <Header />

                <main className="reports-content">

                    <div className="reports-error">

                        <h2>
                            Unable to Load Reports
                        </h2>

                        <p>
                            {error}
                        </p>

                        <button
                            onClick={() => {

                                localStorage.removeItem("token");
                                localStorage.removeItem("email");
                                localStorage.removeItem("userId");

                                navigate("/");

                            }}
                        >
                            Login Again
                        </button>

                    </div>

                </main>

            </div>

        );

    }


    // =========================================================
    // REPORT PAGE
    // =========================================================

    return (

        <div className="reports-page">

            <Header />


            <main className="reports-content">


                {/* =================================================
                    PAGE HEADING
                ================================================= */}

                <div className="reports-heading">

                    <h1>
                        Security Reports
                    </h1>

                    <p>
                        Review your password health and login activity.
                    </p>

                </div>


                {/* =================================================
                    PASSWORD HEALTH
                ================================================= */}

                <section className="report-section">

                    <div className="section-title">

                        <h2>
                            Password Health
                        </h2>

                        <p>
                            Overview of the strength of your stored credentials.
                        </p>

                    </div>


                    <div className="report-cards">


                        {/* TOTAL */}

                        <div className="report-card">

                            <span className="report-card-label">
                                Total Credentials
                            </span>

                            <strong className="report-card-value">
                                {passwordHealth?.totalCredentials ?? 0}
                            </strong>

                        </div>


                        {/* STRONG */}

                        <div className="report-card">

                            <span className="report-card-label">
                                Strong Passwords
                            </span>

                            <strong className="report-card-value">
                                {passwordHealth?.strongPasswords ?? 0}
                            </strong>

                        </div>


                        {/* MEDIUM */}

                        <div className="report-card">

                            <span className="report-card-label">
                                Medium Passwords
                            </span>

                            <strong className="report-card-value">
                                {passwordHealth?.mediumPasswords ?? 0}
                            </strong>

                        </div>


                        {/* WEAK */}

                        <div className="report-card">

                            <span className="report-card-label">
                                Weak Passwords
                            </span>

                            <strong className="report-card-value">
                                {passwordHealth?.weakPasswords ?? 0}
                            </strong>

                        </div>

                    </div>


                    {/* =================================================
                        HEALTH SUMMARY
                    ================================================= */}

                    <div className="health-summary">

                        <div>

                            <span>
                                Overall Health
                            </span>

                            <h3>
                                {passwordHealth?.summary ||
                                    "No summary available"}
                            </h3>

                        </div>


                        <div className="health-score">

                            <span>
                                Health Score
                            </span>

                            <strong>
                                {passwordHealth?.healthScore ?? 0}%
                            </strong>

                        </div>

                    </div>

                </section>


                {/* =================================================
                    LOGIN ACTIVITY
                ================================================= */}

                <section className="report-section">

                    <div className="section-title">

                        <h2>
                            Login Activity
                        </h2>

                        <p>
                            Summary of your account login attempts.
                        </p>

                    </div>


                    <div className="report-cards">


                        {/* TOTAL ATTEMPTS */}

                        <div className="report-card">

                            <span className="report-card-label">
                                Total Attempts
                            </span>

                            <strong className="report-card-value">
                                {loginActivity?.totalAttempts ?? 0}
                            </strong>

                        </div>


                        {/* SUCCESSFUL */}

                        <div className="report-card">

                            <span className="report-card-label">
                                Successful Logins
                            </span>

                            <strong className="report-card-value">
                                {loginActivity?.successfulLogins ?? 0}
                            </strong>

                        </div>


                        {/* FAILED */}

                        <div className="report-card">

                            <span className="report-card-label">
                                Failed Logins
                            </span>

                            <strong className="report-card-value">
                                {loginActivity?.failedLogins ?? 0}
                            </strong>

                        </div>

                    </div>


                    {/* =================================================
                        RECENT LOGIN ACTIVITIES
                    ================================================= */}

                    <div className="activity-report">

                        <h3>
                            Recent Login Activities
                        </h3>


                        <div className="table-wrapper">

                            <table className="reports-table">

                                <thead>

                                    <tr>

                                        <th>
                                            Date
                                        </th>

                                        <th>
                                            Time
                                        </th>

                                        <th>
                                            Activity
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                        <th>
                                            Reason
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {
                                        loginActivity?.recentActivities?.length > 0

                                            ?

                                            loginActivity.recentActivities.map(
                                                (activity) => (

                                                    <tr
                                                        key={activity.id}
                                                    >

                                                        <td>
                                                            {formatDate(
                                                                activity.loginTime
                                                            )}
                                                        </td>


                                                        <td>
                                                            {formatTime(
                                                                activity.loginTime
                                                            )}
                                                        </td>


                                                        <td>
                                                            {activity.activity}
                                                        </td>


                                                        <td>

                                                            <span
                                                                className={
                                                                    `status-badge ${
                                                                        activity.status?.toLowerCase()
                                                                    }`
                                                                }
                                                            >
                                                                {activity.status}
                                                            </span>

                                                        </td>


                                                        <td>
                                                            {activity.reason || "—"}
                                                        </td>

                                                    </tr>

                                                )
                                            )

                                            :

                                            (

                                                <tr>

                                                    <td
                                                        colSpan="5"
                                                        className="no-activity"
                                                    >
                                                        No login activity found.
                                                    </td>

                                                </tr>

                                            )
                                    }

                                </tbody>

                            </table>

                        </div>

                    </div>

                </section>


            </main>

        </div>

    );

}


export default Reports;