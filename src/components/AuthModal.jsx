import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AuthModal({ isOpen, mode, onClose, onSwitchMode }) {
    const navigate = useNavigate();
    const { login } = useAuth();

    // Form state
    const [loginForm, setLoginForm] = useState({ email: "", password: "" });
    const [signupForm, setSignupForm] = useState({ fullname: "", email: "", password: "" });
    const [showLoginPassword, setShowLoginPassword] = useState(false);
    const [showSignupPassword, setShowSignupPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const handleLoginChange = (e) => {
        setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSignupChange = (e) => {
        setSignupForm({ ...signupForm, [e.target.name]: e.target.value });
        setError("");
    };

    const handleLoginSubmit = (event) => {
        event.preventDefault();
        if (!loginForm.email || !loginForm.password) {
            setError("Please fill in all fields");
            return;
        }
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            login({ name: loginForm.email.split("@")[0], email: loginForm.email });
            setLoginForm({ email: "", password: "" });
            onClose();
            navigate("/dashboard");
        }, 800);
    };

    const handleSignupSubmit = (event) => {
        event.preventDefault();
        if (!signupForm.fullname || !signupForm.email || !signupForm.password) {
            setError("Please fill in all fields");
            return;
        }
        if (signupForm.password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            login({ name: signupForm.fullname, email: signupForm.email });
            setSignupForm({ fullname: "", email: "", password: "" });
            onClose();
            navigate("/dashboard");
        }, 800);
    };

    const handleSwitchMode = (newMode) => {
        setError("");
        setShowLoginPassword(false);
        setShowSignupPassword(false);
        onSwitchMode(newMode);
    };

    const handleGoogleSignIn = () => {
        setIsLoading(true);
        // Simulate Google OAuth
        setTimeout(() => {
            setIsLoading(false);
            login({ name: "Google User", email: "google@example.com" });
            onClose();
            navigate("/dashboard");
        }, 800);
    };

    const isLogin = mode === "login";

    const inputClasses = "w-full p-3 pl-10 pr-10 bg-[color:var(--color-input-bg)] border border-[color:var(--color-input-border)] text-[color:var(--color-text-primary)] rounded-md text-[length:var(--font-size-sm)] placeholder:text-[color:var(--color-text-secondary)] focus:outline-none focus:border-[color:var(--color-primary-blue)] transition-colors";
    const labelClasses = "block text-sm font-light text-[color:var(--color-text-primary)] mb-2";
    const iconClasses = "fi absolute top-[42px] left-3 text-[color:var(--color-text-secondary)] pointer-events-none flex items-center";
    const btnPrimaryClasses = "w-full p-3 rounded-md font-medium bg-[color:var(--color-primary-blue)] text-[color:var(--color-text-primary)] cursor-pointer border-none transition-all hover:bg-[color:var(--color-primary-blue-alpha-80)] disabled:opacity-50 disabled:cursor-not-allowed";

    return (
        <div
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center transition-all p-4"
            aria-hidden={!isOpen}
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="w-full max-w-[768px] h-auto flex flex-col lg:flex-row justify-center items-stretch rounded-[12px] border border-[color:var(--color-border-primary)] shadow-[var(--shadow-lg)] bg-[color:var(--color-bg-primary)] overflow-hidden">
                {/* Left gradient panel (desktop only) */}
                <div className="hidden lg:flex w-96 min-h-[576px] rounded-l-[10px] border-r border-[color:var(--color-border-primary)] p-10 flex-col justify-center items-start bg-gradient-to-br from-[color:var(--color-gradient-auth-start)] to-[color:var(--color-gradient-auth-end)]">
                    <div className="flex flex-col justify-center items-start gap-4">
                        <div className="flex justify-center items-center h-16 w-16 rounded-lg bg-[color:var(--color-white-alpha-20)] text-3xl text-[color:var(--color-text-primary)] mb-4">
                            <i className="fi fi-rr-lock flex items-center justify-center" />
                        </div>
                        <div>
                            <h2 className="text-[color:var(--color-text-primary)] text-3xl font-bold leading-tight">
                                Welcome to Our Platform
                            </h2>
                        </div>
                        <div>
                            <p className="text-base text-[color:var(--color-white-alpha-80)] leading-relaxed">
                                Join thousands of users who trust our secure and seamless authentication experience.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right form section */}
                <div className="relative flex flex-col justify-start bg-[color:var(--color-bg-primary)] w-full lg:w-96 min-h-[500px] lg:min-h-[576px]">
                    {/* Close button */}
                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute top-0 right-0 z-50 bg-red-600 rounded-bl-lg rounded-tr-[10px] p-2 cursor-pointer transition-all hover:bg-red-700 flex items-center justify-center"
                        aria-label="Close modal"
                    >
                        <i className="fi fi-rr-cross text-white text-sm flex items-center justify-center" />
                    </button>

                    {isLogin ? (
                        /* LOGIN FORM */
                        <div className="flex flex-col h-full">
                            <div className="p-8 pb-4">
                                <h3 className="text-[color:var(--color-text-primary)] text-2xl font-semibold">Log In</h3>
                                <p className="text-[length:var(--font-size-sm)] text-[color:var(--color-text-secondary)] mt-1">
                                    Enter your credentials to access your account.
                                </p>
                            </div>

                            {error && (
                                <div className="mx-8 p-3 bg-red-500/20 border border-red-500/50 rounded-md text-red-400 text-sm">
                                    {error}
                                </div>
                            )}

                            <div className="px-8 flex-1">
                                <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4 w-full">
                                    <div className="relative">
                                        <label htmlFor="login-email" className={labelClasses}>
                                            Email Address
                                        </label>
                                        <i className={`${iconClasses} fi-rr-envelope`} />
                                        <input
                                            type="email"
                                            id="login-email"
                                            name="email"
                                            value={loginForm.email}
                                            onChange={handleLoginChange}
                                            placeholder="you@example.com"
                                            className={inputClasses}
                                            required
                                        />
                                    </div>

                                    <div className="relative">
                                        <label htmlFor="login-password" className={labelClasses}>
                                            Password
                                        </label>
                                        <i className={`${iconClasses} fi-rr-lock`} />
                                        <input
                                            type={showLoginPassword ? "text" : "password"}
                                            id="login-password"
                                            name="password"
                                            value={loginForm.password}
                                            onChange={handleLoginChange}
                                            placeholder="••••••••"
                                            className={inputClasses}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowLoginPassword(!showLoginPassword)}
                                            className="absolute top-[42px] right-3 text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)] transition-colors"
                                            aria-label={showLoginPassword ? "Hide password" : "Show password"}
                                        >
                                            <i className={`fi ${showLoginPassword ? "fi-rr-eye-crossed" : "fi-rr-eye"} flex items-center`} />
                                        </button>
                                    </div>

                                    <div className="text-right">
                                        <button
                                            type="button"
                                            className="text-[length:var(--font-size-sm)] text-[color:var(--color-primary-blue-light)] hover:underline"
                                        >
                                            Forgot password?
                                        </button>
                                    </div>

                                    <button type="submit" className={btnPrimaryClasses} disabled={isLoading}>
                                        {isLoading ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <i className="fi fi-rr-spinner animate-spin flex items-center" />
                                                Logging in...
                                            </span>
                                        ) : (
                                            "Log in"
                                        )}
                                    </button>
                                </form>
                            </div>

                            <div className="px-8 pt-4">
                                <p className="text-center text-sm text-[color:var(--color-text-secondary)]">
                                    Don't have an account?{" "}
                                    <button
                                        type="button"
                                        className="text-[color:var(--color-primary-blue)] hover:underline font-medium"
                                        onClick={() => handleSwitchMode("signup")}
                                    >
                                        Sign Up
                                    </button>
                                </p>
                            </div>

                            <div className="px-8 pt-4 flex items-center gap-3">
                                <div className="flex-grow h-px bg-[color:var(--color-border-primary)]" />
                                <span className="text-[length:var(--font-size-sm)] text-[color:var(--color-text-muted)]">or continue with</span>
                                <div className="flex-grow h-px bg-[color:var(--color-border-primary)]" />
                            </div>

                            <div className="p-8 pt-4">
                                <button
                                    type="button"
                                    onClick={handleGoogleSignIn}
                                    disabled={isLoading}
                                    className="w-full p-3 rounded-md font-medium bg-white text-gray-800 cursor-pointer border border-gray-300 transition-all hover:bg-gray-100 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <svg
                                        style={{ width: '24px', height: '24px', display: 'block' }}
                                        viewBox="0 0 24 24"
                                    >
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    Continue with Google
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* SIGNUP FORM */
                        <div className="flex flex-col h-full">
                            <div className="p-8 pb-4">
                                <h3 className="text-[color:var(--color-text-primary)] text-2xl font-semibold">Create your account</h3>
                                <p className="text-[length:var(--font-size-sm)] text-[color:var(--color-text-secondary)] mt-1">
                                    Fill in your details to get started.
                                </p>
                            </div>

                            {error && (
                                <div className="mx-8 p-3 bg-red-500/20 border border-red-500/50 rounded-md text-red-400 text-sm">
                                    {error}
                                </div>
                            )}

                            <div className="px-8 flex-1">
                                <form onSubmit={handleSignupSubmit} className="flex flex-col gap-4 w-full">
                                    <div className="relative">
                                        <label htmlFor="signup-fullname" className={labelClasses}>
                                            Full Name
                                        </label>
                                        <i className={`${iconClasses} fi-rr-user`} />
                                        <input
                                            type="text"
                                            id="signup-fullname"
                                            name="fullname"
                                            value={signupForm.fullname}
                                            onChange={handleSignupChange}
                                            placeholder="John Doe"
                                            className={inputClasses}
                                            required
                                        />
                                    </div>

                                    <div className="relative">
                                        <label htmlFor="signup-email" className={labelClasses}>
                                            Email Address
                                        </label>
                                        <i className={`${iconClasses} fi-rr-envelope`} />
                                        <input
                                            type="email"
                                            id="signup-email"
                                            name="email"
                                            value={signupForm.email}
                                            onChange={handleSignupChange}
                                            placeholder="you@example.com"
                                            className={inputClasses}
                                            required
                                        />
                                    </div>

                                    <div className="relative">
                                        <label htmlFor="signup-password" className={labelClasses}>
                                            Password
                                        </label>
                                        <i className={`${iconClasses} fi-rr-lock`} />
                                        <input
                                            type={showSignupPassword ? "text" : "password"}
                                            id="signup-password"
                                            name="password"
                                            value={signupForm.password}
                                            onChange={handleSignupChange}
                                            placeholder="••••••••"
                                            className={inputClasses}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowSignupPassword(!showSignupPassword)}
                                            className="absolute top-[42px] right-3 text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)] transition-colors"
                                            aria-label={showSignupPassword ? "Hide password" : "Show password"}
                                        >
                                            <i className={`fi ${showSignupPassword ? "fi-rr-eye-crossed" : "fi-rr-eye"} flex items-center`} />
                                        </button>
                                        <p className="text-xs text-[color:var(--color-text-muted)] mt-1">
                                            Must be at least 6 characters
                                        </p>
                                    </div>

                                    <button type="submit" className={btnPrimaryClasses} disabled={isLoading}>
                                        {isLoading ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <i className="fi fi-rr-spinner animate-spin flex items-center" />
                                                Creating account...
                                            </span>
                                        ) : (
                                            "Create Account"
                                        )}
                                    </button>
                                </form>
                            </div>

                            <div className="px-8 pt-4">
                                <p className="text-center text-sm text-[color:var(--color-text-secondary)]">
                                    Already have an account?{" "}
                                    <button
                                        type="button"
                                        className="text-[color:var(--color-primary-blue)] hover:underline font-medium"
                                        onClick={() => handleSwitchMode("login")}
                                    >
                                        Log in
                                    </button>
                                </p>
                            </div>

                            <div className="px-8 pt-4 flex items-center gap-3">
                                <div className="flex-grow h-px bg-[color:var(--color-border-primary)]" />
                                <span className="text-[length:var(--font-size-sm)] text-[color:var(--color-text-muted)]">or continue with</span>
                                <div className="flex-grow h-px bg-[color:var(--color-border-primary)]" />
                            </div>

                            <div className="p-8 pt-4">
                                <button
                                    type="button"
                                    onClick={handleGoogleSignIn}
                                    disabled={isLoading}
                                    className="w-full p-3 rounded-md font-medium bg-white text-gray-800 cursor-pointer border border-gray-300 transition-all hover:bg-gray-100 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <svg
                                        style={{ width: '24px', height: '24px', display: 'block' }}
                                        viewBox="0 0 24 24"
                                    >
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    Continue with Google
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
