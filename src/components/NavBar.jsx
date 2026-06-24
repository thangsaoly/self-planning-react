import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function NavBar({ onLoginClick, onSignupClick, isOnline = true, pendingCount = 0 }) {
    const { pathname } = useLocation();
    const { user, logout } = useAuth();
    const { addToast } = useToast();
    const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

    const handleLogoutClick = () => {
        setIsLogoutConfirmOpen(true);
    };

    const isHome = pathname === "/";
    const isAbout = pathname.startsWith("/about");
    const isDashboard = pathname.startsWith("/dashboard");

    const showProfile = !!user;
    const userName = user ? user.name : "User";

    const baseLinkClasses =
        "text-[color:var(--color-text-primary)] no-underline hover:bg-[color:var(--color-white-alpha-10)] rounded-md p-1 transition-all";

    const homeClasses = `${baseLinkClasses} ${isHome ? "text-[color:var(--color-primary-blue)] font-semibold" : ""
        }`;

    const aboutClasses = `${baseLinkClasses} ${isAbout ? "text-[color:var(--color-primary-blue)] font-semibold" : ""
        }`;

    const dashboardClasses = `${baseLinkClasses} ${isDashboard ? "text-[color:var(--color-primary-blue)] font-semibold" : ""
        }`;

    return (
        <>
            <header className="col-start-1 row-start-1 w-[95%] fixed top-5 mx-auto transition-all duration-500 z-[100] display-flex items-center justify-center">
                <nav className="flex flex-col lg:flex-row justify-between bg-[color:var(--color-bg-overlay)] rounded-[10px] px-2 lg:px-4 py-2 shadow-[var(--shadow-sm)] backdrop-blur-sm">
                    <div className="logo w-full lg:w-auto flex justify-between items-center">
                        <Link to="/">
                            <img src="/img/Self-Planning-Logo.png" alt="logo" className="h-12" />
                        </Link>
                        {/* mobile menu icons can be wired later */}
                    </div>
                    <div className="link w-full lg:flex-1 flex flex-col lg:flex-row items-center gap-4 lg:gap-0">
                        <ul className="flex flex-col lg:flex-row gap-0.5 lg:gap-12 w-full lg:w-auto lg:mx-auto">
                            <li className="flex flex-row gap-5 justify-center lg:justify-center">
                                <Link to="/" className={homeClasses}>
                                    Home
                                </Link>
                                {user && (
                                    <Link to="/dashboard" className={dashboardClasses}>
                                        Dashboard
                                    </Link>
                                )}
                                <Link to="/about" className={aboutClasses}>
                                    About
                                </Link>
                                <a
                                    href="/#features"
                                    className={baseLinkClasses}
                                >
                                    Feature
                                </a>
                                <a
                                    href="/#Contact"
                                    className={baseLinkClasses}
                                >
                                    Contact
                                </a>
                            </li>
                        </ul>
                        <div className="log-sign flex flex-col lg:flex-row gap-2.5 w-full lg:w-auto items-center">
                            {/* Offline indicator pill */}
                            {!isOnline && (
                                <div
                                    id="navbar-offline-badge"
                                    className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-medium transition-all duration-300"
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                                    <span>Offline{pendingCount > 0 ? ` (${pendingCount} pending)` : ""}</span>
                                </div>
                            )}
                            {showProfile ? (
                                /* Profile section when logged in */
                                <div className="profile flex items-center gap-3 px-3 py-1.5 bg-[color:var(--color-bg-card)] rounded-full">
                                    <div className="avatar w-8 h-8 rounded-full bg-[color:var(--color-primary-blue)] flex items-center justify-center text-white font-semibold text-sm">
                                        {userName.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-[color:var(--color-text-primary)] text-sm font-medium">
                                        {userName}
                                    </span>
                                    <Link to="/profile" className="text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-primary-blue)] transition-colors cursor-pointer" title="Profile">
                                        <i className="fi fi-rr-user" />
                                    </Link>
                                    <button onClick={handleLogoutClick} className="text-[color:var(--color-text-secondary)] hover:text-red-500 transition-colors cursor-pointer" title="Log Out">
                                        <i className="fi fi-rr-sign-out-alt" />
                                    </button>
                                </div>
                            ) : (
                                /* Login/Signup buttons when not logged in */
                                <>
                                    <div className="w-full lg:w-auto">
                                        <button
                                            type="button"
                                            onClick={onLoginClick}
                                            className="w-full bg-[color:var(--color-primary-blue)] text-[color:var(--color-text-primary)] text-[length:var(--font-size-h4)] py-1.5 px-2.5 rounded-[10px] border border-[color:var(--color-primary-blue)] cursor-pointer transition-all duration-500 hover:bg-[color:var(--color-primary-blue-alpha-80)] hover:border-[color:var(--color-primary-blue-alpha-80)] hover:translate-y-1"
                                        >
                                            Log in
                                        </button>
                                    </div>
                                    <div className="w-full lg:w-auto">
                                        <button
                                            type="button"
                                            onClick={onSignupClick}
                                            className="w-full bg-[color:var(--color-primary-blue)] text-[color:var(--color-text-primary)] text-[length:var(--font-size-h4)] py-1.5 px-2.5 rounded-[10px] border border-[color:var(--color-primary-blue)] cursor-pointer transition-all duration-500 hover:bg-[color:var(--color-primary-blue-alpha-80)] hover:border-[color:var(--color-primary-blue-alpha-80)] hover:translate-y-1"
                                        >
                                            Sign up
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </nav>
            </header>

            {/* Custom logout modal */}
            {isLogoutConfirmOpen && (
                <div 
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm"
                    onClick={() => setIsLogoutConfirmOpen(false)}
                >
                    <div 
                        className="bg-[color:var(--color-bg-card)] border border-[color:var(--color-border-primary)] p-6 rounded-xl shadow-2xl animate-fade-in flex flex-col gap-4 max-w-sm w-[90%] pointer-events-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center gap-3 text-red-500">
                            <i className="fi fi-rr-sign-out-alt text-2xl flex items-center" />
                            <h3 className="text-lg font-semibold text-[color:var(--color-text-primary)]">Log Out</h3>
                        </div>
                        <p className="text-sm text-[color:var(--color-text-secondary)]">
                            Are you sure you want to log out of your account?
                        </p>
                        <div className="flex gap-3 justify-end mt-2">
                            <button
                                type="button"
                                onClick={() => setIsLogoutConfirmOpen(false)}
                                className="px-4 py-2 text-xs font-medium text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)] hover:bg-[color:var(--color-bg-secondary)] rounded-lg transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsLogoutConfirmOpen(false);
                                    logout();
                                    addToast("Logged out successfully", "info");
                                }}
                                className="px-4 py-2 text-xs font-medium bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors cursor-pointer"
                            >
                                Log Out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
