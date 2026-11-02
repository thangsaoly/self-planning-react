export default function ItinerarySection({ days, isEditing, expanded, onToggle, onActivityChange, onToggleActivity, onAddActivity, onRemoveActivity, onAddDay, onRemoveDay }) {
    const getDayCardClass = (index) => {
        const themes = [
            "bg-(--color-planner-day1-bg)",
            "bg-(--color-planner-day2-bg)",
            "bg-(--color-planner-day3-bg)",
        ];
        return themes[index % 3];
    };

    const totalActivities = days.reduce((sum, day) => sum + day.activities.length, 0);
    const doneActivities = days.reduce((sum, day) => sum + day.activities.filter((a) => a.isDone).length, 0);

    return (
        <section className="mb-8">
            <div className="flex justify-between items-center cursor-pointer select-none" onClick={onToggle}>
                <div className="flex items-center gap-2">
                    <h2 className="section-header flex items-center gap-2 text-xl font-medium">🛣️ Itinerary</h2>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[rgba(255,255,255,0.08)] text-(--color-text-secondary)">{doneActivities}/{totalActivities}</span>
                </div>
                <i className={`fi fi-rr-angle-small-down text-xl transition-transform duration-300 ${expanded ? "rotate-180" : ""}`} />
            </div>

            <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                <div className="min-h-0 overflow-hidden">
                    <div className="mt-4">
                        <hr className="border-t border-(--color-border-secondary) my-4" />

                        <div className="itinerary-grid flex gap-4 overflow-x-auto pb-4 rounded-lg">
                            {days.map((day, dayIndex) => (
                                <div key={dayIndex} className={`day-card shrink-0 w-[200px] min-h-[320px] rounded-lg p-4 ${getDayCardClass(dayIndex)}`}>
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
                                        <div key={actIndex} className="activity-card bg-white/10 rounded-lg p-3 mb-3 transition-transform duration-200 hover:-translate-y-0.5">
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
                                                    <span className={`activity-title text-sm transition-all duration-300 ${activity.isDone ? "line-through opacity-60 text-(--color-text-muted)" : ""}`}>
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
                                                    className="trip-check"
                                                />
                                                <span className="text-xs text-(--color-text-secondary)">Done</span>
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
                                    className="newDay shrink-0 w-[200px] h-[320px] rounded-lg border border-dashed border-gray-400 flex items-center justify-center cursor-pointer hover:bg-white/5"
                                >
                                    <span className="text-(--color-text-secondary)">+ New Day</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
