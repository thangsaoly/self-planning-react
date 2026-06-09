import { useState } from "react";
import AuthModal from "../components/AuthModal";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

export default function AboutPage() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  const openLogin = () => { setAuthMode("login"); setIsAuthOpen(true); };
  const openSignup = () => { setAuthMode("signup"); setIsAuthOpen(true); };

  return (
    <div className="m-0 p-0 box-border font-['Poppins',sans-serif] bg-[color:var(--color-bg-primary)] min-h-screen text-[color:var(--color-text-primary)]">
      <div className="grid grid-rows-[auto_auto_auto] gap-16 justify-items-center min-h-screen">
        <NavBar onLoginClick={openLogin} onSignupClick={openSignup} />

        {/* Main / About content */}
        <main className="col-start-1 row-start-2 flex flex-col items-center w-full px-4 md:px-24 pt-40 pb-2 lg:pt-14">
          <section className="max-w-4xl w-full text-center mb-12">
            <h1 className="text-[color:var(--color-primary-blue)] text-[length:var(--font-size-h1)] font-semibold mb-2 tracking-wide">
              ABOUT
            </h1>
            <p className="text-[length:var(--font-size-h4)] text-[color:var(--color-text-accent)] mb-4">
              Learn about the awesome people behind Self-Planning Travel Planner
            </p>
            <p className="text-[length:var(--font-size-h4)] text-[color:var(--color-text-primary)] text-left md:text-center leading-relaxed">
              The Self-Planning Travel Planner is the digital platform designed to be your all-in-one command center for
              travel. We consolidate every essential tool, from itinerary builders and budget trackers to accommodation
              organizers and activity checklists, into a single, cohesive workspace. Our mission is to eliminate the clutter
              of multiple apps and scattered notes by providing a unified, intuitive interface. We empower travelers to
              meticulously plan every detail of their journey with ease and clarity. Ultimately, we transform complex trip
              preparation into a streamlined, efficient, and even enjoyable experience.
            </p>
          </section>

          <section className="max-w-4xl w-full flex flex-col md:flex-row gap-6 justify-center mb-12">
            <div className="flex items-center gap-4 bg-[color:var(--color-bg-secondary)] rounded-[10px] px-4 py-3 shadow-[var(--shadow-sm)] transition-all duration-500 hover:-translate-y-1.5">
              <div className="h-16 w-16 flex items-center justify-center">
                <img
                  src="https://cdn-icons-png.flaticon.com/128/2374/2374449.png"
                  alt="Email box"
                  className="h-16 w-16 object-contain"
                />
              </div>
              <div className="text-left">
                <p className="text-[length:var(--font-size-h4)] text-[color:var(--color-text-secondary)]">Email us at</p>
                <p className="text-[length:var(--font-size-h4)]">support@self-planning.com</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-[color:var(--color-bg-secondary)] rounded-[10px] px-4 py-3 shadow-[var(--shadow-sm)] transition-all duration-500 hover:-translate-y-1.5">
              <div className="h-16 w-16 flex items-center justify-center">
                <img
                  src="https://cdn-icons-png.flaticon.com/128/2111/2111646.png"
                  alt="Telegram Channel"
                  className="h-16 w-16 object-contain"
                />
              </div>
              <div className="text-left">
                <p className="text-[length:var(--font-size-h4)] text-[color:var(--color-text-secondary)]">
                  Join and chat with us at
                </p>
                <p className="text-[length:var(--font-size-h4)]">t.me/self-planning-community</p>
              </div>
            </div>
          </section>

          <section className="max-w-4xl w-full mb-4">
            <div className="text-center mb-6">
              <h2 className="text-[length:var(--font-size-h2)] font-semibold">Meet the Developers</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-items-center">
              <div className="flex flex-col items-center bg-[color:var(--color-bg-secondary)] rounded-[10px] px-6 py-4 shadow-[var(--shadow-sm)] max-w-xs w-full">
                <img
                  src="https://upload.wikimedia.org/wikipedia/en/e/e7/Steve_%28Minecraft%29.png"
                  alt="Developer 1"
                  className="h-auto w-32 rounded-lg object-cover mb-3"
                />
                <h3 className="text-[length:var(--font-size-h4)] font-semibold">Thang Saoly</h3>
                <p className="text-[color:var(--color-text-secondary)]">Web Developer</p>
              </div>
              <div className="flex flex-col items-center bg-[color:var(--color-bg-secondary)] rounded-[10px] px-6 py-4 shadow-[var(--shadow-sm)] max-w-xs w-full">
                <img
                  src="https://upload.wikimedia.org/wikipedia/en/e/e7/Steve_%28Minecraft%29.png"
                  alt="Developer 2"
                  className="h-auto w-32 rounded-lg object-cover mb-3"
                />
                <h3 className="text-[length:var(--font-size-h4)] font-semibold">Tiek Chhunhour</h3>
                <p className="text-[color:var(--color-text-secondary)]">Web Developer</p>
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
