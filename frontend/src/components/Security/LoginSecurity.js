import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../../services/api";
import Header from "../Common/Header";

import "./LoginSecurity.css";


function LoginSecurity() {

    const navigate = useNavigate();

    const [activities, setActivities] = useState([]);

    const [loading, setLoading] = useState(true);


    // =========================================================
    // LOAD LOGIN ACTIVITY
    // =========================================================

    useEffect(() => {

        const loadLoginActivity = async () => {

            try {

                const token =
                    localStorage.getItem("token");

                const email =
                    localStorage.getItem("email");


                if (!token || !email) {

                    alert(
                        "Session expired. Please login again."
                    );

                    navigate("/");

                    return;
                }


                const response = await API.get(
                    "/security/activity/" +
                    encodeURIComponent(email)
                );


                console.log(
                    "LOGIN ACTIVITY:",
                    response.data
                );


                setActivities(
                    response.data || []
                );


            } catch (error) {

                console.error(
                    "LOGIN ACTIVITY ERROR:",
                    error
                );


                if (error.response) {

                    alert(
                        "Unable to load login activity.\nStatus: " +
                        error.response.status
                    );

                } else {

                    alert(
                        "Unable to connect to server."
                    );

                }

            } finally {

                setLoading(false);

            }

        };


        loadLoginActivity();

    }, [navigate]);


    // =========================================================
    // GET ACTION
    // =========================================================

    const getAction = (activity) => {

        return (
            activity.action ||
            activity.activity ||
            activity.event ||
            "UNKNOWN"
        );

    };


    // =========================================================
    // DETERMINE STATUS
    // =========================================================

    const getActivityStatus = (activity) => {

        const action = getAction(activity)
            .toString()
            .toUpperCase();


        /*
         * Successful login
         */

        if (
            action === "LOGIN_SUCCESS" ||
            action === "LOGIN_SUCCESSFUL" ||
            action === "LOGIN"
        ) {

            return "SUCCESS";

        }


        /*
         * Failed login
         */

        if (
            action === "LOGIN_FAILED" ||
            action === "LOGIN_FAILURE" ||
            action === "LOGIN_FAIL" ||
            action.includes("FAILED")
        ) {

            return "FAILED";

        }


        /*
         * Suspicious activity
         */

        if (
            action === "SUSPICIOUS" ||
            action === "SUSPICIOUS_ACTIVITY" ||
            action.includes("SUSPICIOUS")
        ) {

            return "SUSPICIOUS";

        }


        /*
         * If backend already provides status
         */

        if (activity.status) {

            return activity.status
                .toString()
                .toUpperCase();

        }


        return "INFO";

    };


    // =========================================================
    // COUNT SUCCESSFUL LOGINS
    // =========================================================

    const successfulLogins =
        activities.filter(
            activity =>
                getActivityStatus(activity) === "SUCCESS"
        ).length;


    // =========================================================
    // COUNT FAILED ATTEMPTS
    // =========================================================

    const failedAttempts =
        activities.filter(
            activity =>
                getActivityStatus(activity) === "FAILED"
        ).length;


    // =========================================================
    // COUNT SUSPICIOUS ATTEMPTS
    // =========================================================

    const suspiciousAttempts =
        activities.filter(
            activity =>
                getActivityStatus(activity) === "SUSPICIOUS"
        ).length;


    // =========================================================
    // GET TIMESTAMP
    // =========================================================

    const getTimestamp = (activity) => {

        return (
            activity.timestamp ||
            activity.loginTime ||
            activity.dateTime ||
            activity.createdAt ||
            null
        );

    };


    // =========================================================
    // DATE FORMAT
    // =========================================================

    const formatDate = (dateTime) => {

        if (!dateTime) {

            return "—";

        }


        const date = new Date(dateTime);


        if (isNaN(date.getTime())) {

            return "—";

        }


        return date.toLocaleDateString();

    };


    // =========================================================
    // TIME FORMAT
    // =========================================================

    const formatTime = (dateTime) => {

        if (!dateTime) {

            return "—";

        }


        const date = new Date(dateTime);


        if (isNaN(date.getTime())) {

            return "—";

        }


        return date.toLocaleTimeString();

    };


    // =========================================================
    // GET STATUS CLASS
    // =========================================================

    const getStatusClass = (status) => {

        if (status === "SUCCESS") {

            return "status-success";

        }


        if (status === "FAILED") {

            return "status-failed";

        }


        if (status === "SUSPICIOUS") {

            return "status-suspicious";

        }


        return "";

    };


    // =========================================================
    // GET REASON
    // =========================================================

    const getReason = (activity) => {

        if (activity.reason) {

            return activity.reason;

        }


        const status =
            getActivityStatus(activity);


        if (status === "SUCCESS") {

            return "Valid credentials";

        }


        if (status === "FAILED") {

            return "Invalid login attempt";

        }


        if (status === "SUSPICIOUS") {

            return "Multiple failed attempts";

        }


        return "—";

    };


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (

            <div className="security-page">

                <Header />

                <main className="security-content">

                    <div className="security-loading">

                        Loading login activity...

                    </div>

                </main>

            </div>

        );

    }


    // =========================================================
    // PAGE
    // =========================================================

    return (

        <div className="security-page">

            <Header />


            <main className="security-content">


                {/* =================================================
                    PAGE HEADER
                ================================================= */}

                <div className="security-heading">

                    <div>

                        <h1>
                            Login Security
                        </h1>

                        <p>
                            Monitor your account login
                            activity and suspicious attempts.
                        </p>

                    </div>

                </div>


                {/* =================================================
                    SECURITY SUMMARY
                ================================================= */}

                <div className="security-cards">


                    {/* SUCCESS */}

                    <div className="security-card success-card">

                        <div className="security-card-title">

                            <span className="security-icon">
                                ✓
                            </span>

                            <h3>
                                Successful Logins
                            </h3>

                        </div>

                        <strong>
                            {successfulLogins}
                        </strong>

                        <p>
                            Valid credentials
                        </p>

                    </div>


                    {/* FAILED */}

                    <div className="security-card failed-card">

                        <div className="security-card-title">

                            <span className="security-icon">
                                !
                            </span>

                            <h3>
                                Failed Attempts
                            </h3>

                        </div>

                        <strong>
                            {failedAttempts}
                        </strong>

                        <p>
                            Invalid login attempts
                        </p>

                    </div>


                    {/* SUSPICIOUS */}

                    <div className="security-card suspicious-card">

                        <div className="security-card-title">

                            <span className="security-icon">
                                ⚠
                            </span>

                            <h3>
                                Suspicious Attempts
                            </h3>

                        </div>

                        <strong>
                            {suspiciousAttempts}
                        </strong>

                        <p>
                            Multiple failed attempts
                        </p>

                    </div>


                </div>


                {/* =================================================
                    LOGIN ACTIVITY
                ================================================= */}

                <div className="activity-section">

                    <div className="activity-header">

                        <div>

                            <h2>
                                Login Activity
                            </h2>

                            <p>
                                Recent login attempts for your account
                            </p>

                        </div>

                    </div>


                    <div className="table-wrapper">

                        <table className="security-table">

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

                                {activities.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="5"
                                            className="no-activity"
                                        >

                                            No login activity found.

                                        </td>

                                    </tr>

                                ) : (

                                    activities.map(
                                        (activity, index) => {

                                            const action =
                                                getAction(activity);

                                            const status =
                                                getActivityStatus(
                                                    activity
                                                );

                                            const timestamp =
                                                getTimestamp(
                                                    activity
                                                );


                                            return (

                                                <tr
                                                    key={
                                                        activity.id ||
                                                        index
                                                    }
                                                >

                                                    {/* DATE */}

                                                    <td>

                                                        {
                                                            formatDate(
                                                                timestamp
                                                            )
                                                        }

                                                    </td>


                                                    {/* TIME */}

                                                    <td>

                                                        {
                                                            formatTime(
                                                                timestamp
                                                            )
                                                        }

                                                    </td>


                                                    {/* ACTIVITY */}

                                                    <td>

                                                        <span className="activity-name">

                                                            {
                                                                action
                                                            }

                                                        </span>

                                                    </td>


                                                    {/* STATUS */}

                                                    <td>

                                                        <span
                                                            className={
                                                                "status-badge " +
                                                                getStatusClass(
                                                                    status
                                                                )
                                                            }
                                                        >

                                                            {
                                                                status
                                                            }

                                                        </span>

                                                    </td>


                                                    {/* REASON */}

                                                    <td>

                                                        {
                                                            getReason(
                                                                activity
                                                            )
                                                        }

                                                    </td>

                                                </tr>

                                            );

                                        }

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


export default LoginSecurity;