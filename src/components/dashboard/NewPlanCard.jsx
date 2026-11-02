export default function NewPlanCard({ onClick }) {
    return (
        <div
            role="button"
            tabIndex={0}
            aria-label="Create a new plan"
            onClick={onClick}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onClick?.();
                }
            }}
            className="new-plan group shrink-0 flex justify-center items-center bg-(--color-bg-card) rounded-[10px] border border-dashed border-(--color-text-secondary) cursor-pointer transition-all duration-300 hover:border-(--color-primary-blue) hover:bg-(--color-drag-tint)"
        >
            <span className="flex flex-col justify-center items-center gap-3 w-[280px] py-16 text-(--color-text-primary)">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(21,93,252,0.12)] shadow-[inset_0_0_0_1px_rgba(21,93,252,0.15)] transition-all duration-300 group-hover:scale-110 group-hover:bg-[rgba(21,93,252,0.18)] group-hover:shadow-[0_0_20px_rgba(21,93,252,0.35)]">
                    {/* Icon-font glyphs sit on the text baseline: leading-none +
                        flex-centering the <i> itself keeps the plus visually
                        centered inside the circle. */}
                    <i
                        aria-hidden="true"
                        className="fi fi-rr-plus flex items-center justify-center text-xl leading-none"
                    />
                </span>
                <span className="text-sm font-medium">New Plan</span>
            </span>
        </div>
    );
}
