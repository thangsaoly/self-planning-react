import { useState, useMemo, useEffect, useRef } from "react";
import TripCard from "./TripCard";
import NewPlanCard from "./NewPlanCard";

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

// One rail scroll step: card width (280px) + rail gap (20px)
const RAIL_SCROLL_STEP = 300;

export default function TripSection({ icon, title, trips, sectionType, onNewPlan, onTripClick, onDragStart, onDrop }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [filterType, setFilterType] = useState("all");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [sortOrder, setSortOrder] = useState("default");
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);

    // Enter-depth counter: kills drag-leave flicker when crossing child cards
    const dragDepth = useRef(0);
    const railRef = useRef(null);
    const controlsRef = useRef(null);

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

    const closeAllPopovers = () => {
        setIsFilterOpen(false);
        setIsSortOpen(false);
        setIsSearchOpen(false);
    };

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

    // Popovers (filter/sort/search bar) close on outside click + Escape
    const anyPopoverOpen = isFilterOpen || isSortOpen || isSearchOpen;
    useEffect(() => {
        if (!anyPopoverOpen) return undefined;
        const handleMouseDown = (e) => {
            if (controlsRef.current && !controlsRef.current.contains(e.target)) {
                closeAllPopovers();
            }
        };
        const handleKeyDown = (e) => {
            if (e.key === "Escape") closeAllPopovers();
        };
        document.addEventListener("mousedown", handleMouseDown);
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("mousedown", handleMouseDown);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [anyPopoverOpen]);

    // Removable active-filter chips
    const activeChips = [];
    if (searchQuery) {
        activeChips.push({
            key: "search",
            label: `"${searchQuery}"`,
            onClear: () => setSearchQuery(""),
        });
    }
    if (filterType !== "all") {
        activeChips.push({
            key: "type",
            label: filterOptions.find((opt) => opt.value === filterType)?.label || filterType,
            onClear: () => setFilterType("all"),
        });
    }
    if (sortOrder !== "default") {
        activeChips.push({
            key: "sort",
            label: sortOptions.find((opt) => opt.value === sortOrder)?.label || sortOrder,
            onClear: () => setSortOrder("default"),
        });
    }

    // ── Drag-over feedback via React state only ────────────────────────────
    const handleDragEnter = (e) => {
        e.preventDefault();
        dragDepth.current += 1;
        setIsDragOver(true);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDragLeave = () => {
        dragDepth.current -= 1;
        if (dragDepth.current <= 0) {
            dragDepth.current = 0;
            setIsDragOver(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        dragDepth.current = 0;
        setIsDragOver(false);
        onDrop(e, sectionType);
    };

    const scrollRail = (direction) => {
        railRef.current?.scrollBy({ left: direction * RAIL_SCROLL_STEP, behavior: "smooth" });
    };

    return (
        <div
            className={`container relative flex flex-col justify-center items-start bg-(--color-bg-secondary) rounded-[15px] w-[90%] p-8 gap-5 transition-all duration-300 border-2 ${
                isDragOver ? "border-(--color-card-ring)" : "border-transparent"
            }`}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            {/* Drag tint wash over the whole section while a trip hovers */}
            {isDragOver && (
                <div className="pointer-events-none absolute inset-0 rounded-[13px] bg-(--color-drag-tint)" />
            )}
            <div className="flex flex-col gap-5 w-full" ref={controlsRef}>
                <div className="event-box flex justify-between items-center w-full">
                    <div className="event flex items-center p-2.5 gap-2.5 bg-(--color-bg-card) rounded-[10px] border border-[rgba(255,255,255,0.06)]">
                        <img src={icon} alt="icon" width={32} height={32} />
                        <span className="font-semibold text-(--color-text-primary)">{title}</span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium text-white bg-[rgba(21,93,252,0.85)]">
                            {trips.length}
                        </span>
                    </div>
                    <div className="classify flex gap-3 items-center text-(--color-text-primary) relative">
                        {/* Clear filters button */}
                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"
                            >
                                Clear
                            </button>
                        )}

                        {/* Filter */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={handleFilterClick}
                                aria-label="Filter trips"
                                className="text-(--color-primary-blue) hover:opacity-80 transition-opacity cursor-pointer"
                            >
                                <i className="fi fi-rr-bars-filter" />
                            </button>
                            {isFilterOpen && (
                                <div className="absolute right-0 top-8 z-20 animate-scale-up origin-top-right bg-(--color-bg-card) rounded-lg border border-(--color-border-primary) min-w-[150px] py-2">
                                    {filterOptions.map((opt) => (
                                        <button
                                            key={opt.value}
                                            onClick={() => {
                                                setFilterType(opt.value);
                                                setIsFilterOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-(--color-bg-secondary) transition-colors ${filterType === opt.value ? "text-(--color-primary-blue) font-medium" : "text-(--color-text-primary)"}`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Sort */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={handleSortClick}
                                aria-label="Sort trips"
                                className="text-(--color-primary-blue) hover:opacity-80 transition-opacity cursor-pointer"
                            >
                                <i className="fi fi-rr-sort-alt" />
                            </button>
                            {isSortOpen && (
                                <div className="absolute right-0 top-8 z-20 animate-scale-up origin-top-right bg-(--color-bg-card) rounded-lg border border-(--color-border-primary) min-w-[120px] py-2">
                                    {sortOptions.map((opt) => (
                                        <button
                                            key={opt.value}
                                            onClick={() => {
                                                setSortOrder(opt.value);
                                                setIsSortOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-(--color-bg-secondary) transition-colors ${sortOrder === opt.value ? "text-(--color-primary-blue) font-medium" : "text-(--color-text-primary)"}`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Search */}
                        <button
                            type="button"
                            onClick={handleSearchClick}
                            aria-label="Search trips"
                            className="text-(--color-primary-blue) hover:opacity-80 transition-opacity cursor-pointer"
                        >
                            <i className="fi fi-rr-search" />
                        </button>
                    </div>
                </div>

                {/* Active filter chips (removable) */}
                {activeChips.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {activeChips.map((chip) => (
                            <span
                                key={chip.key}
                                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-(--color-bg-card) border border-(--color-border-primary) text-(--color-text-primary)"
                            >
                                {chip.label}
                                <button
                                    type="button"
                                    onClick={chip.onClear}
                                    aria-label={`Remove ${chip.key} filter`}
                                    className="text-(--color-text-muted) hover:text-(--color-text-primary) transition-colors cursor-pointer"
                                >
                                    <i className="fi fi-rr-cross-small" />
                                </button>
                            </span>
                        ))}
                    </div>
                )}

                {/* Search Input Bar (expandable) */}
                {isSearchOpen && (
                    <div className="search-bar w-full flex items-center gap-2 bg-(--color-bg-card) rounded-lg p-2 border border-[rgba(255,255,255,0.06)] animate-fade-in">
                        <i className="fi fi-rr-search text-(--color-text-muted)" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search trips by name or type..."
                            className="flex-1 bg-transparent border-none outline-none text-(--color-text-primary) placeholder:text-(--color-text-muted)"
                            autoFocus
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                aria-label="Clear search"
                                className="text-(--color-text-muted) hover:text-(--color-text-primary) cursor-pointer"
                            >
                                <i className="fi fi-rr-cross-small" />
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Cards rail */}
            <div className="relative w-full group/rail">
                <div
                    ref={railRef}
                    className="card-box flex flex-nowrap gap-5 overflow-x-auto overflow-y-hidden w-full max-w-full rounded-[10px] pb-2 scrollbar-hide snap-x snap-proximity"
                >
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
                            className="flex flex-col items-center justify-center w-full py-10 gap-3 rounded-[10px] border border-dashed border-(--color-border-primary) bg-(--color-bg-card) cursor-pointer hover:border-(--color-primary-blue) transition-all group min-h-[160px]"
                        >
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/10 text-(--color-primary-blue) group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(21,93,252,0.35)] transition-all duration-300">
                                <i className="fi fi-rr-plus text-xl flex items-center justify-center leading-none" />
                            </div>
                            <span className="text-(--color-text-primary) font-medium text-sm">
                                {searchQuery ? "No trips matching your criteria" : "Create a New Plan"}
                            </span>
                            <span className="text-(--color-text-secondary) text-xs text-center max-w-xs px-4">
                                {searchQuery ? "Try resetting your search query or filters" : "There are no trips in this category yet. Click here to plan your next adventure!"}
                            </span>
                        </div>
                    )}
                </div>

                {/* Drop hint while dragging a trip over this section */}
                {isDragOver && (
                    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold text-(--color-primary-blue-light) bg-[rgba(25,25,25,0.85)] backdrop-blur-sm">
                            Drop here
                        </span>
                    </div>
                )}

                {/* Hover-revealed scroll arrows (only when the rail overflows) */}
                {processedTrips.length > 2 && (
                    <>
                        <button
                            type="button"
                            onClick={() => scrollRail(-1)}
                            aria-label={`Scroll ${title} left`}
                            className="absolute left-1 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/50 backdrop-blur ring-1 ring-white/20 text-white flex items-center justify-center cursor-pointer opacity-0 group-hover/rail:opacity-100 transition-opacity"
                        >
                            <i className="fi fi-rr-angle-small-left" />
                        </button>
                        <button
                            type="button"
                            onClick={() => scrollRail(1)}
                            aria-label={`Scroll ${title} right`}
                            className="absolute right-1 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/50 backdrop-blur ring-1 ring-white/20 text-white flex items-center justify-center cursor-pointer opacity-0 group-hover/rail:opacity-100 transition-opacity"
                        >
                            <i className="fi fi-rr-angle-small-right" />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
