export default function TodoSection({ todos, todoNote, isEditing, expanded, onToggle, onToggleItem, onAdd, onUpdate, onRemove, onNoteChange }) {
    const inputClasses = "w-full px-3 py-2 rounded bg-(--color-bg-secondary) border-none text-(--color-text-primary) outline-none placeholder:text-(--color-text-muted)";
    const calloutClasses = "w-full px-3 py-2 rounded bg-(--color-callout-bg) border border-(--color-callout-border) text-(--color-text-primary) outline-none placeholder:text-(--color-text-muted) text-sm";

    return (
        <section className="todo-list bg-(--color-bg-secondary) rounded-lg p-4 transition-all">
            <div className="flex justify-between items-center cursor-pointer select-none" onClick={onToggle}>
                <div className="flex items-center gap-2">
                    <h2 className="section-header flex items-center gap-2 text-lg font-medium">🎯 To Do's</h2>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[rgba(255,255,255,0.08)] text-(--color-text-secondary)">{todos.filter((t) => t.isDone).length}/{todos.length}</span>
                </div>
                <i className={`fi fi-rr-angle-small-down text-xl transition-transform duration-300 ${expanded ? "rotate-180" : ""}`} />
            </div>

            <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                <div className="min-h-0 overflow-hidden">
                    <div className="mt-4">
                        <hr className="border-t border-(--color-border-secondary) mb-3" />

                        {isEditing && (
                            <div className="callout-note mb-3">
                                <input type="text" value={todoNote} onChange={(e) => onNoteChange(e.target.value)} placeholder="Add a note..." className={calloutClasses + " border-l-2 border-l-(--color-primary-blue)"} />
                            </div>
                        )}
                        {todoNote && !isEditing && (
                            <div className="callout-note w-full bg-(--color-callout-bg) border-l-2 border-(--color-primary-blue) rounded-lg p-3 mb-3 text-sm text-(--color-text-primary)">{todoNote}</div>
                        )}

                        {todos.map((todo, i) => (
                            <div key={i} className="todo-item flex items-center gap-3 py-2 border-b border-(--color-border-secondary) last:border-b-0">
                                <input type="checkbox" checked={todo.isDone} onChange={() => onToggleItem(i)} className="trip-check" />
                                {isEditing ? (
                                    <>
                                        <input type="text" value={todo.task} onChange={(e) => onUpdate(i, e.target.value)} className={inputClasses + " flex-1 text-sm"} />
                                        <button onClick={() => onRemove(i)} className="text-red-400 hover:text-red-600"><i className="fi fi-rr-cross text-xs" /></button>
                                    </>
                                ) : (
                                    <span className={`text-sm transition-all duration-300 ${todo.isDone ? "line-through opacity-60 text-(--color-text-muted)" : ""}`}>{todo.task}</span>
                                )}
                            </div>
                        ))}
                        {isEditing && (
                            <button onClick={onAdd} className="text-sm text-(--color-primary-blue) hover:underline mt-2">+ Add todo</button>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
