import { useEffect, useState } from "react";
import Header from "../Common/Header";
import API from "../../services/api";
import "./Reports.css";

function SuspiciousActivity() {

    const [activities, setActivities] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    useEffect(() => {

        const fetchActivities = async () => {

            const email =
                localStorage.getItem("email");

            const token =
                localStorage.getItem("token");

            if (!token || !email) {

                setError(
                    "Session expired. Please login again."
                );

                setLoading(false);

                return;
            }


            try {

                const response =
                    await API.get(
                        `/suspicious-activity?email=${encodeURIComponent(email)}`
                    );

                setActivities(response.data || []);

            } catch (error) {

                console.error(
                    "SUSPICIOUS ACTIVITY ERROR:",
                    error
                );

                setError(
                    "Unable to load suspicious activities."
                );

            } finally {

                setLoading(false);

            }

        };

        fetchActivities();

    }, []);


    return (

        <div className="reports-page">

            <Header />

            <main className="reports-content">

                <div className="reports-heading">

                    <h1>
                        Suspicious Activity
                    </h1>

                    <p>
                        Review suspicious activities detected on your account.
                    </p>

                </div>


                {loading && (
                    <div className="reports-loading">
                        Loading suspicious activities...
                    </div>
                )}


                {error && (
                    <div className="reports-error">
                        {error}
                    </div>
                )}


                {!loading && !error && (

                    <div className="activity-report">

                        <div className="table-wrapper">

                            <table className="reports-table">

                                <thead>

                                    <tr>
                                        <th>Date</th>
                                        <th>Time</th>
                                        <th>Activity</th>
                                        <th>Description</th>
                                        <th>Status</th>
                                    </tr>

                                </thead>


                                <tbody>

                                    {activities.length > 0 ? (

                                        activities.map((activity) => (

                                            <tr key={activity.id}>

                                                <td>
                                                    {new Date(
                                                        activity.detectedAt
                                                    ).toLocaleDateString("en-IN")}
                                                </td>

                                                <td>
                                                    {new Date(
                                                        activity.detectedAt
                                                    ).toLocaleTimeString(
                                                        "en-IN",
                                                        {
                                                            hour: "2-digit",
                                                            minute: "2-digit"
                                                        }
                                                    )}
                                                </td>

                                                <td>
                                                    {activity.activityType}
                                                </td>

                                                <td>
                                                    {activity.description}
                                                </td>

                                                <td>

                                                    <span
                                                        className={`status-badge ${activity.status?.toLowerCase()}`}
                                                    >
                                                        {activity.status}
                                                    </span>

                                                </td>

                                            </tr>

                                        ))

                                    ) : (

                                        <tr>

                                            <td
                                                colSpan="5"
                                                className="no-activity"
                                            >
                                                No suspicious activity detected.
                                            </td>

                                        </tr>

                                    )}

                                </tbody>

                            </table>

                        </div>

                    </div>

                )}

            </main>

        </div>

    );
}

export default SuspiciousActivity;