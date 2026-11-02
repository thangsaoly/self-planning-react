export default function GoogleMapsSection({ googleMapsLink, isEditing, expanded, onToggle, onChange }) {
    const calloutClasses = "w-full px-3 py-2 rounded bg-(--color-callout-bg) border border-(--color-callout-border) text-(--color-text-primary) outline-none placeholder:text-(--color-text-muted) text-sm";

    return (
        <section className="info-section googleMap bg-(--color-bg-secondary) rounded-lg p-4 md:col-span-2 transition-all">
            <div className="flex justify-between items-center cursor-pointer select-none" onClick={onToggle}>
                <h2 className="section-header flex items-center gap-2 text-lg font-medium">🗺️ Google Maps</h2>
                <i className={`fi fi-rr-angle-small-down text-xl transition-transform duration-300 ${expanded ? "rotate-180" : ""}`} />
            </div>

            <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                <div className="min-h-0 overflow-hidden">
                    <div className="mt-4">
                        <hr className="border-t border-(--color-border-secondary) mb-3" />

                        <div className="info-callout bg-(--color-callout-bg) rounded-lg p-3">
                            {isEditing ? (
                                <input
                                    type="url"
                                    value={googleMapsLink}
                                    onChange={(e) => onChange(e.target.value)}
                                    placeholder="Paste Google Maps link here..."
                                    className={calloutClasses}
                                />
                            ) : (
                                googleMapsLink ? (
                                    <a
                                        href={googleMapsLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-(--color-primary-blue) hover:underline"
                                    >
                                        📍 View route planning
                                    </a>
                                ) : (
                                    <div className="text-sm text-(--color-text-muted)">No map link added</div>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
