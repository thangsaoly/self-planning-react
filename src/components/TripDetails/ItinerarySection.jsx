export default function ItinerarySection({ days, isEditing, onActivityChange, onToggleActivity, onAddActivity, onRemoveActivity, onAddDay, onRemoveDay }) {
    const getDayCardClass = (index) => {
        const themes = [
            "bg-[color:var(--color-planner-day1-bg)]",
            "bg-[color:var(--color-planner-day2-bg)]",
            "bg-[color:var(--color-planner-day3-bg)]",
        ];
        return themes[index % 3];
    };

    return (
        <section className="mb-8">
            <h2 className="section-header flex items-center gap-2 text-xl font-medium mb-4">🛣️ Itinerary</h2>
            <hr className="border-t border-[color:var(--color-border-secondary)] my-4" />

            <div className="itinerary-grid flex gap-4 overflow-x-auto pb-4 rounded-lg">
                {days.map((day, dayIndex) => (
                    <div key={dayIndex} className={`day-card flex-shrink-0 w-[200px] min-h-[320px] rounded-lg p-4 ${getDayCardClass(dayIndex)}`}>
                        <div className="flex justify-between items-start mb-4">
                            <span className="day-badge inline-block px-3 py-1 rounded bg-white/20 text-sm">Day {day.day}</span>
                            {isEditing && days.length > 1 && (
                                <button 
                                    onClick={() => onRemoveDay(dayIndex)} 
                                    className="text-xs hover:text-red-400"
                                >
                                    <i className="fi fi-rr-cross" />
                                </button>
                            )}
                        </div>

                        {day.activities.map((activity, actIndex) => (
                            <div key={actIndex} className="activity-card bg-white/10 rounded-lg p-3 mb-3">
                                <div className="activity-header flex justify-between items-start mb-2">
                                    {isEditing ? (
                                        <input 
                                            type="text" 
                                            value={activity.title} 
                                            onChange={(e) => onActivityChange(dayIndex, actIndex, e.target.value)} 
                                            placeholder="Activity" 
                                            className="bg-transparent border-none outline-none w-full text-sm" 
                                        />
                                    ) : (
                                        <span className={`activity-title text-sm transition-all duration-300 ${activity.isDone ? "line-through opacity-60 text-[color:var(--color-text-muted)]" : ""}`}>
                                            {activity.title}
                                        </span>
                                    )}
                                    {isEditing && day.activities.length > 1 && (
                                        <button 
                                            onClick={() => onRemoveActivity(dayIndex, actIndex)} 
                                            className="text-xs ml-2 hover:text-red-400"
                                        >
                                            <i className="fi fi-rr-cross" />
                                        </button>
                                    )}
                                </div>
                                <label className="checkbox-label flex items-center gap-2 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={activity.isDone} 
                                        onChange={() => onToggleActivity(dayIndex, actIndex)} 
                                        className="w-4 h-4 rounded accent-[color:var(--color-primary-blue)]" 
                                    />
                                    <span className="text-xs text-[color:var(--color-text-secondary)]">Done</span>
                                </label>
                            </div>
                        ))}

                        {isEditing && (
                            <button 
                                onClick={() => onAddActivity(dayIndex)} 
                                className="new-page-btn w-full py-2 text-sm border border-dashed border-white/30 rounded-lg hover:border-white/50"
                            >
                                + New activity
                            </button>
                        )}
                    </div>
                ))}

                {isEditing && (
                    <div 
                        onClick={onAddDay} 
                        className="newDay flex-shrink-0 w-[200px] h-[320px] rounded-lg border border-dashed border-gray-400 flex items-center justify-center cursor-pointer hover:bg-white/5"
                    >
                        <span className="text-[color:var(--color-text-secondary)]">+ New Day</span>
                    </div>
                )}
            </div>
        </section>
    );
}
