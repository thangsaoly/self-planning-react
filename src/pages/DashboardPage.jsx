import { useState, useEffect, useMemo, useCallback } from "react";
import NewPlanModal from "../components/NewPlanModal";
import TripDetailModal from "../components/TripDetailModal";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
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

// ── Travel type color mapping ─────────────────────────────────────────────
const typeColors = {
    Citytrip: "bg-[color:var(--color-tag-citytrip)]",
    Roadtrip: "bg-[color:var(--color-tag-roadtrip)]",
    Beach: "bg-[color:var(--color-tag-beachholiday)]",
    Festival: "bg-[color:var(--color-tag-festivaltrip)]",
    Camping: "bg-[color:var(--color-tag-camping)]",
    Hiking: "bg-[color:var(--color-tag-hiking)]",
};


function TripCard({ trip, onClick, sectionType, onDragStart }) {
    const totalTasks = (trip.todos?.length || 0) + (trip.packing?.length || 0);
    const completedTasks = (trip.todos?.filter(t => t.isDone).length || 0) + (trip.packing?.filter(p => p.isPacked).length || 0);
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return (
        <div
            draggable
            onDragStart={(e) => onDragStart(e, trip, sectionType)}
            onClick={onClick}
            className="card flex-shrink-0 flex flex-col items-start bg-[color:var(--color-bg-card)] rounded-[10px] shadow-md scale-95 hover:scale-100 transition-all duration-300 cursor-grab active:cursor-grabbing relative overflow-hidden"
        >
            <div className="img w-[280px] h-[150px] overflow-hidden pointer-events-none">
                <img
                    src={trip.image}
                    alt={trip.name}
                    className="w-[280px] h-[150px] object-cover rounded-t-[10px]"
                />
            </div>
            {/* Progress Bar overlay at bottom of image */}
            {totalTasks > 0 && (
                <div className="absolute top-[146px] left-0 w-full h-1 bg-black/20">
                    <div 
                        className="h-full bg-[color:var(--color-primary-blue)] transition-all duration-500" 
                        style={{ width: `${progress}%` }} 
                    />
                </div>
            )}
            
            <div className="info flex flex-col p-2.5 gap-1.5 w-full pointer-events-none">
                <div className="flex justify-between items-center w-full">
                    <span className="text-[color:var(--color-text-primary)] font-medium truncate">
                        {trip.emoji} {trip.name}
                    </span>
                    {totalTasks > 0 && (
                        <span className="text-[10px] text-[color:var(--color-text-secondary)] font-medium">
                            {progress}%
                        </span>
                    )}
                </div>
                <div
                    className={`travel-type flex items-center px-2.5 py-1 rounded-[10px] w-fit text-xs text-[color:var(--color-text-primary)] ${typeColors[trip.typeClass] || "bg-[color:var(--color-primary-blue)]"}`}
                >
                    {trip.type}
                </div>
            </div>
        </div>
    );
}

function NewPlanCard({ onClick }) {
    return (
        <div
            onClick={onClick}
            className="new-plan flex-shrink-0 flex justify-center items-center bg-[color:var(--color-bg-card)] rounded-[10px] border border-dashed border-[color:var(--color-text-secondary)] shadow-md cursor-pointer hover:border-[color:var(--color-primary-blue)] transition-all"
        >
            <span className="flex justify-center items-center w-[280px] h-auto py-16 text-[color:var(--color-text-primary)]">
                + New Plan
            </span>
        </div>
    );
}

// Sort options for dropdown
const sortOptions = [
    { value: "default", label: "Default" },
    { value: "a-z", label: "A → Z" },
    { value: "z-a", label: "Z → A" },
];

// Filter options (travel types)
const filterOptions = [
    { value: "all", label: "All Types" },
    { value: "Citytrip", label: "🏙 Citytrip" },
    { value: "Roadtrip", label: "🏕 Roadtrip" },
    { value: "Beach", label: "🏖 Beach" },
    { value: "Festival", label: "🎉 Festival" },
    { value: "Camping", label: "⛺ Camping" },
    { value: "Hiking", label: "🥾 Hiking" },
];

