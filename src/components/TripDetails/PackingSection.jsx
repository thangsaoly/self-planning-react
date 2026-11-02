export default function PackingSection({ packing, packingNote, isEditing, expanded, onToggle, onAdd, onUpdate, onRemove, onToggleItem, onNoteChange }) {
    const inputClasses = "w-full px-3 py-2 rounded bg-(--color-bg-secondary) border-none text-(--color-text-primary) outline-none placeholder:text-(--color-text-muted)";
    const calloutClasses = "w-full px-3 py-2 rounded bg-(--color-callout-bg) border border-(--color-callout-border) text-(--color-text-primary) outline-none placeholder:text-(--color-text-muted) text-sm";

    return (
        <section className="packing-list bg-(--color-bg-secondary) rounded-lg p-4 transition-all">
            <div className="flex justify-between items-center cursor-pointer select-none" onClick={onToggle}>
                <div className="flex items-center gap-2">
                    <h2 className="section-header flex items-center gap-2 text-lg font-medium">🎒 Packing List</h2>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[rgba(255,255,255,0.08)] text-(--color-text-secondary)">{packing.filter((p) => p.isPacked).length}/{packing.length}</span>
                </div>
                <i className={`fi fi-rr-angle-small-down text-xl transition-transform duration-300 ${expanded ? "rotate-180" : ""}`} />
            </div>

            <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                <div className="min-h-0 overflow-hidden">
                    <div className="mt-4">
                        <hr className="border-t border-(--color-border-secondary) mb-3" />

                        {isEditing && (
                            <div className="callout-note mb-3">
                                <input
                                    type="text"
                                    value={packingNote}
                                    onChange={(e) => onNoteChange(e.target.value)}
                                    placeholder="Add a note..."
                                    className={calloutClasses + " border-l-2 border-l-(--color-primary-blue)"}
                                />
                            </div>
                        )}
                        {packingNote && !isEditing && (
                            <div className="callout-note w-full bg-(--color-callout-bg) border-l-2 border-(--color-primary-blue) rounded-lg p-3 mb-3 text-sm text-(--color-text-primary)">{packingNote}</div>
                        )}

                        {packing.map((p, i) => (
                            <div key={i} className="packing-item flex items-center gap-3 py-2 border-b border-(--color-border-secondary) last:border-b-0">
                                <input
                                    type="checkbox"
                                    checked={p.isPacked}
                                    onChange={() => onToggleItem(i)}
                                    className="trip-check"
                                />
                                {isEditing ? (
                                    <>
                                        <input
                                            type="text"
                                            value={p.item}
                                            onChange={(e) => onUpdate(i, e.target.value)}
                                            className={inputClasses + " flex-1 text-sm"}
                                        />
                                        <button
                                            onClick={() => onRemove(i)}
                                            className="text-red-400 hover:text-red-650"
                                        >
                                            <i className="fi fi-rr-cross text-xs" />
                                        </button>
                                    </>
                                ) : (
                                    <span className={`text-sm transition-all duration-300 ${p.isPacked ? "line-through opacity-60 text-(--color-text-muted)" : ""}`}>{p.item}</span>
                                )}
                            </div>
                        ))}
                        {isEditing && (
                            <button
                                onClick={onAdd}
                                className="text-sm text-(--color-primary-blue) hover:underline mt-2 text-left"
                            >
                                + Add item
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
