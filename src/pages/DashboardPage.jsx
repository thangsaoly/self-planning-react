import { useState, useEffect, useMemo } from "react";
import NewPlanModal from "../components/NewPlanModal";
import TripDetailModal from "../components/TripDetailModal";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const initialVisitingTrips = [
    {
        id: "visiting-1",
        name: "Angkor Wat",
        emoji: "🏕",
        type: "Exposure trip",
        typeClass: "Festival",
        image:
            "https://lh3.googleusercontent.com/gps-cs-s/AHVAweoqqk36txlGVjsbenr5c72MVPdDXLzxMnSYHSh8AHJRCS3PBFX0JwIFyWNcz4RVAwmFrK-jMUA3pjAE0Mqdj4msZ7BaX9h1FLhXGuDanxrVp3JrFnCP0YIHbZjZ6N0pwGhYliioxQ=s1360-w1360-h1020-rw",
    },
    {
        id: "visiting-2",
        name: "Kampot",
        emoji: "🏕",
        type: "Beach",
        typeClass: "Beach",
        image:
            "https://www.asiaone.com/sites/default/files/styles/article_top_image/public/original_images/Apr2024/140424_kampot_ig.jpg?itok=nFu0VoBZ",
    },
    {
        id: "visiting-3",
        name: "Singapore",
        emoji: "🏙",
        type: "Citytrip",
        typeClass: "Citytrip",
        image:
            "https://media.assettype.com/outlooktraveller%2F2023-11%2F65edc73f-81ce-425c-a7f5-4bd34133f095%2Fshutterstock_697224274.jpeg?w=1024&auto=format%2Ccompress&fit=max",
    },
];

const initialUpcomingTrips = [
    {
        id: "upcoming-1",
        name: "New York",
        emoji: "🏙",
        type: "Citytrip",
        typeClass: "Citytrip",
        image:
            "https://res.cloudinary.com/shipit-cdn/images/c_scale,w_448,h_299,dpr_2/f_auto,q_auto/v1733410609/wordpress/new-york/new-york.jpg?_i=AA",
    },
    {
        id: "upcoming-2",
        name: "Mondulkiri",
        emoji: "🏕",
        type: "Roadtrip",
        typeClass: "Roadtrip",
        image:
            "https://southeastasiabackpacker.com/wp-content/uploads/2024/02/Bousra-Waterfall-Sen-Monorom-1200x800.jpg",
    },
    {
        id: "upcoming-3",
        name: "Phnom 1500",
        emoji: "🏕",
        type: "Roadtrip",
        typeClass: "Roadtrip",
        image:
            "https://www.indochinatour.com/assets/images/Cambodia-/road-phnom-1500.jpg",
    },
    {
        id: "upcoming-4",
        name: "Kirirom National Park",
        emoji: "🏕",
        type: "Camping",
        typeClass: "Camping",
        image:
            "https://www.techoairport.com.kh/tia-backend/locators/1754102693993-Picture2.png",
    },
];

const initialVisitedTrips = [
    {
        id: "visited-1",
        name: "Barcelona",
        emoji: "🏙",
        type: "Citytrip",
        typeClass: "Citytrip",
        image:
            "https://images.contentstack.io/v3/assets/blt06f605a34f1194ff/blt98aab8678ac3bce7/663907b78447cbf1b69ca84f/logan-armstrong-hVhfqhDYciU-unsplash-edited-MOBILE-HEADER.jpg?fit=crop&disable=upscale&auto=webp&quality=60&crop=smart",
    },
    {
        id: "visited-2",
        name: "Japan",
        emoji: "🏙",
        type: "Citytrip",
        typeClass: "Citytrip",
        image:
            "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1280&q=80",
    },
    {
        id: "visited-3",
        name: "Area 51, Nevada",
        emoji: "🏕",
        type: "Camping",
        typeClass: "Camping",
        image:
            "https://cdn.mos.cms.futurecdn.net/v2/t:0,l:459,cw:1184,ch:1184,q:80,w:1184/Z6rs3jNJab8PC2cWavyt97.jpg",
    },
    {
        id: "visited-4",
        name: "Moscow",
        emoji: "🏙",
        type: "Citytrip",
        typeClass: "Citytrip",
        image:
            "https://geohistory.today/wp-content/uploads/2017/09/Moscow.jpg",
    },
];

// Travel type color mapping
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
                    processedTrips.map((trip) => (
                        <TripCard key={trip.id} trip={trip} onClick={() => onTripClick(trip)} sectionType={sectionType} onDragStart={onDragStart} />
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center w-full py-8 gap-3 min-w-[280px]">
                        <img 
                            src={icon} 
                            alt="Empty state" 
                            className="w-16 h-16 opacity-50 grayscale" 
                        />
                        <span className="text-[color:var(--color-text-muted)] text-sm">
                            {searchQuery ? "No trips matching your criteria" : "No trips here yet. Click + New Plan to start!"}
                        </span>
                    </div>
                )}
                <NewPlanCard onClick={onNewPlan} />
            </div>
        </div>
    );
}

import { useToast } from "../context/ToastContext";

