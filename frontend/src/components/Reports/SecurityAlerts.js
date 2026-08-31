import { useEffect, useState } from "react";
import Header from "../Common/Header";
import API from "../../services/api";
import "./Reports.css";

function SecurityAlerts() {

    const [alerts, setAlerts] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    useEffect(() => {

        const fetchAlerts = async () => {

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
                        `/security-alerts?email=${encodeURIComponent(email)}`
                    );

                setAlerts(response.data || []);

            } catch (error) {

                console.error(
                    "SECURITY ALERT ERROR:",
                    error
                );

                setError(
                    "Unable to load security alerts."
                );

            } finally {

                setLoading(false);

            }

        };

        fetchAlerts();

    }, []);


    return (

        <div className="reports-page">

            <Header />

            <main className="reports-content">

                <div className="reports-heading">

                    <h1>
                        Security Alerts
                    </h1>

                    <p>
                        Important security notifications related to your account.
                    </p>

                </div>


                {loading && (
                    <div className="reports-loading">
                        Loading security alerts...
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
                                        <th>Alert Type</th>
                                        <th>Message</th>
                                        <th>Severity</th>
                                        <th>Status</th>
                                    </tr>

                                </thead>


                                <tbody>

                                    {alerts.length > 0 ? (

                                        alerts.map((alert) => (

                                            <tr key={alert.id}>

                                                <td>
                                                    {new Date(
                                                        alert.createdAt
                                                    ).toLocaleDateString("en-IN")}
                                                </td>

                                                <td>
                                                    {new Date(
                                                        alert.createdAt
                                                    ).toLocaleTimeString(
                                                        "en-IN",
                                                        {
                                                            hour: "2-digit",
                                                            minute: "2-digit"
                                                        }
                                                    )}
                                                </td>

                                                <td>
                                                    {alert.alertType}
                                                </td>

                                                <td>
                                                    {alert.message}
                                                </td>

                                                <td>

                                                    <span
                                                        className={`status-badge ${alert.severity?.toLowerCase()}`}
                                                    >
                                                        {alert.severity}
                                                    </span>

                                                </td>

                                                <td>

                                                    <span
                                                        className={`status-badge ${alert.status?.toLowerCase()}`}
                                                    >
                                                        {alert.status}
                                                    </span>

                                                </td>

                                            </tr>

                                        ))

                                    ) : (

                                        <tr>

                                            <td
                                                colSpan="6"
                                                className="no-activity"
                                            >
                                                No security alerts found.
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

export default SecurityAlerts;