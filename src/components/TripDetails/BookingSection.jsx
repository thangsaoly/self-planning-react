export default function BookingSection({ booking, isEditing, expanded, onToggle, onChange }) {
    const calloutClasses = "w-full px-3 py-2 rounded bg-[color:var(--color-callout-bg)] border border-[color:var(--color-callout-border)] text-[color:var(--color-text-primary)] outline-none placeholder:text-[color:var(--color-text-muted)] text-sm";

    return (
        <section className="info-section booking bg-[color:var(--color-bg-secondary)] rounded-lg p-4 transition-all">
            <div className="flex justify-between items-center cursor-pointer select-none" onClick={onToggle}>
                <h2 className="section-header flex items-center gap-2 text-lg font-medium">✈️ Booking Details</h2>
                <i className={`fi fi-rr-angle-small-${expanded ? 'up' : 'down'} text-xl transition-transform`} />
            </div>
            
            {expanded && (
                <div className="mt-4 animate-fade-in flex flex-col gap-3">
                    <hr className="border-t border-[color:var(--color-border-secondary)] mb-3" />

                    <div className="info-callout bg-[color:var(--color-callout-bg)] rounded-lg p-3 mb-2">
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
                    <div className="info-callout bg-[color:var(--color-callout-bg)] rounded-lg p-3">
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
            )}
        </section>
    );
}
