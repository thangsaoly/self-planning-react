import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthModal from "../components/AuthModal";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

export default function LandingPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [authMode, setAuthMode] = useState("login");

    const openLogin = () => { setAuthMode("login"); setIsAuthOpen(true); };
    const openSignup = () => { setAuthMode("signup"); setIsAuthOpen(true); };

    const handleGetStarted = () => {
        if (user) {
            navigate("/dashboard");
        } else {
            openSignup();
        }
    };

    return (
        <div className="m-0 p-0 box-border font-['Poppins',sans-serif] bg-[color:var(--color-bg-primary)] min-h-screen">
            <div className="grid grid-rows-[auto_auto_auto] gap-16 justify-items-center">
                <NavBar onLoginClick={openLogin} onSignupClick={openSignup} />

                {/* Main content: hero + features */}
                <main className="col-start-1 row-start-2 flex flex-col justify-center items-center gap-16 w-full px-4 md:px-24 min-w-[374px] pt-36 lg:pt-32">
                    <section className="grid grid-cols-[1fr] md:grid-cols-[minmax(500px,1fr)] lg:grid-cols-[1fr_0.8fr] justify-items-center items-center justify-center gap-12 p-4">
                        <div className="w-full ml-0 md:ml-4">
                            <div className="mb-1.5">
                                <h1 className="text-[color:var(--color-text-primary)] text-[length:var(--font-size-hero)] leading-none font-semibold">
                                    Welcome to
                                </h1>
                                <h1 className="text-[color:var(--color-primary-blue)] text-[length:var(--font-size-h1)] md:text-[length:var(--font-size-h2)] lg:text-[length:var(--font-size-h1)] leading-none font-semibold">
                                    Self-Planning Travel Planner
                                </h1>
                            </div>
                            <span className="flex items-center text-[color:var(--color-text-accent)] text-[length:var(--font-size-h4)]">
                                Stop juggling spreadsheets, notes, and separate apps.
                            </span>
                            <p className="text-[color:var(--color-text-primary)] text-[length:var(--font-size-h4)]">
                                The Self-Planning Travel Planner Web Application is your consolidated digital companion for organizing every detail
                                of your trip. We integrate all essential trip organization tools into one user-friendly platform, making travel
                                preparation efficient and stress-free.
                            </p>
                            <button
                                id="get-started"
                                type="button"
                                onClick={handleGetStarted}
                                className="bg-[color:var(--color-primary-blue)] text-[color:var(--color-text-primary)] text-[length:var(--font-size-h4)] py-1.5 px-2.5 rounded-[10px] border border-[color:var(--color-primary-blue)] cursor-pointer transition-all duration-500 hover:bg-[color:var(--color-primary-blue-alpha-80)] hover:border-[color:var(--color-primary-blue-alpha-80)] hover:translate-y-[3px]"
                            >
                                Get Started
                            </button>
                        </div>
                        <div className="w-full flex justify-center items-center">
                            <img src="/img/mainImg.png" alt="mainImg" className="h-[370px] aspect-square" />
                        </div>
                    </section>

                    <section id="features">
                        <div className="flex justify-center items-center gap-2">
                            <h2 className="text-[color:var(--color-text-primary)] text-[length:var(--font-size-h2)] font-semibold">
                                Everything is yours
                            </h2>
                            <h2 className="text-[color:var(--color-text-accent)] text-[length:var(--font-size-h2)] font-semibold">
                                Benefits
                            </h2>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 p-4 gap-8 justify-items-center mt-[20px] mb-1">
                            <div className="max-w-[400px] flex flex-col justify-center items-center bg-[color:var(--color-bg-secondary)] p-2.5 gap-2.5 rounded-[15px] shadow-[var(--shadow-sm)] transition-all duration-500 hover:-translate-y-1.5">
                                <img
                                    src="/img/to-do-list .png"
                                    alt="to-do-list"
                                    className="h-[66px] w-[66px] aspect-square object-cover"
                                />
                                <h3 className="text-[color:var(--color-text-primary)]">To-Do List</h3>
                                <p className="text-[color:var(--color-text-secondary)] text-center">
                                    Seamlessly manage all your trip tasks. Easily add, edit, track completion, and assign priority labels to ensure
                                    nothing is forgotten.
                                </p>
                            </div>
                            <div className="max-w-[400px] flex flex-col justify-center items-center bg-[color:var(--color-bg-secondary)] p-2.5 gap-2.5 rounded-[15px] shadow-[var(--shadow-sm)] transition-all duration-500 hover:-translate-y-1.5">
                                <img src="/img/planning.png" alt="planning" className="h-[66px] w-[66px] aspect-square object-cover" />
                                <h3 className="text-[color:var(--color-text-primary)]">Trip Planning</h3>
                                <p className="text-[color:var(--color-text-secondary)] text-center">
                                    Organize all your destination, travel date, transport, and accommodation details. Features interactive map
                                    integration to visualize your itinerary.
                                </p>
                            </div>
                            <div className="max-w-[400px] flex flex-col justify-center items-center bg-[color:var(--color-bg-secondary)] p-2.5 gap-2.5 rounded-[15px] shadow-[var(--shadow-sm)] transition-all duration-500 hover:-translate-y-1.5">
                                <img src="/img/budget.png" alt="Financial" className="h-[66px] w-[66px] aspect-square object-cover" />
                                <h3 className="text-[color:var(--color-text-primary)]">Financial Tracker</h3>
                                <p className="text-[color:var(--color-text-secondary)] text-center">
                                    Stay on budget effortlessly. Track all expenses by category, view a budget overview, and utilize real-time balance
                                    calculation.
                                </p>
                            </div>
                        </div>
                    </section>
                </main>

                {/* Footer Section */}
                <Footer />
            </div>

            <AuthModal isOpen={isAuthOpen} mode={authMode} onClose={() => setIsAuthOpen(false)} onSwitchMode={setAuthMode} />
        </div>
    );
}