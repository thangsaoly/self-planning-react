export default function TransportSection({ transport, isEditing, expanded, onToggle, onAdd, onUpdate, onRemove }) {
    const calloutClasses = "w-full px-3 py-2 rounded bg-[color:var(--color-callout-bg)] border border-[color:var(--color-callout-border)] text-[color:var(--color-text-primary)] outline-none placeholder:text-[color:var(--color-text-muted)] text-sm";

    return (
        <section className="info-section transport bg-[color:var(--color-bg-secondary)] rounded-lg p-4 transition-all">
            <div className="flex justify-between items-center cursor-pointer select-none" onClick={onToggle}>
                <h2 className="section-header flex items-center gap-2 text-lg font-medium">🚗 Transport Details</h2>
                <i className={`fi fi-rr-angle-small-${expanded ? 'up' : 'down'} text-xl transition-transform`} />
            </div>

            {expanded && (
                <div className="mt-4 animate-fade-in flex flex-col gap-2">
                    <hr className="border-t border-[color:var(--color-border-secondary)] mb-3" />

                    {transport.map((t, i) => (
                        <div key={i} className="info-callout bg-[color:var(--color-callout-bg)] rounded-lg p-3 mb-2 flex items-center gap-2">
                            {isEditing ? (
                                <>
                                    <input 
                                        type="text" 
                                        value={t.text} 
                                        onChange={(e) => onUpdate(i, e.target.value)} 
                                        placeholder="🚘 Transport details" 
                                        className={calloutClasses + " flex-1"} 
                                    />
                                    <button 
                                        onClick={() => onRemove(i)} 
                                        className="text-red-400 hover:text-red-650"
                                    >
                                        <i className="fi fi-rr-cross text-xs" />
                                    </button>
                                </>
                            ) : (
                                <div className="text-sm">🚘 {t.text || "Not set"}</div>
                            )}
                        </div>
                    ))}
                    {isEditing && (
                        <button 
                            onClick={onAdd} 
                            className="text-sm text-[color:var(--color-primary-blue)] hover:underline text-left"
                        >
                            + Add transport
                        </button>
                    )}
                </div>
            )}
        </section>
    );
}
