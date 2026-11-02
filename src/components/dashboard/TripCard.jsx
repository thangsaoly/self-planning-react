// ── Travel type color mapping ─────────────────────────────────────────────
const typeColors = {
    Citytrip: "bg-(--color-tag-citytrip)",
    Roadtrip: "bg-(--color-tag-roadtrip)",
    Beach: "bg-(--color-tag-beachholiday)",
    Festival: "bg-(--color-tag-festivaltrip)",
    Camping: "bg-(--color-tag-camping)",
    Hiking: "bg-(--color-tag-hiking)",
};

const dayFormatter = new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" });

// Parse an ISO-ish date string; null when missing or invalid
const parseDate = (value) => {
    if (!value) return null;
    const ms = Date.parse(value);
    return Number.isNaN(ms) ? null : ms;
};

export default function TripCard({ trip, onClick, sectionType, onDragStart }) {
    const totalTasks = (trip.todos?.length || 0) + (trip.packing?.length || 0);
    const completedTasks = (trip.todos?.filter(t => t.isDone).length || 0) + (trip.packing?.filter(p => p.isPacked).length || 0);
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Date-range chip (hidden when both dates missing/invalid)
    const startMs = parseDate(trip.startDate);
    const endMs = parseDate(trip.endDate);
    const dateRangeLabel = [
        startMs !== null ? dayFormatter.format(new Date(startMs)) : null,
        endMs !== null ? dayFormatter.format(new Date(endMs)) : null,
    ].filter(Boolean).join(" – ") || null;

    // Countdown chip for upcoming trips ("in Nd"); hidden when startDate missing/invalid
    let countdownDays = null;
    if (sectionType === "upcoming" && startMs !== null) {
        const todayMs = Date.parse(new Date().toISOString().slice(0, 10));
        if (!Number.isNaN(todayMs)) {
            countdownDays = Math.max(0, Math.ceil((startMs - todayMs) / 86400000));
        }
    }

    return (
        <div
            draggable
            onDragStart={(e) => onDragStart(e, trip, sectionType)}
            onClick={onClick}
            className="card group snap-start shrink-0 flex flex-col items-start bg-(--color-bg-card) rounded-[10px] border border-[rgba(255,255,255,0.06)] hover:-translate-y-1 hover:ring-2 hover:ring-(--color-card-ring) transition-all duration-300 cursor-grab active:cursor-grabbing relative overflow-hidden"
        >
            <div className="img w-[280px] h-[150px] overflow-hidden pointer-events-none">
                <img
                    src={trip.image}
                    alt={trip.name}
                    className="w-[280px] h-[150px] object-cover rounded-t-[10px] transition-transform duration-700 group-hover:scale-[1.06]"
                />
            </div>
            {/* Progress Bar overlay at bottom of image */}
            {totalTasks > 0 && (
                <div className="absolute top-[146px] left-0 w-full h-1.5 bg-black/20">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-[var(--color-primary-blue)] to-[var(--color-primary-blue-light)] transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            )}

            <div className="info flex flex-col p-2.5 gap-1.5 w-full pointer-events-none">
                <div className="flex justify-between items-center w-full">
                    <span className="text-(--color-text-primary) font-medium truncate">
                        {trip.emoji} {trip.name}
                    </span>
                    {totalTasks > 0 && (
                        <span className="text-[10px] text-(--color-text-secondary) font-medium">
                            {progress}%
                        </span>
                    )}
                </div>
                <div
                    className={`travel-type flex items-center px-2.5 py-1 rounded-[10px] w-fit text-xs text-(--color-text-primary) ${typeColors[trip.typeClass] || "bg-(--color-primary-blue)"}`}
                >
                    {trip.type}
                </div>
                {(dateRangeLabel || countdownDays !== null) && (
                    <div className="flex flex-wrap gap-1.5">
                        {dateRangeLabel && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(255,255,255,0.08)] text-(--color-text-secondary)">
                                {dateRangeLabel}
                            </span>
                        )}
                        {countdownDays !== null && (
                            <span
                                className={`text-[10px] px-2 py-0.5 rounded-full bg-[rgba(255,255,255,0.08)] ${countdownDays < 7 ? "text-(--color-text-accent)" : "text-(--color-text-secondary)"}`}
                            >
                                in {countdownDays}d
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