export default function DashboardPage() {
    const { addToast } = useToast();
    const [visitingTrips, setVisitingTrips] = useState(() => {
        const saved = localStorage.getItem("visitingTrips");
        return saved ? JSON.parse(saved) : initialVisitingTrips;
    });
    const [upcomingTrips, setUpcomingTrips] = useState(() => {
        const saved = localStorage.getItem("upcomingTrips");
        return saved ? JSON.parse(saved) : initialUpcomingTrips;
    });
    const [visitedTrips, setVisitedTrips] = useState(() => {
        const saved = localStorage.getItem("visitedTrips");
        return saved ? JSON.parse(saved) : initialVisitedTrips;
    });

    useEffect(() => {
        localStorage.setItem("visitingTrips", JSON.stringify(visitingTrips));
    }, [visitingTrips]);

    useEffect(() => {
        localStorage.setItem("upcomingTrips", JSON.stringify(upcomingTrips));
    }, [upcomingTrips]);

    useEffect(() => {
        localStorage.setItem("visitedTrips", JSON.stringify(visitedTrips));
    }, [visitedTrips]);
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

    const handleTripUpdate = (updatedTrip, oldSection, newSection) => {
        // Remove from old section
        const removeFromSection = (section, setSection) => {
            setSection((prev) => prev.filter((t) => t.id !== selectedTrip.id));
        };

        // Add to new section
        const addToSection = (setSection) => {
            setSection((prev) => [...prev, updatedTrip]);
        };

        // If section changed, remove from old and add to new
        if (oldSection !== newSection) {
            // Remove from old section
            switch (oldSection) {
                case "visiting":
                    removeFromSection(oldSection, setVisitingTrips);
                    break;
                case "upcoming":
                    removeFromSection(oldSection, setUpcomingTrips);
                    break;
                case "visited":
                    removeFromSection(oldSection, setVisitedTrips);
                    break;
            }
            // Add to new section
            switch (newSection) {
                case "visiting":
                    addToSection(setVisitingTrips);
                    break;
                case "upcoming":
                    addToSection(setUpcomingTrips);
                    break;
                case "visited":
                    addToSection(setVisitedTrips);
                    break;
            }
        } else {
            // Update in same section
            const updateInSection = (setSection) => {
                setSection((prev) =>
                    prev.map((t) => (t.id === selectedTrip.id ? updatedTrip : t))
                );
            };
            switch (oldSection) {
                case "visiting":
                    updateInSection(setVisitingTrips);
                    break;
                case "upcoming":
                    updateInSection(setUpcomingTrips);
                    break;
                case "visited":
                    updateInSection(setVisitedTrips);
                    break;
            }
        }
    };

    const handleTripDelete = (trip, section) => {
        switch (section) {
            case "visiting": setVisitingTrips((prev) => prev.filter((t) => t.id !== trip.id)); break;
            case "upcoming": setUpcomingTrips((prev) => prev.filter((t) => t.id !== trip.id)); break;
            case "visited": setVisitedTrips((prev) => prev.filter((t) => t.id !== trip.id)); break;
        }
        addToast(`Deleted ${trip.name} successfully`, "info");
    };

    const handleDragStart = (e, trip, sourceSection) => {
        e.dataTransfer.setData("tripId", trip.id);
        e.dataTransfer.setData("sourceSection", sourceSection);
    };

    const handleDrop = (e, targetSection) => {
        const tripId = e.dataTransfer.getData("tripId");
        const sourceSection = e.dataTransfer.getData("sourceSection");
        
        if (sourceSection === targetSection || !tripId) return;

        let tripToMove = null;
        
        // Remove from source
        const removeFromSource = (setSection, trips) => {
            tripToMove = trips.find(t => t.id === tripId);
            if (tripToMove) setSection(prev => prev.filter(t => t.id !== tripId));
        };

        if (sourceSection === "visiting") removeFromSource(setVisitingTrips, visitingTrips);
        else if (sourceSection === "upcoming") removeFromSource(setUpcomingTrips, upcomingTrips);
        else if (sourceSection === "visited") removeFromSource(setVisitedTrips, visitedTrips);

        if (!tripToMove) return;

        // Add to target
        if (targetSection === "visiting") setVisitingTrips(prev => [...prev, tripToMove]);
        else if (targetSection === "upcoming") setUpcomingTrips(prev => [...prev, tripToMove]);
        else if (targetSection === "visited") setVisitedTrips(prev => [...prev, tripToMove]);

        addToast(`Moved ${tripToMove.name} to ${targetSection}`, "success");
    };

    const handleNewPlanSubmit = (cardData, status) => {
        switch (status) {
            case "visiting":
                setVisitingTrips((prev) => [...prev, cardData]);
                break;
            case "upcoming":
                setUpcomingTrips((prev) => [...prev, cardData]);
                break;
            case "visited":
                setVisitedTrips((prev) => [...prev, cardData]);
                break;
            default:
                setVisitingTrips((prev) => [...prev, cardData]);
        }
    };

    return (
        <div className="min-h-screen bg-[color:var(--color-bg-primary)] font-['Poppins',sans-serif] pb-14">
            {/* Navbar */}
            <div className="flex items-center justify-center w-full">
                <NavBar />
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

                {/* Main container box */}
                <div className="container-box flex flex-col justify-center items-center mt-[200px] w-full gap-14">
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
