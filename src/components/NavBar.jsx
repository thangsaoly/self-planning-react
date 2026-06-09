import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NavBar({ onLoginClick, onSignupClick }) {
    const { pathname } = useLocation();
    const { user, logout } = useAuth();

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

    return (
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
                        {showProfile ? (
                            /* Profile section when logged in */
                            <div className="profile flex items-center gap-3 px-3 py-1.5 bg-[color:var(--color-bg-card)] rounded-full">
                                <div className="avatar w-8 h-8 rounded-full bg-[color:var(--color-primary-blue)] flex items-center justify-center text-white font-semibold text-sm">
                                    {userName.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-[color:var(--color-text-primary)] text-sm font-medium">
                                    {userName}
                                </span>
                                <button onClick={logout} className="text-[color:var(--color-text-secondary)] hover:text-red-500 transition-colors" title="Log Out">
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
    );
}
