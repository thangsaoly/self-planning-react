export default function ToastContainer({ toasts, removeToast }) {
    const getTypeStyles = (type) => {
        switch (type) {
            case "success":
                return {
                    border: "border-l-emerald-500",
                    iconColor: "text-emerald-400",
                    progressBg: "bg-emerald-500",
                    iconClass: "fi fi-rr-check-circle"
                };
            case "error":
                return {
                    border: "border-l-rose-500",
                    iconColor: "text-rose-400",
                    progressBg: "bg-rose-500",
                    iconClass: "fi fi-rr-cross-circle"
                };
            case "warning":
                return {
                    border: "border-l-amber-500",
                    iconColor: "text-amber-400",
                    progressBg: "bg-amber-500",
                    iconClass: "fi fi-rr-triangle-warning"
                };
            case "info":
            default:
                return {
                    border: "border-l-sky-500",
                    iconColor: "text-sky-400",
                    progressBg: "bg-sky-500",
                    iconClass: "fi fi-rr-info"
                };
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none max-w-sm w-full">
            {toasts.map((toast) => {
                const styles = getTypeStyles(toast.type);
                return (
                    <div
                        key={toast.id}
                        className={`relative overflow-hidden bg-neutral-900/95 border border-neutral-800 border-l-[6px] ${styles.border} text-white shadow-2xl backdrop-blur-md rounded-xl animate-slide-up pointer-events-auto flex flex-col min-w-[280px] w-full transition-all duration-300`}
                    >
                        <div className="flex items-start justify-between p-4 gap-3">
                            <div className="flex items-start gap-3">
                                <span className={`text-xl ${styles.iconColor} mt-0.5`}>
                                    <i className={`${styles.iconClass} flex items-center justify-center`} />
                                </span>
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                                        {toast.type}
                                    </span>
                                    <p className="text-sm font-medium text-neutral-100">
                                        {toast.message}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => removeToast(toast.id)}
                                className="text-neutral-400 hover:text-white transition-colors cursor-pointer p-0.5 hover:bg-white/5 rounded"
                                aria-label="Close toast"
                            >
                                <i className="fi fi-rr-cross-small text-lg flex items-center justify-center" />
                            </button>
                        </div>
                        {/* Custom Animated Progress Bar */}
                        <div className="w-full h-1 bg-white/5 absolute bottom-0 left-0">
                            <div className={`h-full ${styles.progressBg} animate-progress-bar`} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
