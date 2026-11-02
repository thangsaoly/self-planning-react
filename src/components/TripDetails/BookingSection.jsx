export default function BookingSection({ booking, isEditing, expanded, onToggle, onChange }) {
    const calloutClasses = "w-full px-3 py-2 rounded bg-(--color-callout-bg) border border-(--color-callout-border) text-(--color-text-primary) outline-none placeholder:text-(--color-text-muted) text-sm";

    return (
        <section className="info-section booking bg-(--color-bg-secondary) rounded-lg p-4 transition-all">
            <div className="flex justify-between items-center cursor-pointer select-none" onClick={onToggle}>
                <h2 className="section-header flex items-center gap-2 text-lg font-medium">✈️ Booking Details</h2>
                <i className={`fi fi-rr-angle-small-down text-xl transition-transform duration-300 ${expanded ? "rotate-180" : ""}`} />
            </div>

            <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                <div className="min-h-0 overflow-hidden">
                    <div className="mt-4 flex flex-col gap-3">
                        <hr className="border-t border-(--color-border-secondary) mb-3" />

                        <div className="info-callout bg-(--color-callout-bg) rounded-lg p-3 mb-2">
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={booking.departure}
                                    onChange={(e) => onChange({ ...booking, departure: e.target.value })}
                                    placeholder="🛫 Departure details"
                                    className={calloutClasses}
                                />
                            ) : (
                                <div className="text-sm">🛫 {booking.departure || "Departure: Not set"}</div>
                            )}
                        </div>
                        <div className="info-callout bg-(--color-callout-bg) rounded-lg p-3">
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={booking.arrival}
                                    onChange={(e) => onChange({ ...booking, arrival: e.target.value })}
                                    placeholder="🛬 Arrival details"
                                    className={calloutClasses}
                                />
                            ) : (
                                <div className="text-sm">🛬 {booking.arrival || "Arrival: Not set"}</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