function TripSection({ icon, title, trips, sectionType, onNewPlan, onTripClick, onDragStart, onDrop }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [filterType, setFilterType] = useState("all");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [sortOrder, setSortOrder] = useState("default");
    const [isSortOpen, setIsSortOpen] = useState(false);

    // Process trips: filter, search, then sort
    const processedTrips = useMemo(() => {
        let result = [...trips];

        // Apply type filter
        if (filterType !== "all") {
            result = result.filter((trip) => trip.typeClass === filterType);
        }

        // Apply search
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter((trip) =>
                trip.name.toLowerCase().includes(query) ||
                trip.type.toLowerCase().includes(query)
            );
        }

        // Apply sort
        if (sortOrder === "a-z") {
            result.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortOrder === "z-a") {
            result.sort((a, b) => b.name.localeCompare(a.name));
        }

        return result;
    }, [trips, filterType, searchQuery, sortOrder]);

    const handleFilterClick = () => {
        setIsFilterOpen(!isFilterOpen);
        setIsSortOpen(false);
        setIsSearchOpen(false);
    };

    const handleSortClick = () => {
        setIsSortOpen(!isSortOpen);
        setIsFilterOpen(false);
        setIsSearchOpen(false);
    };

    const handleSearchClick = () => {
        setIsSearchOpen(!isSearchOpen);
        setIsFilterOpen(false);
        setIsSortOpen(false);
    };

    const clearFilters = () => {
        setSearchQuery("");
        setFilterType("all");
        setSortOrder("default");
    };

    const hasActiveFilters = searchQuery || filterType !== "all" || sortOrder !== "default";

    const handleDragOver = (e) => {
        e.preventDefault();
        e.currentTarget.classList.add("bg-[color:var(--color-bg-card)]");
        e.currentTarget.classList.add("scale-[1.01]");
    };

    const handleDragLeave = (e) => {
        e.currentTarget.classList.remove("bg-[color:var(--color-bg-card)]");
        e.currentTarget.classList.remove("scale-[1.01]");
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.currentTarget.classList.remove("bg-[color:var(--color-bg-card)]");
        e.currentTarget.classList.remove("scale-[1.01]");
        onDrop(e, sectionType);
    };

    return (
        <div 
            className="container flex flex-col justify-center items-start bg-[color:var(--color-bg-secondary)] rounded-[15px] shadow-lg w-[90%] p-7 gap-5 transition-all duration-300 border-2 border-transparent"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <div className="event-box flex justify-between items-center w-full">
                <div className="event flex items-center p-2.5 gap-2.5 bg-[color:var(--color-bg-card)] rounded-[10px] shadow-md">
                    <img src={icon} alt="icon" width={32} height={32} />
                    <span className="font-semibold text-[color:var(--color-text-primary)]">{title}</span>
                    {hasActiveFilters && (
                        <span className="text-xs px-2 py-0.5 bg-[color:var(--color-primary-blue)] text-white rounded-full">
                            {processedTrips.length}
                        </span>
                    )}
                </div>
                <div className="classify flex gap-3 items-center text-[color:var(--color-text-primary)] relative">
                    {/* Clear filters button */}
                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"
                        >
                            Clear
                        </button>
                    )}

                    {/* Filter Icon */}
                    <div className="relative">
                        <i
                            onClick={handleFilterClick}
                            className={`fi fi-rr-bars-filter cursor-pointer hover:opacity-80 transition-colors ${filterType !== "all" ? "text-green-400" : "text-[color:var(--color-primary-blue)]"}`}
                        />
                        {isFilterOpen && (
                            <div className="absolute right-0 top-8 z-20 bg-[color:var(--color-bg-card)] rounded-lg shadow-xl border border-[color:var(--color-border-primary)] min-w-[150px] py-2">
                                {filterOptions.map((opt) => (
                                    <button
                                        key={opt.value}
                                        onClick={() => {
                                            setFilterType(opt.value);
                                            setIsFilterOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-[color:var(--color-bg-secondary)] transition-colors ${filterType === opt.value ? "text-[color:var(--color-primary-blue)] font-medium" : "text-[color:var(--color-text-primary)]"}`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sort Icon */}
                    <div className="relative">
                        <i
                            onClick={handleSortClick}
                            className={`fi fi-rr-sort-alt cursor-pointer hover:opacity-80 transition-colors ${sortOrder !== "default" ? "text-yellow-400" : "text-[color:var(--color-primary-blue)]"}`}
                        />
                        {isSortOpen && (
                            <div className="absolute right-0 top-8 z-20 bg-[color:var(--color-bg-card)] rounded-lg shadow-xl border border-[color:var(--color-border-primary)] min-w-[120px] py-2">
                                {sortOptions.map((opt) => (
                                    <button
                                        key={opt.value}
                                        onClick={() => {
                                            setSortOrder(opt.value);
                                            setIsSortOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-[color:var(--color-bg-secondary)] transition-colors ${sortOrder === opt.value ? "text-[color:var(--color-primary-blue)] font-medium" : "text-[color:var(--color-text-primary)]"}`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Search Icon */}
                    <i
                        onClick={handleSearchClick}
                        className={`fi fi-rr-search cursor-pointer hover:opacity-80 transition-colors ${searchQuery ? "text-purple-400" : ""}`}
                    />
                </div>
            </div>

            {/* Search Input Bar (expandable) */}
            {isSearchOpen && (
                <div className="search-bar w-full flex items-center gap-2 bg-[color:var(--color-bg-card)] rounded-lg p-2 shadow-md animate-fade-in">
                    <i className="fi fi-rr-search text-[color:var(--color-text-muted)]" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search trips by name or type..."
                        className="flex-1 bg-transparent border-none outline-none text-[color:var(--color-text-primary)] placeholder:text-[color:var(--color-text-muted)]"
                        autoFocus
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text-primary)]"
                        >
                            <i className="fi fi-rr-cross-small" />
                        </button>
                    )}
                </div>
            )}

            {/* Cards */}
            <div className="card-box flex flex-nowrap gap-5 overflow-x-auto overflow-y-hidden w-full max-w-full rounded-[10px] pb-2 scrollbar-hide">
                {processedTrips.length > 0 ? (
                    <>
                        {processedTrips.map((trip) => (
                            <TripCard key={trip.id} trip={trip} onClick={() => onTripClick(trip)} sectionType={sectionType} onDragStart={onDragStart} />
                        ))}
                        <NewPlanCard onClick={onNewPlan} />
                    </>
                ) : (
                    <div 
                        onClick={onNewPlan}
                        className="flex flex-col items-center justify-center w-full py-10 gap-3 rounded-[10px] border border-dashed border-[color:var(--color-border-primary)] bg-[color:var(--color-bg-card)] cursor-pointer hover:border-[color:var(--color-primary-blue)] transition-all group min-h-[160px]"
                    >
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/10 text-[color:var(--color-primary-blue)] group-hover:scale-110 transition-transform">
                            <i className="fi fi-rr-plus text-xl flex items-center justify-center" />
                        </div>
                        <span className="text-[color:var(--color-text-primary)] font-medium text-sm">
                            {searchQuery ? "No trips matching your criteria" : "Create a New Plan"}
                        </span>
                        <span className="text-[color:var(--color-text-secondary)] text-xs text-center max-w-xs px-4">
                            {searchQuery ? "Try resetting your search query or filters" : "There are no trips in this category yet. Click here to plan your next adventure!"}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}

import { useToast } from "../context/ToastContext";

export default function DashboardPage() {
    const { addToast } = useToast();
    const { token, logout } = useAuth();
    const [visitingTrips, setVisitingTrips] = useState([]);
    const [upcomingTrips, setUpcomingTrips] = useState([]);
    const [visitedTrips, setVisitedTrips] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

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

    useEffect(() => {
        fetchTrips();
    }, [token]);

    const [isNewPlanOpen, setIsNewPlanOpen] = useState(false);
    const [targetSection, setTargetSection] = useState("visiting");

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

    return (
        <div className="min-h-screen bg-[color:var(--color-bg-primary)] font-['Poppins',sans-serif] pb-14">
            {/* Navbar */}
            <div className="flex items-center justify-center w-full">
                <NavBar isOnline={isOnline} pendingCount={pendingCount} />
            </div>

            <div className="dashboard">
                {/* Background image */}
                <div className="bgImg flex justify-center items-center w-full h-[350px] overflow-hidden">
                    <img
                        src="/img/hintersee.jpg"
                        alt="Dashboard Background Image"
                        className="w-full h-[350px] object-cover"
                    />
                </div>

                {/* Floating travel icon */}
                <div className="travel1 absolute top-[275px] left-[60px]">
                    <img src="https://cdn-icons-png.freepik.com/512/15692/15692755.png" alt="Travel Symbol" className="h-[140px]" />
                </div>

                {/* Title */}
                <div className="title absolute top-[450px] left-[100px] flex items-baseline gap-2.5">
                    <img
                        src="https://cdn-icons-png.flaticon.com/128/684/684908.png"
                        alt="map-point"
                        width={50}
                        height={50}
                    />
                    <h1 className="text-[clamp(1.5rem,2vw+1rem,2.5rem)] text-[color:var(--color-text-primary)] font-bold">
                        Let's Explore
                    </h1>
                </div>

                {/* Offline banner */}
                {!isOnline && (
                    <div
                        id="offline-banner"
                        className="fixed top-[70px] left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/90 backdrop-blur-sm text-white text-sm font-medium shadow-lg animate-pulse"
                    >
                        <span>⚡</span>
                        <span>
                            Offline
                            {pendingCount > 0 && ` — ${pendingCount} change${pendingCount > 1 ? "s" : ""} pending sync`}
                        </span>
                    </div>
                )}

                {/* Main container box */}
                <div className="container-box flex flex-col justify-center items-center mt-[200px] w-full gap-14">
                    {/* Loading skeleton */}
                    {isLoading && (
                        <div className="flex flex-col gap-8 w-full px-8 animate-pulse">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex flex-col gap-3">
                                    <div className="h-5 w-40 bg-[color:var(--color-bg-card)] rounded-md" />
                                    <div className="flex gap-4 overflow-hidden">
                                        {[1, 2, 3].map((j) => (
                                            <div key={j} className="flex-shrink-0 w-[280px] h-[200px] bg-[color:var(--color-bg-card)] rounded-[10px]" />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {/* Trip Sections — shown once loading is done */}
                    {!isLoading && (
                        <>
                            {/* Visiting Section */}
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

                            {/* Upcoming Holidays Section */}
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

                            {/* Visited Section */}
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
                onDelete={handleTripDelete}
            />
            <div className="mt-16" />
            {/* Footer */}
            <div className="flex items-center justify-center w-full">
                <Footer />
            </div>
        </div>
    );
}
