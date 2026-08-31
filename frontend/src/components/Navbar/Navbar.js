import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {

    const navigate = useNavigate();

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("userId");

        navigate("/");
    };

    return (

        <header className="navbar">

            {/* Logo */}

            <div
                className="navbar-logo"
                onClick={() => navigate("/dashboard")}
            >
                <span className="logo-icon">🔐</span>
                <span>SecureVault</span>
            </div>


            {/* Navigation */}

            <nav className="navbar-links">

                <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                        isActive
                            ? "nav-link active"
                            : "nav-link"
                    }
                >
                    Dashboard
                </NavLink>


                <NavLink
                    to="/credentials"
                    className={({ isActive }) =>
                        isActive
                            ? "nav-link active"
                            : "nav-link"
                    }
                >
                    Credentials
                </NavLink>


                <NavLink
                    to="/security"
                    className={({ isActive }) =>
                        isActive
                            ? "nav-link active"
                            : "nav-link"
                    }
                >
                    Security
                </NavLink>


                {/* Reports */}

                <NavLink
                    to="/reports"
                    className={({ isActive }) =>
                        isActive
                            ? "nav-link active"
                            : "nav-link"
                    }
                >
                    Reports
                </NavLink>


                <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                        isActive
                            ? "nav-link active"
                            : "nav-link"
                    }
                >
                    Profile
                </NavLink>

            </nav>


            {/* Logout */}

            <button
                type="button"
                className="logout-button"
                onClick={handleLogout}
            >
                Logout
            </button>

        </header>

    );
}

export default Navbar;