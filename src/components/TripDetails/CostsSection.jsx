export default function CostsSection({ costs, costNote, isEditing, expanded, onToggle, onAdd, onUpdate, onRemove, onNoteChange }) {
    const inputClasses = "w-full px-3 py-2 rounded bg-[color:var(--color-bg-secondary)] border-none text-[color:var(--color-text-primary)] outline-none placeholder:text-[color:var(--color-text-muted)]";
    const calloutClasses = "w-full px-3 py-2 rounded bg-[color:var(--color-callout-bg)] border border-[color:var(--color-callout-border)] text-[color:var(--color-text-primary)] outline-none placeholder:text-[color:var(--color-text-muted)] text-sm";

    const calculateTotal = () => {
        return costs.reduce((sum, c) => sum + (c.amount || 0), 0);
    };

    const renderBudgetChart = () => {
        const total = calculateTotal();
        if (costs.length === 0) return null;

        const colors = [
            "var(--color-primary-blue)", 
            "#4ade80", 
            "#f472b6", 
            "#fbbf24", 
            "#a78bfa", 
            "#f87171", 
            "#2dd4bf"
        ];
        
        return (
            <div className="flex flex-col gap-3 mb-4 p-4 bg-[color:var(--color-bg-primary)] rounded-lg border border-[color:var(--color-border-secondary)]">
                <h3 className="text-sm font-medium text-[color:var(--color-text-secondary)]">Budget Distribution</h3>
                
                {/* Horizontal Stacked Bar */}
                <div className="w-full h-3 rounded-full flex overflow-hidden bg-[color:var(--color-bg-secondary)]">
                    {total > 0 ? costs.map((c, i) => {
                        const width = (c.amount / total) * 100;
                        if (width === 0) return null;
                        return (
                            <div 
                                key={i} 
                                style={{ width: `${width}%`, backgroundColor: colors[i % colors.length] }} 
                                title={`${c.name}: $${c.amount}`}
                            />
                        );
                    }) : (
                        <div className="w-full h-full bg-white/10" title="Add costs to see distribution" />
                    )}
                </div>
                
                {/* Legend */}
                {total > 0 ? (
                    <div className="flex flex-wrap gap-x-4 gap-y-2 mt-1">
                        {costs.map((c, i) => {
                            if (c.amount === 0) return null;
                            return (
                                <div key={i} className="flex items-center gap-1.5 text-xs">
                                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors[i % colors.length] }} />
                                    <span className="text-[color:var(--color-text-secondary)]">{c.name}</span>
                                    <span className="font-medium text-[color:var(--color-text-primary)]">{Math.round((c.amount/total)*100)}%</span>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <span className="text-xs text-[color:var(--color-text-muted)] mt-1">Enter costs in edit mode to see budget distribution</span>
                )}
            </div>
        );
    };

    return (
        <section className="travelCost bg-[color:var(--color-bg-secondary)] rounded-lg p-4 transition-all md:col-span-2">
            <div className="flex justify-between items-center cursor-pointer select-none" onClick={onToggle}>
                <h2 className="section-header flex items-center gap-2 text-lg font-medium">💸 Travel Costs</h2>
                <i className={`fi fi-rr-angle-small-${expanded ? 'up' : 'down'} text-xl transition-transform`} />
            </div>

            {expanded && (
                <div className="mt-4 animate-fade-in">
                    <hr className="border-t border-[color:var(--color-border-secondary)] mb-3" />

                    {isEditing && (
                        <div className="callout-note mb-3">
                            <input 
                                type="text" 
                                value={costNote} 
                                onChange={(e) => onNoteChange(e.target.value)} 
                                placeholder="Add a note..." 
                                className={calloutClasses} 
                            />
                        </div>
                    )}
                    {costNote && !isEditing && (
                        <div className="callout-note bg-[color:var(--color-callout-bg)] rounded-lg p-2 mb-3 text-sm italic">{costNote}</div>
                    )}

                    {!isEditing && renderBudgetChart()}

                    <table className="cost-table w-full text-sm">
                        <thead>
                            <tr className="bg-[color:var(--color-table-header-bg)]">
                                <th className="text-left p-2 rounded-tl-lg">Cost Name</th>
                                <th className="text-right p-2 rounded-tr-lg">Amount</th>
                                {isEditing && <th className="w-8"></th>}
                            </tr>
                        </thead>
                        <tbody>
                            {costs.map((c, i) => (
                                <tr key={i} className="border-b border-[color:var(--color-table-border)]">
                                    <td className="p-2">
                                        {isEditing ? (
                                            <input 
                                                type="text" 
                                                value={c.name} 
                                                onChange={(e) => onUpdate(i, "name", e.target.value)} 
                                                className={inputClasses + " text-sm"} 
                                            />
                                        ) : (
                                            c.name
                                        )}
                                    </td>
                                    <td className="p-2 text-right">
                                        {isEditing ? (
                                            <input 
                                                type="number" 
                                                value={c.amount} 
                                                onChange={(e) => onUpdate(i, "amount", e.target.value)} 
                                                className={inputClasses + " text-sm text-right w-24"} 
                                            />
                                        ) : (
                                            `$${c.amount.toLocaleString()}`
                                        )}
                                    </td>
                                    {isEditing && (
                                        <td className="p-2">
                                            <button 
                                                onClick={() => onRemove(i)} 
                                                className="text-red-400 hover:text-red-650"
                                            >
                                                <i className="fi fi-rr-cross text-xs" />
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                            <tr className="font-bold bg-[color:var(--color-table-header-bg)]">
                                <td className="p-2 rounded-bl-lg">Total</td>
                                <td className="p-2 text-right text-[color:var(--color-total-highlight)] rounded-br-lg">${calculateTotal().toLocaleString()}</td>
                                {isEditing && <td></td>}
                            </tr>
                        </tbody>
                    </table>
                    {isEditing && (
                        <button 
                            onClick={onAdd} 
                            className="text-sm text-[color:var(--color-primary-blue)] hover:underline mt-2 text-left"
                        >
                            + Add cost
                        </button>
                    )}
                </div>
            )}
        </section>
    );
}
