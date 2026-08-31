import { useEffect, useState } from "react";
import Header from "../Common/Header";
import API from "../../services/api";
import "./Reports.css";

function AuditLogs() {

    const [logs, setLogs] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    useEffect(() => {

        const fetchLogs = async () => {

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
                        `/audit-logs?email=${encodeURIComponent(email)}`
                    );

                setLogs(response.data || []);

            } catch (error) {

                console.error(
                    "AUDIT LOG ERROR:",
                    error
                );

                setError(
                    "Unable to load audit logs."
                );

            } finally {

                setLoading(false);

            }

        };

        fetchLogs();

    }, []);


    return (

        <div className="reports-page">

            <Header />

            <main className="reports-content">

                <div className="reports-heading">

                    <h1>
                        Audit Logs
                    </h1>

                    <p>
                        Review the activities performed on your SecureVault account.
                    </p>

                </div>


                {loading && (
                    <div className="reports-loading">
                        Loading audit logs...
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
                                        <th>Action</th>
                                        <th>Description</th>
                                    </tr>

                                </thead>


                                <tbody>

                                    {logs.length > 0 ? (

                                        logs.map((log) => (

                                            <tr key={log.id}>

                                                <td>
                                                    {new Date(
                                                        log.timestamp
                                                    ).toLocaleDateString("en-IN")}
                                                </td>

                                                <td>
                                                    {new Date(
                                                        log.timestamp
                                                    ).toLocaleTimeString(
                                                        "en-IN",
                                                        {
                                                            hour: "2-digit",
                                                            minute: "2-digit"
                                                        }
                                                    )}
                                                </td>

                                                <td>
                                                    {log.action}
                                                </td>

                                                <td>
                                                    {log.description}
                                                </td>

                                            </tr>

                                        ))

                                    ) : (

                                        <tr>

                                            <td
                                                colSpan="4"
                                                className="no-activity"
                                            >
                                                No audit logs found.
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

export default AuditLogs;