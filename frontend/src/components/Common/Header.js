import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

import API from "../../services/api";
import "./Header.css";

function Header() {
    const navigate = useNavigate();
    const location = useLocation();

    // =========================================================
    // STATE
    // =========================================================

    const [securityOpen, setSecurityOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const [notificationOpen, setNotificationOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const securityRef = useRef(null);
    const notificationRef = useRef(null);

    // =========================================================
    // LOGOUT
    // =========================================================

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("userId");

        setSecurityOpen(false);
        setNotificationOpen(false);
        setMobileMenuOpen(false);

        setNotifications([]);
        setUnreadCount(0);

        navigate("/");
    };

    // =========================================================
    // LOAD NOTIFICATIONS
    // =========================================================

    useEffect(() => {
        const userId = localStorage.getItem("userId");

        if (!userId) {
            return;
        }

        const loadNotifications = async () => {
            try {
                // Get all notifications
                const response = await API.get(
                    `/notifications/user/${userId}`
                );

                setNotifications(response.data);

                // Get unread count
                const unreadResponse = await API.get(
                    `/notifications/count/${userId}`
                );

                setUnreadCount(unreadResponse.data);
            } catch (error) {
                console.error(
                    "Failed to load notifications:",
                    error
                );
            }
        };

        loadNotifications();
    }, []);

    // =========================================================
    // CLOSE DROPDOWNS WHEN CLICKING OUTSIDE
    // =========================================================

    useEffect(() => {
        const handleClickOutside = (event) => {
            // Close Security dropdown
            if (
                securityRef.current &&
                !securityRef.current.contains(event.target)
            ) {
                setSecurityOpen(false);
            }

            // Close Notification dropdown
            if (
                notificationRef.current &&
                !notificationRef.current.contains(event.target)
            ) {
                setNotificationOpen(false);
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
    // CLOSE MENUS AFTER ROUTE CHANGE
    // =========================================================

    useEffect(() => {
        setMobileMenuOpen(false);
        setSecurityOpen(false);
        setNotificationOpen(false);
    }, [location.pathname]);

    // =========================================================
    // SECURITY NAVIGATION
    // =========================================================

    const handleSecurityNavigation = (path) => {
        setSecurityOpen(false);
        setNotificationOpen(false);
        setMobileMenuOpen(false);

        navigate(path);
    };

    // =========================================================
    // NORMAL NAVIGATION
    // =========================================================

    const handleNavigation = (path) => {
        setSecurityOpen(false);
        setNotificationOpen(false);
        setMobileMenuOpen(false);

        navigate(path);
    };

    // =========================================================
    // ACTIVE SECURITY CHECK
    // =========================================================

    const securityActive =
        location.pathname.startsWith("/security");

    // =========================================================
    // CLOSE MOBILE MENU
    // =========================================================

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
        setSecurityOpen(false);
        setNotificationOpen(false);
    };

    // =========================================================
    // NOTIFICATION FUNCTIONS
    // =========================================================

    const toggleNotifications = () => {
        setNotificationOpen(
            (previous) => !previous
        );

        // Close Security dropdown
        setSecurityOpen(false);
    };

    // =========================================================
    // MARK NOTIFICATION AS READ
    // =========================================================

    const markNotificationAsRead = async (
        notificationId
    ) => {
        try {
            await API.put(
                `/notifications/read/${notificationId}`
            );

            setNotifications((previous) =>
                previous.map((notification) =>
                    notification.id === notificationId
                        ? {
                              ...notification,
                              read: true,
                          }
                        : notification
                )
            );

            setUnreadCount((previous) =>
                previous > 0
                    ? previous - 1
                    : 0
            );
        } catch (error) {
            console.error(
                "Failed to mark notification as read:",
                error
            );
        }
    };

    // =========================================================
    // FORMAT NOTIFICATION TIME
    // =========================================================

    const formatNotificationTime = (createdAt) => {
        if (!createdAt) {
            return "";
        }

        try {
            return new Date(
                createdAt
            ).toLocaleString();
        } catch (error) {
            return "";
        }
    };

    // =========================================================
    // RENDER
    // =========================================================

    return (
        <header className="main-header">

            <div className="header-inner">

                {/* =================================================
                    LOGO
                ================================================= */}

                <div
                    className="header-logo"
                    onClick={() =>
                        handleNavigation("/dashboard")
                    }
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                        if (
                            event.key === "Enter" ||
                            event.key === " "
                        ) {
                            handleNavigation(
                                "/dashboard"
                            );
                        }
                    }}
                    aria-label="Go to Dashboard"
                >
                    <span className="logo-main">
                        SecureVault
                    </span>

                    <span className="logo-subtitle">
                        Password Vault
                    </span>
                </div>

                {/* =================================================
                    NAVIGATION
                ================================================= */}

                <nav
                    id="securevault-navigation"
                    className={`header-nav ${
                        mobileMenuOpen
                            ? "mobile-open"
                            : ""
                    }`}
                    aria-label="Main navigation"
                >

                    {/* DASHBOARD */}

                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) =>
                            isActive
                                ? "header-nav-link active"
                                : "header-nav-link"
                        }
                        onClick={closeMobileMenu}
                    >
                        Dashboard
                    </NavLink>

                    {/* CREDENTIALS */}

                    <NavLink
                        to="/credentials"
                        className={({ isActive }) =>
                            isActive
                                ? "header-nav-link active"
                                : "header-nav-link"
                        }
                        onClick={closeMobileMenu}
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

                        <button
                            type="button"
                            className={`security-dropdown-button ${
                                securityActive
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() =>
                                setSecurityOpen(
                                    (previous) =>
                                        !previous
                                )
                            }
                            aria-expanded={
                                securityOpen
                            }
                            aria-haspopup="menu"
                        >
                            <span>
                                Security
                            </span>

                            <span
                                className={`security-arrow ${
                                    securityOpen
                                        ? "open"
                                        : ""
                                }`}
                            >
                                ▾
                            </span>
                        </button>

                        {/* SECURITY MENU */}

                        {securityOpen && (
                            <div
                                className="security-menu"
                                role="menu"
                            >

                                {/* LOGIN SECURITY */}

                                <button
                                    type="button"
                                    role="menuitem"
                                    className={`security-menu-link ${
                                        location.pathname ===
                                        "/security"
                                            ? "active"
                                            : ""
                                    }`}
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
                                            Login attempts and
                                            security monitoring
                                        </small>
                                    </span>
                                </button>

                                {/* SUSPICIOUS ACTIVITY */}

                                <button
                                    type="button"
                                    role="menuitem"
                                    className={`security-menu-link ${
                                        location.pathname ===
                                        "/security/suspicious"
                                            ? "active"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        handleSecurityNavigation(
                                            "/security/suspicious"
                                        )
                                    }
                                >
                                    <span className="security-menu-icon">
                                        ⚠️
                                    </span>

                                    <span className="security-menu-content">
                                        <strong>
                                            Suspicious Activity
                                        </strong>

                                        <small>
                                            Review unusual
                                            account activity
                                        </small>
                                    </span>
                                </button>

                                {/* AUDIT LOGS */}

                                <button
                                    type="button"
                                    role="menuitem"
                                    className={`security-menu-link ${
                                        location.pathname ===
                                        "/security/audit-logs"
                                            ? "active"
                                            : ""
                                    }`}
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
                                            View your security
                                            actions
                                        </small>
                                    </span>
                                </button>

                                {/* SECURITY ALERTS */}

                                <button
                                    type="button"
                                    role="menuitem"
                                    className={`security-menu-link ${
                                        location.pathname ===
                                        "/security/alerts"
                                            ? "active"
                                            : ""
                                    }`}
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
                                            Important security
                                            notifications
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
                                ? "header-nav-link active"
                                : "header-nav-link"
                        }
                        onClick={closeMobileMenu}
                    >
                        Reports
                    </NavLink>

                    {/* PROFILE */}

                    <NavLink
                        to="/profile"
                        className={({ isActive }) =>
                            isActive
                                ? "header-nav-link active"
                                : "header-nav-link"
                        }
                        onClick={closeMobileMenu}
                    >
                        Profile
                    </NavLink>

                    {/* MOBILE LOGOUT */}

                    <button
                        type="button"
                        className="mobile-logout-link"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </nav>

                {/* =================================================
                    RIGHT SIDE
                ================================================= */}

                <div className="header-right">

                    {/* =================================================
                        NOTIFICATIONS
                    ================================================= */}

                    <div
                        className="notification-container"
                        ref={notificationRef}
                    >

                        <button
                            type="button"
                            className="notification-button"
                            onClick={toggleNotifications}
                            aria-label="Notifications"
                            aria-expanded={
                                notificationOpen
                            }
                        >
                            🔔

                            {unreadCount > 0 && (
                                <span className="notification-badge">
                                    {unreadCount > 99
                                        ? "99+"
                                        : unreadCount}
                                </span>
                            )}
                        </button>

                        {/* =================================================
                            NOTIFICATION DROPDOWN
                        ================================================= */}

                        {notificationOpen && (
                            <div className="notification-dropdown">

                                {/* HEADER */}

                                <div className="notification-header">

                                    <strong>
                                        Notifications
                                    </strong>

                                    {unreadCount > 0 && (
                                        <span>
                                            {unreadCount} unread
                                        </span>
                                    )}

                                </div>

                                {/* NOTIFICATION LIST */}

                                <div className="notification-list">

                                    {notifications.length === 0 ? (

                                        <div className="no-notifications">

                                            <div>
                                                🔔
                                            </div>

                                            <p>
                                                No notifications yet
                                            </p>

                                        </div>

                                    ) : (

                                        notifications.map(
                                            (notification) => (

                                                <div
                                                    key={
                                                        notification.id
                                                    }
                                                    className={`notification-item ${
                                                        notification.read
                                                            ? ""
                                                            : "unread"
                                                    }`}
                                                    onClick={() => {
                                                        if (
                                                            !notification.read
                                                        ) {
                                                            markNotificationAsRead(
                                                                notification.id
                                                            );
                                                        }
                                                    }}
                                                >

                                                    <div className="notification-title">
                                                        {
                                                            notification.title
                                                        }
                                                    </div>

                                                    <div className="notification-message">
                                                        {
                                                            notification.message
                                                        }
                                                    </div>

                                                    <div className="notification-time">
                                                        {formatNotificationTime(
                                                            notification.createdAt
                                                        )}
                                                    </div>

                                                </div>

                                            )
                                        )

                                    )}

                                </div>

                            </div>
                        )}

                    </div>

                    {/* =================================================
                        DESKTOP LOGOUT
                    ================================================= */}

                    <button
                        type="button"
                        className="header-logout"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                    {/* =================================================
                        HAMBURGER
                    ================================================= */}

                    <button
                        type="button"
                        className={`mobile-menu-button ${
                            mobileMenuOpen
                                ? "open"
                                : ""
                        }`}
                        onClick={() =>
                            setMobileMenuOpen(
                                (previous) =>
                                    !previous
                            )
                        }
                        aria-label={
                            mobileMenuOpen
                                ? "Close navigation menu"
                                : "Open navigation menu"
                        }
                        aria-expanded={
                            mobileMenuOpen
                        }
                        aria-controls="securevault-navigation"
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>

                </div>

            </div>

        </header>
    );
}

export default Header;