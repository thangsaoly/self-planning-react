export default function ToastContainer({ toasts, removeToast }) {
    return (
        <div className="fixed bottom-4 right-4 z-[300] flex flex-col gap-2 pointer-events-none">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`px-4 py-3 rounded-lg shadow-lg text-sm font-medium animate-slide-up pointer-events-auto flex items-center justify-between gap-3 min-w-[250px] ${
                        toast.type === "success" ? "bg-green-600 text-white" : 
                        toast.type === "error" ? "bg-red-600 text-white" : 
                        "bg-[color:var(--color-bg-card)] text-[color:var(--color-text-primary)] border border-[color:var(--color-border-primary)]"
                    }`}
                >
                    <div className="flex items-center gap-2">
                        {toast.type === "success" && <i className="fi fi-rr-check-circle flex items-center" />}
                        {toast.type === "error" && <i className="fi fi-rr-cross-circle flex items-center" />}
                        {toast.type === "info" && <i className="fi fi-rr-info flex items-center" />}
                        <span>{toast.message}</span>
                    </div>
                    <button onClick={() => removeToast(toast.id)} className="opacity-80 hover:opacity-100 flex items-center">
                        <i className="fi fi-rr-cross-small" />
                    </button>
                </div>
            ))}
        </div>
    );
}
