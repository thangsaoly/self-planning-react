import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthModal from "../components/AuthModal";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { Reveal } from "../hooks/useReveal";

/** Feature cards — single source of truth so the three cards stay in sync. */
const FEATURES = [
    {
        img: "/img/to-do-list .png",
        alt: "to-do-list",
        title: "To-Do List",
        description:
            "Seamlessly manage all your trip tasks. Easily add, edit, track completion, and assign priority labels to ensure nothing is forgotten.",
    },
    {
        img: "/img/planning.png",
        alt: "planning",
        title: "Trip Planning",
        description:
            "Organize all your destination, travel date, transport, and accommodation details. Features interactive map integration to visualize your itinerary.",
    },
    {
        img: "/img/budget.png",
        alt: "Financial",
        title: "Financial Tracker",
        description:
            "Stay on budget effortlessly. Track all expenses by category, view a budget overview, and utilize real-time balance calculation.",
    },
];

/** Shared classes for the benefit cards (kept here so all three match exactly). */
const featureCardClasses =
    "group relative flex h-full w-full max-w-100 flex-col justify-center items-center gap-4 overflow-hidden bg-(--color-bg-secondary) p-6 lg:p-8 rounded-[15px] border border-white/[0.05] shadow-(--shadow-md) transition-all duration-300 hover:-translate-y-2 hover:shadow-(--shadow-card-hover) hover:border-(--color-card-ring-accent)";

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
        <div className="m-0 p-0 box-border font-['Poppins',sans-serif] bg-(--color-bg-primary) min-h-screen">
            <div className="grid grid-rows-[auto_auto_auto] gap-16 md:gap-20 justify-items-center">
                <NavBar onLoginClick={openLogin} onSignupClick={openSignup} />

                {/* Main content: hero + features */}
                <main className="relative col-start-1 row-start-2 flex flex-col justify-center items-center gap-16 md:gap-24 w-full px-4 md:px-24 min-w-93.5 pt-36 lg:pt-32 pb-16">
                    {/* Ambient background glow — decorative only */}
                    <div
                        aria-hidden="true"
                        className="absolute inset-0 overflow-hidden -z-10 pointer-events-none"
                    >
                        <div className="absolute -top-35 right-[4%] h-110 w-110 rounded-full bg-[radial-gradient(circle,var(--color-orb-blue),transparent_70%)] blur-3xl" />
                        <div className="absolute top-[55%] -left-48 h-100 w-100 rounded-full bg-[radial-gradient(circle,var(--color-orb-accent),transparent_70%)] blur-3xl" />
                    </div>

                    {/* Hero */}
                    <section className="grid grid-cols-[1fr] md:grid-cols-[minmax(min(500px,100%),1fr)] lg:grid-cols-[1fr_0.8fr] justify-items-center items-center justify-center gap-10 md:gap-12 lg:gap-16 px-4 py-8">
                        <Reveal delay={0} className="w-full">
                            <div className="w-full max-w-xxl ml-0 md:ml-4">
                                <div className="mb-1.5">
                                    <h1 className="text-(--color-text-primary) text-(length:--font-size-hero) leading-none font-semibold">
                                        Welcome to
                                    </h1>
                                    <h1 className="text-gradient-blue text-(length:--font-size-h1) md:text-(length:--font-size-h2) lg:text-(length:--font-size-h1) leading-[1.4] font-semibold">
                                        Self-Planning Travel Planner
                                    </h1>
                                </div>
                                <span className="mt-5 flex items-center text-(--color-text-accent) text-(length:--font-size-h3) font-medium">
                                    Stop juggling spreadsheets, notes, and separate apps.
                                </span>
                                <p className="mt-3 text-(--color-text-secondary) text-(length:--font-size-h4) leading-relaxed max-w-[52ch]">
                                    Self-Planning is your consolidated digital companion for organizing every detail
                                    of your trip. We integrate all essential trip organization tools into one user-friendly platform, making travel
                                    preparation efficient and stress-free.
                                </p>
                                <button
                                    id="get-started"
                                    type="button"
                                    onClick={handleGetStarted}
                                    className="group mt-8 inline-flex items-center gap-2.5 bg-(--color-primary-blue) text-(--color-text-primary) text-(length:--font-size-h4) font-medium py-3 px-8 rounded-xl border border-(--color-primary-blue) cursor-pointer transition-all duration-300 shadow-(--shadow-cta) hover:bg-(--color-primary-blue-alpha-80) hover:border-(--color-primary-blue-light) hover:-translate-y-0.75 hover:shadow-(--shadow-cta-hover) active:translate-y-0 active:shadow-(--shadow-cta)"
                                >
                                    Get Started
                                    <i
                                        aria-hidden="true"
                                        className="fi fi-rr-arrow-right text-sm flex items-center transition-transform duration-300 group-hover:translate-x-1"
                                    />
                                </button>
                            </div>
                        </Reveal>
                        <Reveal delay={1} className="w-full">
                            <div className="relative w-full flex justify-center items-center">
                                <span
                                    aria-hidden="true"
                                    className="absolute inset-10 rounded-full bg-[radial-gradient(circle,var(--color-orb-accent),transparent_65%)] blur-2xl"
                                />
                                <img
                                    src="/img/mainImg.png"
                                    alt="Travel planning dashboard illustration"
                                    className="relative h-92.5 md:h-100 aspect-square animate-float drop-shadow-[0_0_45px_var(--color-glow-accent)]"
                                />
                            </div>
                        </Reveal>
                    </section>

                    {/* Features */}
                    <section id="features" className="scroll-mt-32 flex flex-col items-center px-4 py-8">
                        <div className="flex flex-col items-center gap-3">
                            <div className="flex flex-wrap justify-center items-center gap-2">
                                <h2 className="text-(--color-text-primary) text-(length:--font-size-h2) font-semibold">
                                    Everything is yours
                                </h2>
                                <h2 className="text-(--color-text-accent) text-(length:--font-size-h2) font-semibold">
                                    Benefits
                                </h2>
                            </div>
                            <span
                                aria-hidden="true"
                                className="h-1 w-68 rounded-full bg-[linear-gradient(90deg,var(--color-primary-blue),var(--color-text-accent))]"
                            />
                        </div>
                        <div className="grid grid-cols-[minmax(0,1fr)] md:grid-cols-2 lg:grid-cols-3 px-4 md:px-8 mt-10 gap-6 lg:gap-8 justify-items-center items-stretch">
                            {FEATURES.map((feature, index) => (
                                <Reveal key={feature.title} delay={index + 2} className="w-full max-w-100">
                                    <article className={featureCardClasses}>
                                        {/* Sheen sweep on hover */}
                                        <span
                                            aria-hidden="true"
                                            className="pointer-events-none absolute inset-0 rounded-[15px] bg-[linear-gradient(160deg,rgba(255,255,255,0.07),transparent_45%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                                        />
                                        <span className="relative flex h-21.5 w-21.5 shrink-0 items-center justify-center rounded-2xl bg-(--color-bg-card) shadow-(--shadow-sm) ring-1 ring-white/8 transition-all duration-300 group-hover:ring-(--color-card-ring-accent)">
                                            <img
                                                src={feature.img}
                                                alt={feature.alt}
                                                className="h-14.5 w-14.5 aspect-square object-contain transition-transform duration-300 group-hover:scale-110"
                                            />
                                        </span>
                                        <h3 className="relative text-(--color-text-primary) text-(length:--font-size-h5) font-semibold">
                                            {feature.title}
                                        </h3>
                                        <p className="relative text-(--color-text-secondary) text-(length:--font-size-base) leading-relaxed text-center">
                                            {feature.description}
                                        </p>
                                    </article>
                                </Reveal>
                            ))}
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
