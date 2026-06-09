import { useState } from "react";

export default function TodoSection({ todos, todoNote, isEditing, onToggle, onAdd, onUpdate, onRemove, onNoteChange }) {
    const [isExpanded, setIsExpanded] = useState(true);
    const inputClasses = "w-full px-3 py-2 rounded bg-[color:var(--color-bg-secondary)] border-none text-[color:var(--color-text-primary)] outline-none placeholder:text-[color:var(--color-text-muted)]";
    const calloutClasses = "w-full px-3 py-2 rounded bg-[color:var(--color-callout-bg)] border border-[color:var(--color-callout-border)] text-[color:var(--color-text-primary)] outline-none placeholder:text-[color:var(--color-text-muted)] text-sm";

    return (
        <section className="todo-list bg-[color:var(--color-bg-secondary)] rounded-lg p-4 transition-all">
            <div className="flex justify-between items-center cursor-pointer select-none" onClick={() => setIsExpanded(!isExpanded)}>
                <h2 className="section-header flex items-center gap-2 text-lg font-medium">🎯 To Do's</h2>
                <i className={`fi fi-rr-angle-small-${isExpanded ? 'up' : 'down'} text-xl transition-transform`} />
            </div>

            {isExpanded && (
                <div className="mt-4 animate-fade-in">
                    <hr className="border-t border-[color:var(--color-border-secondary)] mb-3" />

            {isEditing && (
                <div className="callout-note mb-3">
                    <input type="text" value={todoNote} onChange={(e) => onNoteChange(e.target.value)} placeholder="Add a note..." className={calloutClasses} />
                </div>
            )}
            {todoNote && !isEditing && (
                <div className="callout-note bg-[color:var(--color-callout-bg)] rounded-lg p-2 mb-3 text-sm italic">{todoNote}</div>
            )}

            {todos.map((todo, i) => (
                <div key={i} className="todo-item flex items-center gap-3 py-2 border-b border-[color:var(--color-border-secondary)] last:border-b-0">
                    <input type="checkbox" checked={todo.isDone} onChange={() => onToggle(i)} className="w-4 h-4 rounded accent-[color:var(--color-primary-blue)]" />
                    {isEditing ? (
                        <>
                            <input type="text" value={todo.task} onChange={(e) => onUpdate(i, e.target.value)} className={inputClasses + " flex-1 text-sm"} />
                            <button onClick={() => onRemove(i)} className="text-red-400 hover:text-red-600"><i className="fi fi-rr-cross text-xs" /></button>
                        </>
                    ) : (
                        <span className={`text-sm transition-all duration-300 ${todo.isDone ? "line-through opacity-60 text-[color:var(--color-text-muted)]" : ""}`}>{todo.task}</span>
                    )}
                </div>
            ))}
            {isEditing && (
                <button onClick={onAdd} className="text-sm text-[color:var(--color-primary-blue)] hover:underline mt-2">+ Add todo</button>
            )}
                </div>
            )}
        </section>
    );
}
