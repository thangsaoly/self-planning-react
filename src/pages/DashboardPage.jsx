import { useState, useEffect, useMemo, useCallback } from "react";
import NewPlanModal from "../components/NewPlanModal";
import TripDetailModal from "../components/TripDetailModal";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import ChatWidget from "../components/ChatWidget";
import TripSection from "../components/dashboard/TripSection";
import { Reveal } from "../hooks/useReveal";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useOfflineSync } from "../hooks/useOfflineSync";
import * as tripService from "../services/tripService";

// ── Offline cache helpers ──────────────────────────────────────────────────
const CACHE_KEY = "trips_cache";

const saveCache = (data) => {
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    } catch { /* storage full — silently ignore */ }
};

const loadCache = () => {
    try {
        return JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
    } catch {
        return null;
    }
};

// ── Temporary ID generator (used while offline) ────────────────────────────
const tempId = () => `temp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

export default function DashboardPage() {
    const { addToast } = useToast();
    const { token, logout, user } = useAuth();

    // ── Cache-first hydration ──────────────────────────────────────────────
    // Read the trips cache exactly once per mount (lazy useState initializer)
    // and hydrate the three arrays synchronously, so returning users see their
    // real cards on first paint with zero placeholder flash. fetchTrips below
    // replaces state silently when it resolves; refetch never blanks sections.
    const [cachedTripsAtMount] = useState(loadCache);
    const [visitingTrips, setVisitingTrips] = useState(cachedTripsAtMount?.visitingTrips || []);
    const [upcomingTrips, setUpcomingTrips] = useState(cachedTripsAtMount?.upcomingTrips || []);
    const [visitedTrips, setVisitedTrips] = useState(cachedTripsAtMount?.visitedTrips || []);
    const [isLoading, setIsLoading] = useState(true);

    // True when this mount found a cache or trips are already in state —
    // gates the quiet "Loading trips…" line (first-ever load only).
    const hasData = Boolean(cachedTripsAtMount) ||
        visitingTrips.length + upcomingTrips.length + visitedTrips.length > 0;

    // ── Helpers to update all three state arrays + cache ──────────────────
    const applyTripsState = useCallback((data) => {
        setVisitingTrips(data.visitingTrips || []);
        setUpcomingTrips(data.upcomingTrips || []);
        setVisitedTrips(data.visitedTrips || []);
        saveCache(data);
    }, []);

    const removeFromState = useCallback((id) => {
        setVisitingTrips((p) => p.filter((t) => t.id !== id));
        setUpcomingTrips((p) => p.filter((t) => t.id !== id));
        setVisitedTrips((p) => p.filter((t) => t.id !== id));
    }, []);

    const addToSection = useCallback((trip, section) => {
        if (section === "visiting") setVisitingTrips((p) => [...p, trip]);
        else if (section === "upcoming") setUpcomingTrips((p) => [...p, trip]);
        else if (section === "visited") setVisitedTrips((p) => [...p, trip]);
    }, []);

    const updateInSection = useCallback((trip, section) => {
        const updater = (prev) => prev.map((t) => (t.id === trip.id ? trip : t));
        if (section === "visiting") setVisitingTrips(updater);
        else if (section === "upcoming") setUpcomingTrips(updater);
        else if (section === "visited") setVisitedTrips(updater);
    }, []);

    // ── Offline queue flush function ───────────────────────────────────────
    const flushOperation = useCallback(async (operation) => {
        if (!token) return;
        const { type, payload, tempId: tid, section } = operation;

        if (type === "create") {
            const result = await tripService.createTrip(token, payload);
            if (!result.success) throw new Error(result.error);
            // Replace temp ID with real server ID in UI
            const newTrip = result.data;
            setVisitingTrips((p) => p.map((t) => (t.id === tid ? newTrip : t)));
            setUpcomingTrips((p) => p.map((t) => (t.id === tid ? newTrip : t)));
            setVisitedTrips((p) => p.map((t) => (t.id === tid ? newTrip : t)));
            addToast(`Synced "${newTrip.name}" to server`, "success");
        } else if (type === "update") {
            const result = await tripService.updateTrip(token, payload.id, payload);
            if (!result.success) throw new Error(result.error);
            updateInSection(result.data, section);
        } else if (type === "delete") {
            const result = await tripService.deleteTrip(token, payload.id);
            if (!result.success && !result.error?.includes("not found")) throw new Error(result.error);
        }
    }, [token, addToast, updateInSection]);

    const { isOnline, pendingCount, queueOperation } = useOfflineSync(flushOperation);

    // ── Fetch trips (with offline fallback) ───────────────────────────────
    const fetchTrips = useCallback(async () => {
        if (!token) return;
        setIsLoading(true);
        if (!isOnline) {
            const cached = loadCache();
            if (cached) {
                applyTripsState(cached);
            }
            setIsLoading(false);
            return;
        }
        try {
            const result = await tripService.fetchTrips(token);
            if (result.unauthorized) {
                logout();
                addToast("Session expired, please log in again", "error");
                return;
            }
            if (result.success) {
                applyTripsState(result.data);
            } else {
                // Try cache as fallback
                const cached = loadCache();
                if (cached) {
                    applyTripsState(cached);
                    addToast("Loaded trips from local cache", "info");
                } else {
                    addToast(result.error || "Failed to load trips", "error");
                }
            }
        } catch {
            const cached = loadCache();
            if (cached) {
                applyTripsState(cached);
                addToast("Loaded trips from local cache (network error)", "info");
            } else {
                addToast("Failed to load trips — no cache available", "error");
            }
        } finally {
            setIsLoading(false);
        }
    }, [token, isOnline, logout, addToast, applyTripsState]);

    const [isNewPlanOpen, setIsNewPlanOpen] = useState(false);
    const [targetSection, setTargetSection] = useState("visiting");

    useEffect(() => {
        if (!token) {
            // Logout must never leave the previous user's trips (live or
            // cache-hydrated) on screen; ProtectedRoute redirects away anyway.
            setVisitingTrips([]);
            setUpcomingTrips([]);
            setVisitedTrips([]);
            return;
        }
        fetchTrips();
    }, [token]);


    // Trip detail modal state
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [selectedSection, setSelectedSection] = useState(null);
    const [isTripDetailOpen, setIsTripDetailOpen] = useState(false);

    const handleNewPlanClick = (section) => {
        setTargetSection(section);
        setIsNewPlanOpen(true);
    };

    const handleTripClick = (trip, section) => {
        setSelectedTrip(trip);
        setSelectedSection(section);
        setIsTripDetailOpen(true);
    };

    const handleTripPartialUpdate = async (tripId, section, partialData) => {
        try {
            const result = await tripService.updateTrip(token, tripId, partialData);
            if (result.unauthorized) {
                logout();
                addToast("Session expired, please log in again", "error");
                return;
            }
            if (result.success) {
                const savedTrip = result.data;
                const updateList = (prev) => prev.map((t) => (t.id === savedTrip.id ? savedTrip : t));
                if (section === "visiting") setVisitingTrips(updateList);
                else if (section === "upcoming") setUpcomingTrips(updateList);
                else if (section === "visited") setVisitedTrips(updateList);
            } else {
                addToast(result.error || "Failed to update trip", "error");
            }
        } catch (error) {
            console.error("Partial update error:", error);
            addToast("Failed to update trip due to network error", "error");
        }
    };

    const handleTripUpdate = async (updatedTrip, oldSection, newSection) => {
        const payload = { ...updatedTrip, travelStatus: newSection };

        // Optimistic UI update
        removeFromState(updatedTrip.id);
        addToSection({ ...updatedTrip, travelStatus: newSection }, newSection);

        if (!isOnline) {
            queueOperation({ type: "update", payload, section: newSection });
            addToast("Saved offline — will sync when reconnected", "info");
            return;
        }

        try {
            const result = await tripService.updateTrip(token, updatedTrip.id, payload);
            if (result.unauthorized) { logout(); return; }
            if (result.success) {
                updateInSection(result.data, newSection);
                addToast("Trip updated successfully", "success");
            } else {
                // Rollback
                removeFromState(updatedTrip.id);
                addToSection(updatedTrip, oldSection);
                addToast(result.error || "Failed to update trip", "error");
            }
        } catch {
            removeFromState(updatedTrip.id);
            addToSection(updatedTrip, oldSection);
            addToast("Failed to update trip due to network error", "error");
        }
    };

    const handleTripDelete = async (trip, section) => {
        // Optimistic UI removal
        removeFromState(trip.id);

        if (!isOnline) {
            queueOperation({ type: "delete", payload: trip, section });
            addToast(`Deleted "${trip.name}" offline — will sync when reconnected`, "info");
            return;
        }

        try {
            const result = await tripService.deleteTrip(token, trip.id);
            if (result.unauthorized) { logout(); return; }
            if (result.success) {
                addToast(`Deleted ${trip.name} successfully`, "info");
            } else {
                // Rollback
                addToSection(trip, section);
                addToast(result.error || "Failed to delete trip", "error");
            }
        } catch {
            addToSection(trip, section);
            addToast("Failed to delete trip due to network error", "error");
        }
    };

    const handleDragStart = (e, trip, sourceSection) => {
        e.dataTransfer.setData("tripId", trip.id);
        e.dataTransfer.setData("sourceSection", sourceSection);
    };

    const handleDrop = async (e, dropSection) => {
        const tripId = e.dataTransfer.getData("tripId");
        const sourceSection = e.dataTransfer.getData("sourceSection");
        if (sourceSection === dropSection || !tripId) return;

        let tripToMove = null;
        if (sourceSection === "visiting") tripToMove = visitingTrips.find((t) => t.id === tripId);
        else if (sourceSection === "upcoming") tripToMove = upcomingTrips.find((t) => t.id === tripId);
        else if (sourceSection === "visited") tripToMove = visitedTrips.find((t) => t.id === tripId);
        if (!tripToMove) return;

        await handleTripUpdate(tripToMove, sourceSection, dropSection);
        if (isOnline) addToast(`Moved ${tripToMove.name} to ${dropSection}`, "success");
    };

    const handleNewPlanSubmit = async (cardData, status) => {
        const tripData = {
            booking: { departure: null, arrival: null },
            transport: [],
            highlights: [],
            costs: [],
            ...cardData,
            travelStatus: status,
        };

        if (!isOnline) {
            const tid = tempId();
            const offlineTrip = { ...tripData, id: tid };
            addToSection(offlineTrip, status);
            queueOperation({ type: "create", payload: tripData, tempId: tid, section: status });
            addToast(`"${cardData.name}" saved offline — will sync when reconnected`, "info");
            return;
        }

        try {
            const result = await tripService.createTrip(token, tripData);
            if (result.unauthorized) { logout(); return; }
            if (result.success) {
                addToSection(result.data, status);
                addToast(`Created plan for ${result.data.name}!`, "success");
            } else {
                addToast(result.error || "Failed to create plan", "error");
            }
        } catch {
            addToast("Failed to create plan due to network error", "error");
        }
    };

    // ── Time-based greeting (first word of display name, fallback "traveler") ─
    const hour = new Date().getHours();
    const dayPart = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";
    const firstName = (user?.name || user?.fullname || "").trim().split(/\s+/)[0] || "traveler";

    return (
        <div className="min-h-screen bg-(--color-bg-primary) font-['Poppins',sans-serif] pb-14">
            {/* Navbar */}
            <div className="flex items-center justify-center w-full">
                <NavBar isOnline={isOnline} pendingCount={pendingCount} />
            </div>

            <div className="dashboard">
                {/* Hero band */}
                <div className="bgImg relative flex justify-center items-center w-full h-75 md:h-87.5 overflow-visible">
                    <img
                        src="/img/hintersee.jpg"
                        alt="Dashboard Background Image"
                        className="w-full h-full object-cover"
                    />
                    {/* Scrim fading the image into the page background */}
                    <div className="scrim-hero" />

                    {/* Floating travel icon */}
                    <div className="travel1 absolute -top-6 right-8 md:right-16 hidden md:block animate-float">
                        <img src="https://cdn-icons-png.freepik.com/512/15692/15692755.png" alt="Travel Symbol" className="h-35" />
                    </div>

                    {/* Title */}
                    <div className="title absolute bottom-4 left-6 md:left-25 flex flex-col gap-1 z-10">
                        <p className="text-(--color-text-secondary) text-base md:text-xl font-medium">
                            Good {dayPart}, {firstName}
                        </p>
                        <div className="flex items-baseline gap-2.5">
                            <img
                                src="https://cdn-icons-png.flaticon.com/128/684/684908.png"
                                alt="map-point"
                                width={50}
                                height={50}
                            />
                            <h1 className="text-[clamp(1.5rem,2vw+1rem,2.5rem)] text-(--color-text-primary) font-bold">
                                Let's Explore
                            </h1>
                        </div>
                    </div>
                </div>

                {/* Offline banner */}
                {!isOnline && (
                    <div
                        id="offline-banner"
                        className="fixed top-17.5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/90 backdrop-blur-sm text-white text-sm font-medium shadow-lg animate-pulse"
                    >
                        <span>⚡</span>
                        <span>
                            Offline
                            {pendingCount > 0 && ` — ${pendingCount} change${pendingCount > 1 ? "s" : ""} pending sync`}
                        </span>
                    </div>
                )}

                {/* Main container box */}
                <div className="container-box flex flex-col justify-center items-center mt-10 w-full gap-14">
                    {/* Quiet loading line — only on the first-ever load with no cache */}
                    {isLoading && !hasData && (
                        <p className="text-(--color-text-muted) text-sm py-10">Loading trips…</p>
                    )}
                    {/* Trip Sections — cache-first: render whenever cached or fetched data exists */}
                    {(hasData || !isLoading) && (
                        <>
                            {/* Visiting Section */}
                            <Reveal delay={0} className="w-full flex justify-center">
                                <TripSection
                                    icon="https://cdn-icons-png.flaticon.com/128/1692/1692037.png"
                                    title="Visiting"
                                    trips={visitingTrips}
                                    sectionType="visiting"
                                    onNewPlan={() => handleNewPlanClick("visiting")}
                                    onTripClick={(trip) => handleTripClick(trip, "visiting")}
                                    onDragStart={handleDragStart}
                                    onDrop={handleDrop}
                                />
                            </Reveal>

                            {/* Upcoming Holidays Section */}
                            <Reveal delay={1} className="w-full flex justify-center">
                                <TripSection
                                    icon="https://cdn-icons-png.flaticon.com/128/6381/6381403.png"
                                    title="Upcoming Holidays"
                                    trips={upcomingTrips}
                                    sectionType="upcoming"
                                    onNewPlan={() => handleNewPlanClick("upcoming")}
                                    onTripClick={(trip) => handleTripClick(trip, "upcoming")}
                                    onDragStart={handleDragStart}
                                    onDrop={handleDrop}
                                />
                            </Reveal>

                            {/* Visited Section */}
                            <Reveal delay={2} className="w-full flex justify-center">
                                <TripSection
                                    icon="https://cdn-icons-png.flaticon.com/128/4698/4698094.png"
                                    title="Visited"
                                    trips={visitedTrips}
                                    sectionType="visited"
                                    onNewPlan={() => handleNewPlanClick("visited")}
                                    onTripClick={(trip) => handleTripClick(trip, "visited")}
                                    onDragStart={handleDragStart}
                                    onDrop={handleDrop}
                                />
                            </Reveal>
                        </>
                    )}
                </div>

            </div>

            {/* New Plan Modal */}
            <NewPlanModal
                isOpen={isNewPlanOpen}
                onClose={() => setIsNewPlanOpen(false)}
                onSubmit={handleNewPlanSubmit}
                targetSection={targetSection}
            />

            {/* Trip Detail Modal */}
            <TripDetailModal
                isOpen={isTripDetailOpen}
                onClose={() => setIsTripDetailOpen(false)}
                trip={selectedTrip}
                section={selectedSection}
                onUpdate={handleTripUpdate}
                onPartialUpdate={handleTripPartialUpdate}
                onDelete={handleTripDelete}
            />
            <div className="mt-16" />
            {/* Footer */}
            <div className="flex items-center justify-center w-full">
                <Footer />
            </div>

            {/* AI Chat Widget */}
            <ChatWidget />
        </div>
    );
}
