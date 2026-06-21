export default function TripMetaSection({
    formData,
    isEditing,
    handleInputChange,
    travelStatusOptions,
    travelTypeOptions
}) {
    const inputClasses = "w-full px-3 py-2 rounded bg-[color:var(--color-bg-secondary)] border-none text-[color:var(--color-text-primary)] outline-none placeholder:text-[color:var(--color-text-muted)]";

    return (
        <section className="title-section sticky top-0 z-[100] bg-[color:var(--color-bg-primary)] pt-4 pb-4 mb-6 shadow-[0_4px_6px_-6px_rgba(0,0,0,0.1)]">
            <div className="flex justify-between items-end">
                <div className="flex-1">
                    {isEditing ? (
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Destination name"
                            className="text-[length:var(--font-size-h1)] font-bold bg-transparent border-b border-[color:var(--color-border-primary)] outline-none w-full text-[color:var(--color-text-primary)] placeholder:text-[color:var(--color-text-muted)]"
                        />
                    ) : (
                        <h1 className="text-[length:var(--font-size-h1)] font-bold text-[color:var(--color-text-primary)] leading-tight">
                            {formData.name}
                        </h1>
                    )}
                </div>
            </div>

            {/* Meta Info */}
            <div className="meta-info flex flex-col gap-3 ml-6 mt-4">
                {/* Travel Date */}
                <div className="meta-item flex items-center gap-3 text-sm">
                    <img src="https://cdn-icons-png.flaticon.com/128/3652/3652267.png" alt="calendar" className="w-8 h-8" />
                    <span className="font-medium w-28 text-[color:var(--color-text-secondary)]">Travel Date</span>
                    {isEditing ? (
                        <div className="flex flex-wrap items-center gap-2">
                            <input 
                                type="date" 
                                name="startDate" 
                                value={formData.startDate} 
                                onChange={handleInputChange} 
                                className={inputClasses + " w-auto"} 
                            />
                            <span className="text-[color:var(--color-text-muted)]">-</span>
                            <input 
                                type="date" 
                                name="endDate" 
                                value={formData.endDate} 
                                onChange={handleInputChange} 
                                className={inputClasses + " w-auto"} 
                            />
                        </div>
                    ) : (
                        <span className="text-[color:var(--color-text-muted)]">
                            {formData.startDate && formData.endDate ? `${formData.startDate} - ${formData.endDate}` : "Not set"}
                        </span>
                    )}
                </div>

                {/* Travel Status */}
                <div className="meta-item flex items-center gap-3 text-sm">
                    <img src="https://cdn-icons-png.flaticon.com/128/17438/17438463.png" alt="status" className="w-8 h-8" />
                    <span className="font-medium w-28 text-[color:var(--color-text-secondary)]">Travel Status</span>
                    {isEditing ? (
                        <select 
                            name="travelStatus" 
                            value={formData.travelStatus} 
                            onChange={handleInputChange} 
                            className={inputClasses + " w-40"}
                        >
                            {travelStatusOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    ) : (
                        <span className="text-[color:var(--color-text-muted)] capitalize">{formData.travelStatus}</span>
                    )}
                </div>

                {/* Travel Type */}
                <div className="meta-item flex items-center gap-3 text-sm">
                    <img src="https://cdn-icons-png.flaticon.com/128/3308/3308315.png" alt="type" className="w-8 h-8" />
                    <span className="font-medium w-28 text-[color:var(--color-text-secondary)]">Travel Type</span>
                    {isEditing ? (
                        <select 
                            name="travelType" 
                            value={formData.travelType} 
                            onChange={handleInputChange} 
                            className={inputClasses + " w-40"}
                        >
                            <option value="" disabled>Select type</option>
                            {travelTypeOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    ) : (
                        <span className="text-[color:var(--color-text-muted)]">{formData.travelType || "Not set"}</span>
                    )}
                </div>

                {/* Image URL (editing only) */}
                {isEditing && (
                    <div className="meta-item flex items-center gap-3 text-sm">
                        <img src="https://cdn-icons-png.flaticon.com/128/1375/1375106.png" alt="image" className="w-8 h-8" />
                        <span className="font-medium w-28 text-[color:var(--color-text-secondary)]">Image URL</span>
                        <input 
                            type="url" 
                            name="image" 
                            value={formData.image} 
                            onChange={handleInputChange} 
                            placeholder="https://example.com/image.jpg" 
                            className={inputClasses + " flex-1 max-w-md"} 
                        />
                    </div>
                )}
            </div>
        </section>
    );
}
