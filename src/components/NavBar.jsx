import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function NavBar({ onLoginClick, onSignupClick, isOnline = true, pendingCount = 0 }) {
    const { pathname } = useLocation();
    const { user, logout } = useAuth();
    const { addToast } = useToast();
    const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Auto-close mobile menu whenever the route changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    const handleLogoutClick = () => {
        setIsLogoutConfirmOpen(true);
    };

    const isHome = pathname === "/";
    const isAbout = pathname.startsWith("/about");
    const isDashboard = pathname.startsWith("/dashboard");

    const showProfile = !!user;
    const userName = user?.name || user?.fullname || "User";

    const baseLinkClasses =
        "text-[color:var(--color-text-primary)] no-underline hover:bg-[color:var(--color-white-alpha-10)] rounded-md px-3 py-1.5 text-sm font-medium transition-all whitespace-nowrap";

    const mobileLinkClasses =
        "text-[color:var(--color-text-primary)] no-underline hover:bg-[color:var(--color-white-alpha-10)] rounded-lg px-3 py-2 text-sm font-medium transition-all w-full flex items-center";

    const getLinkClass = (isActive, isMobile = false) => {
        const base = isMobile ? mobileLinkClasses : baseLinkClasses;
        return `${base} ${isActive ? "text-[color:var(--color-primary-blue)] font-semibold bg-[color:var(--color-white-alpha-10)]" : ""}`;
    };

    return (
        <>
            <header className="fixed top-3 sm:top-5 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl z-[100] transition-all duration-300">
                <nav className="bg-[color:var(--color-bg-overlay)] rounded-xl px-3 sm:px-5 py-2 sm:py-2.5 shadow-[var(--shadow-sm)] backdrop-blur-md border border-white/10">
                    {/* Top Row: Logo, desktop nav, desktop actions, and mobile hamburger */}
                    <div className="flex items-center justify-between w-full">
                        {/* Logo */}
                        <div className="flex items-center shrink-0">
                            <Link to="/" className="flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
                                <img
                                    src="/img/Self-Planning-Logo.png"
                                    alt="Self-Planning Logo"
                                    className="h-8 sm:h-10 md:h-11 w-auto object-contain"
                                />
                            </Link>
                        </div>

                        {/* Desktop Navigation Links */}
                        <div className="hidden lg:flex items-center gap-2 xl:gap-4 mx-auto">
                            <Link to="/" className={getLinkClass(isHome)}>
                                Home
                            </Link>
                            {user && (
                                <Link to="/dashboard" className={getLinkClass(isDashboard)}>
                                    Dashboard
                                </Link>
                            )}
                            <Link to="/about" className={getLinkClass(isAbout)}>
                                About
                            </Link>
                            <a href="/#features" className={baseLinkClasses}>
                                Feature
                            </a>
                            <a href="/#Contact" className={baseLinkClasses}>
                                Contact
                            </a>
                        </div>

                        {/* Desktop Profile / Auth Section */}
                        <div className="hidden lg:flex items-center gap-3 shrink-0">
                            {/* Offline indicator */}
                            {!isOnline && (
                                <div
                                    id="navbar-offline-badge"
                                    className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-medium"
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                                    <span>Offline{pendingCount > 0 ? ` (${pendingCount})` : ""}</span>
                                </div>
                            )}

                            {showProfile ? (
                                <div className="flex items-center gap-2.5 px-3 py-1 bg-[color:var(--color-bg-card)] rounded-full border border-white/5">
                                    <div className="w-7 h-7 rounded-full bg-[color:var(--color-primary-blue)] flex items-center justify-center text-white font-semibold text-xs shrink-0">
                                        {userName.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-[color:var(--color-text-primary)] text-sm font-medium max-w-[130px] truncate">
                                        {userName}
                                    </span>
                                    <Link
                                        to="/profile"
                                        className="text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-primary-blue)] transition-colors p-1"
                                        title="Profile"
                                    >
                                        <i className="fi fi-rr-user text-sm flex items-center" />
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={handleLogoutClick}
                                        className="text-[color:var(--color-text-secondary)] hover:text-red-500 transition-colors p-1 cursor-pointer"
                                        title="Log Out"
                                    >
                                        <i className="fi fi-rr-sign-out-alt text-sm flex items-center" />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={onLoginClick}
                                        className="bg-[color:var(--color-primary-blue)] text-[color:var(--color-text-primary)] text-sm font-medium py-1.5 px-3.5 rounded-lg border border-[color:var(--color-primary-blue)] cursor-pointer transition-all hover:opacity-90"
                                    >
                                        Log in
                                    </button>
                                    <button
                                        type="button"
                                        onClick={onSignupClick}
                                        className="bg-transparent text-[color:var(--color-text-primary)] text-sm font-medium py-1.5 px-3.5 rounded-lg border border-[color:var(--color-border-primary)] hover:border-[color:var(--color-primary-blue)] cursor-pointer transition-all hover:bg-[color:var(--color-white-alpha-10)]"
                                    >
                                        Sign up
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Mobile Actions: Offline badge + Hamburger button */}
                        <div className="flex lg:hidden items-center gap-2">
                            {!isOnline && (
                                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" title="Offline" />
                            )}
                            <button
                                type="button"
                                aria-label="Toggle navigation menu"
                                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                                className="p-2 rounded-lg text-[color:var(--color-text-primary)] hover:bg-[color:var(--color-white-alpha-10)] transition-colors cursor-pointer flex items-center justify-center"
                            >
                                {isMobileMenuOpen ? (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                ) : (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Dropdown Menu */}
                    {isMobileMenuOpen && (
                        <div className="lg:hidden mt-3 pt-3 border-t border-white/10 flex flex-col gap-1.5 animate-fade-in">
                            <Link to="/" className={getLinkClass(isHome, true)} onClick={() => setIsMobileMenuOpen(false)}>
                                Home
                            </Link>
                            {user && (
                                <Link to="/dashboard" className={getLinkClass(isDashboard, true)} onClick={() => setIsMobileMenuOpen(false)}>
                                    Dashboard
                                </Link>
                            )}
                            <Link to="/about" className={getLinkClass(isAbout, true)} onClick={() => setIsMobileMenuOpen(false)}>
                                About
                            </Link>
                            <a href="/#features" className={mobileLinkClasses} onClick={() => setIsMobileMenuOpen(false)}>
                                Feature
                            </a>
                            <a href="/#Contact" className={mobileLinkClasses} onClick={() => setIsMobileMenuOpen(false)}>
                                Contact
                            </a>

                            {/* Mobile Profile / Auth Buttons */}
                            <div className="pt-2 mt-1 border-t border-white/5">
                                {showProfile ? (
                                    <div className="flex items-center justify-between p-2 rounded-lg bg-[color:var(--color-bg-card)]">
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <div className="w-8 h-8 rounded-full bg-[color:var(--color-primary-blue)] flex items-center justify-center text-white font-semibold text-xs shrink-0">
                                                {userName.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="text-[color:var(--color-text-primary)] text-sm font-medium truncate">
                                                {userName}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1 shrink-0">
                                            <Link
                                                to="/profile"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="p-2 text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-primary-blue)] transition-colors"
                                                title="Profile"
                                            >
                                                <i className="fi fi-rr-user text-base flex items-center" />
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsMobileMenuOpen(false);
                                                    handleLogoutClick();
                                                }}
                                                className="p-2 text-[color:var(--color-text-secondary)] hover:text-red-500 transition-colors cursor-pointer"
                                                title="Log Out"
                                            >
                                                <i className="fi fi-rr-sign-out-alt text-base flex items-center" />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-2 pt-1">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsMobileMenuOpen(false);
                                                onLoginClick?.();
                                            }}
                                            className="w-full bg-[color:var(--color-primary-blue)] text-[color:var(--color-text-primary)] text-sm font-medium py-2 px-3 rounded-lg border border-[color:var(--color-primary-blue)] cursor-pointer"
                                        >
                                            Log in
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsMobileMenuOpen(false);
                                                onSignupClick?.();
                                            }}
                                            className="w-full bg-transparent text-[color:var(--color-text-primary)] text-sm font-medium py-2 px-3 rounded-lg border border-[color:var(--color-border-primary)] cursor-pointer"
                                        >
                                            Sign up
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
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
