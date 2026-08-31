import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import "./Header.css";


function Header() {

    const navigate = useNavigate();

    const [securityOpen, setSecurityOpen] = useState(false);

    const securityRef = useRef(null);


    // =========================================================
    // LOGOUT
    // =========================================================

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("userId");

        navigate("/");
    };


    // =========================================================
    // CLOSE DROPDOWN WHEN CLICKING OUTSIDE
    // =========================================================

    useEffect(() => {

        const handleClickOutside = (event) => {

            if (
                securityRef.current &&
                !securityRef.current.contains(event.target)
            ) {

                setSecurityOpen(false);
            }
        };


        document.addEventListener(
            "mousedown",
            handleClickOutside
        );


        return () => {

            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );

        };

    }, []);


    // =========================================================
    // SECURITY MENU NAVIGATION
    // =========================================================

    const handleSecurityNavigation = (path) => {

        setSecurityOpen(false);

        navigate(path);
    };


    return (

        <header className="main-header">


            {/* =================================================
                LOGO
            ================================================= */}

            <div
                className="header-logo"
                onClick={() => navigate("/dashboard")}
            >
                SecureVault
            </div>


            {/* =================================================
                MAIN NAVIGATION
            ================================================= */}

            <nav className="header-navigation">


                {/* DASHBOARD */}

                <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                        isActive
                            ? "header-link active"
                            : "header-link"
                    }
                >
                    Dashboard
                </NavLink>


                {/* CREDENTIALS */}

                <NavLink
                    to="/add-credential"
                    className={({ isActive }) =>
                        isActive
                            ? "header-link active"
                            : "header-link"
                    }
                >
                    Credentials
                </NavLink>


                {/* =================================================
                    SECURITY DROPDOWN
                ================================================= */}

                <div
                    className="security-dropdown"
                    ref={securityRef}
                >


                    {/* SECURITY BUTTON */}

                    <button
                        type="button"
                        className={
                            `security-dropdown-button ${
                                window.location.pathname.startsWith(
                                    "/security"
                                )
                                    ? "security-active"
                                    : ""
                            }`
                        }
                        onClick={() =>
                            setSecurityOpen(
                                !securityOpen
                            )
                        }
                    >

                        <span>
                            Security
                        </span>

                        <span
                            className={
                                securityOpen
                                    ? "dropdown-arrow open"
                                    : "dropdown-arrow"
                            }
                        >
                            ▾
                        </span>

                    </button>


                    {/* =================================================
                        DROPDOWN MENU
                    ================================================= */}

                    {securityOpen && (

                        <div className="security-dropdown-menu">


                            {/* LOGIN SECURITY */}

                            <button
                                type="button"
                                className="security-menu-item"
                                onClick={() =>
                                    handleSecurityNavigation(
                                        "/security"
                                    )
                                }
                            >

                                <span className="security-menu-icon">
                                    🔐
                                </span>

                                <span className="security-menu-content">

                                    <strong>
                                        Login Security
                                    </strong>

                                    <small>
                                        Login attempts and security monitoring
                                    </small>

                                </span>

                            </button>


                            {/* SUSPICIOUS ACTIVITY */}

                            <button
                                type="button"
                                className="security-menu-item"
                                onClick={() =>
                                    handleSecurityNavigation(
                                        "/security/suspicious"
                                    )
                                }
                            >

                                <span className="security-menu-icon">
                                    ⚠
                                </span>

                                <span className="security-menu-content">

                                    <strong>
                                        Suspicious Activity
                                    </strong>

                                    <small>
                                        Review unusual account activity
                                    </small>

                                </span>

                            </button>


                            {/* AUDIT LOGS */}

                            <button
                                type="button"
                                className="security-menu-item"
                                onClick={() =>
                                    handleSecurityNavigation(
                                        "/security/audit-logs"
                                    )
                                }
                            >

                                <span className="security-menu-icon">
                                    📋
                                </span>

                                <span className="security-menu-content">

                                    <strong>
                                        Audit Logs
                                    </strong>

                                    <small>
                                        View your security actions
                                    </small>

                                </span>

                            </button>


                            {/* SECURITY ALERTS */}

                            <button
                                type="button"
                                className="security-menu-item"
                                onClick={() =>
                                    handleSecurityNavigation(
                                        "/security/alerts"
                                    )
                                }
                            >

                                <span className="security-menu-icon">
                                    🔔
                                </span>

                                <span className="security-menu-content">

                                    <strong>
                                        Security Alerts
                                    </strong>

                                    <small>
                                        Important security notifications
                                    </small>

                                </span>

                            </button>


                        </div>

                    )}

                </div>


                {/* REPORTS */}

                <NavLink
                    to="/reports"
                    className={({ isActive }) =>
                        isActive
                            ? "header-link active"
                            : "header-link"
                    }
                >
                    Reports
                </NavLink>


                {/* PROFILE */}

                <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                        isActive
                            ? "header-link active"
                            : "header-link"
                    }
                >
                    Profile
                </NavLink>


            </nav>


            {/* =================================================
                RIGHT SIDE
            ================================================= */}

            <div className="header-right">

                <button
                    type="button"
                    className="logout-button"
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </div>


        </header>

    );

}


export default Header;