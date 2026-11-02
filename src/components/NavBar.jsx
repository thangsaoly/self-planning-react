import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NavBar({ onLoginClick, onSignupClick, isOnline = true, pendingCount = 0 }) {
    const { pathname } = useLocation();
    const { user } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Auto-close mobile menu whenever the route changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    const isHome = pathname === "/";
    const isAbout = pathname.startsWith("/about");
    const isDashboard = pathname.startsWith("/dashboard");

    const showProfile = !!user;
    const userName = user?.name || user?.fullname || "User";

    const baseLinkClasses =
        "text-(--color-text-primary) no-underline hover:bg-(--color-white-alpha-10) rounded-md px-3 py-1.5 text-sm font-medium transition-all whitespace-nowrap";

    const mobileLinkClasses =
        "text-(--color-text-primary) no-underline hover:bg-(--color-white-alpha-10) rounded-lg px-3 py-2 text-sm font-medium transition-all w-full flex items-center";

    const getLinkClass = (isActive, isMobile = false) => {
        const base = isMobile ? mobileLinkClasses : baseLinkClasses;
        return `${base} ${isActive ? "text-(--color-primary-blue) font-semibold bg-(--color-white-alpha-10)" : ""}`;
    };

    return (
        <>
            <header className="fixed top-3 sm:top-5 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl z-100 transition-all duration-300">
                <nav className="bg-(--color-bg-overlay) rounded-xl px-3 sm:px-5 py-2 sm:py-2.5 shadow-(--shadow-sm) backdrop-blur-md border border-white/10">
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
                            <a href="/#features" className={baseLinkClasses}>
                                Feature
                            </a>
                            <a href="/#Contact" className={baseLinkClasses}>
                                Contact
                            </a>
                            <Link to="/about" className={getLinkClass(isAbout)}>
                                About
                            </Link>
                            {user && (
                                <Link to="/dashboard" className={getLinkClass(isDashboard)}>
                                    Dashboard
                                </Link>
                            )}
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
                                <Link
                                    to="/profile"
                                    className="w-8 h-8 rounded-full bg-(--color-primary-blue) flex items-center justify-center text-white font-semibold text-xs shrink-0 hover:opacity-90 transition-opacity"
                                    aria-label="Open profile"
                                    title="Profile"
                                >
                                    {userName.charAt(0).toUpperCase()}
                                </Link>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={onLoginClick}
                                        className="bg-(--color-primary-blue) text-(--color-text-primary) text-sm font-medium py-1.5 px-3.5 rounded-lg border border-(--color-primary-blue) cursor-pointer transition-all hover:opacity-90"
                                    >
                                        Log in
                                    </button>
                                    <button
                                        type="button"
                                        onClick={onSignupClick}
                                        className="bg-transparent text-(--color-text-primary) text-sm font-medium py-1.5 px-3.5 rounded-lg border border-(--color-border-primary) hover:border-(--color-primary-blue) cursor-pointer transition-all hover:bg-(--color-white-alpha-10)"
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
                                className="p-2 rounded-lg text-(--color-text-primary) hover:bg-(--color-white-alpha-10) transition-colors cursor-pointer flex items-center justify-center"
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
                            <a href="/#features" className={mobileLinkClasses} onClick={() => setIsMobileMenuOpen(false)}>
                                Feature
                            </a>
                            <a href="/#Contact" className={mobileLinkClasses} onClick={() => setIsMobileMenuOpen(false)}>
                                Contact
                            </a>
                            <Link to="/about" className={getLinkClass(isAbout, true)} onClick={() => setIsMobileMenuOpen(false)}>
                                About
                            </Link>
                            {user && (
                                <Link to="/dashboard" className={getLinkClass(isDashboard, true)} onClick={() => setIsMobileMenuOpen(false)}>
                                    Dashboard
                                </Link>
                            )}

                            {/* Mobile Profile / Auth Buttons */}
                            <div className="pt-2 mt-1 border-t border-white/5">
                                {showProfile ? (
                                    <div className="p-2">
                                        <Link
                                            to="/profile"
                                            className="w-8 h-8 rounded-full bg-(--color-primary-blue) flex items-center justify-center text-white font-semibold text-xs shrink-0"
                                            aria-label="Open profile"
                                            title="Profile"
                                        >
                                            {userName.charAt(0).toUpperCase()}
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-2 pt-1">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsMobileMenuOpen(false);
                                                onLoginClick?.();
                                            }}
                                            className="w-full bg-(--color-primary-blue) text-(--color-text-primary) text-sm font-medium py-2 px-3 rounded-lg border border-(--color-primary-blue) cursor-pointer"
                                        >
                                            Log in
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsMobileMenuOpen(false);
                                                onSignupClick?.();
                                            }}
                                            className="w-full bg-transparent text-(--color-text-primary) text-sm font-medium py-2 px-3 rounded-lg border border-(--color-border-primary) cursor-pointer"
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

        </>
    );
}
