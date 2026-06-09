import { useState } from "react";
import { useToast } from "../context/ToastContext";

const travelTypeOptions = [
    { value: "Citytrip", label: "Citytrip" },
    { value: "Roadtrip", label: "Roadtrip" },
    { value: "Beach", label: "Beach" },
    { value: "Festival", label: "Festival" },
    { value: "Camping", label: "Camping" },
    { value: "Hiking", label: "Hiking" },
];

const travelStatusOptions = [
    { value: "visiting", label: "Visiting" },
    { value: "upcoming", label: "Upcoming" },
    { value: "visited", label: "Visited" },
];

const travelTypeEmojis = {
    Citytrip: "🏙",
    Roadtrip: "🏕",
    Beach: "🏖",
    Festival: "🎉",
    Camping: "⛺",
    Hiking: "🥾",
};

const defaultHeroImages = {
    Citytrip: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1280&q=80",
    Roadtrip: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1280&q=80",
    Beach: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1280&q=80",
    Festival: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1280&q=80",
    Camping: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1280&q=80",
    Hiking: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=1280&q=80",
};

export default function NewPlanModal({ isOpen, onClose, onSubmit, targetSection }) {
    const { addToast } = useToast();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        title: "",
        heroImageUrl: "",
        startDate: "",
        endDate: "",
        travelStatus: targetSection || "visiting",
        travelType: "",
    });

    const [days, setDays] = useState([
        {
            day: 1,
            activities: [{ title: "", isDone: false }],
        },
    ]);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleActivityChange = (dayIndex, activityIndex, value) => {
        setDays((prev) => {
            const newDays = [...prev];
            newDays[dayIndex].activities[activityIndex].title = value;
            return newDays;
        });
    };

    const addActivity = (dayIndex) => {
        setDays((prev) => {
            const newDays = [...prev];
            newDays[dayIndex].activities.push({ title: "", isDone: false });
            return newDays;
        });
    };

    const removeActivity = (dayIndex, activityIndex) => {
        setDays((prev) => {
            const newDays = [...prev];
            newDays[dayIndex].activities.splice(activityIndex, 1);
            return newDays;
        });
    };

    const addDay = () => {
        setDays((prev) => [
            ...prev,
            {
                day: prev.length + 1,
                activities: [{ title: "", isDone: false }],
            },
        ]);
    };

    const removeDay = (dayIndex) => {
        if (days.length <= 1) return;
        setDays((prev) => {
            const newDays = prev.filter((_, i) => i !== dayIndex);
            return newDays.map((day, i) => ({ ...day, day: i + 1 }));
        });
    };

    const handleNext = () => {
        if (step === 1 && !formData.title.trim()) {
            addToast("Please enter a destination name", "error");
            return;
        }
        if (step === 2 && !formData.travelType) {
            addToast("Please select a travel type", "error");
            return;
        }
        setStep(step + 1);
    };

    const handleBack = () => setStep(step - 1);

    const handleSubmit = (e) => {
        e.preventDefault();

        setIsSubmitting(true);

        const travelDate =
            formData.startDate && formData.endDate
                ? `${formatDate(formData.startDate)} - ${formatDate(formData.endDate)}`
                : "TBD";

        const newPlan = {
            id: crypto.randomUUID(),
            title: formData.title,
            heroImageUrl: formData.heroImageUrl || defaultHeroImages[formData.travelType],
            meta: {
                travelDate,
                travelStatus: formData.travelStatus,
                travelType: formData.travelType,
            },
            itinerary: days.filter((day) => day.activities.some((a) => a.title.trim())),
        };

        const cardData = {
            id: newPlan.id,
            name: formData.title,
            emoji: travelTypeEmojis[formData.travelType] || "✈️",
            type: formData.travelType,
            typeClass: formData.travelType,
            image: formData.heroImageUrl || defaultHeroImages[formData.travelType],
            todos: [],
            packing: [],
            itinerary: newPlan.itinerary
        };

        onSubmit(cardData, formData.travelStatus);

        setFormData({
            title: "",
            heroImageUrl: "",
            startDate: "",
            endDate: "",
            travelStatus: targetSection || "visiting",
            travelType: "",
        });
        setDays([{ day: 1, activities: [{ title: "", isDone: false }] }]);
        setStep(1);
        setIsSubmitting(false);
        onClose();
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    };

    if (!isOpen) return null;

    const getDayCardClass = (index) => {
        const themes = [
            "bg-[color:var(--color-planner-day1-bg)]",
            "bg-[color:var(--color-planner-day2-bg)]",
            "bg-[color:var(--color-planner-day3-bg)]",
        ];
        return themes[index % 3];
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm transition-all"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                    setStep(1);
                }
            }}
        >
            <div className="relative w-full max-w-3xl max-h-[90vh] bg-[color:var(--color-bg-primary)] overflow-y-auto rounded-xl shadow-2xl animate-slide-up flex flex-col">
                <button
                    onClick={() => { onClose(); setStep(1); }}
                    className="absolute top-4 right-4 z-50 px-2 py-1 bg-[color:var(--color-bg-secondary)] hover:bg-red-500 hover:text-white rounded-lg transition-colors flex items-center justify-center"
                >
                    <i className="fi fi-rr-cross text-sm" />
                </button>

                <div className="w-full h-[180px] overflow-hidden relative rounded-t-xl shrink-0">
                    <img
                        src={
                            formData.heroImageUrl ||
                            (formData.travelType && defaultHeroImages[formData.travelType]) ||
                            "https://www.cathaypacific.com/content/dam/focal-point/cx/inspiration/2025/11/Dining_Cowichan_Valley_the_undiscovered_gem_of_Canada%E2%80%99s_west_coast-RobWilson_BlueGrouse_01-Credit-Cowichan_Valley-HERO.renditionimage.1700.850.jpg"
                        }
                        alt="Hero"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--color-bg-primary)] to-transparent" />
                    
                    <div className="absolute bottom-4 left-6 right-6">
                        <div className="flex justify-between items-end">
                            <h2 className="text-3xl font-bold text-[color:var(--color-text-primary)]">
                                {step === 1 ? "Where to?" : step === 2 ? "Trip Details" : "Plan Itinerary"}
                            </h2>
                            <div className="flex gap-2">
                                <div className={`w-12 h-1.5 rounded-full ${step >= 1 ? "bg-[color:var(--color-primary-blue)]" : "bg-white/20"}`} />
                                <div className={`w-12 h-1.5 rounded-full ${step >= 2 ? "bg-[color:var(--color-primary-blue)]" : "bg-white/20"}`} />
                                <div className={`w-12 h-1.5 rounded-full ${step >= 3 ? "bg-[color:var(--color-primary-blue)]" : "bg-white/20"}`} />
                            </div>
                        </div>
                    </div>
                </div>

                <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }} className="flex-1 p-6 overflow-y-auto flex flex-col gap-6">
                    {step === 1 && (
                        <div className="flex flex-col gap-6 animate-fade-in">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-[color:var(--color-text-secondary)]">Destination Name</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Paris, Tokyo, Bali"
                                    className="text-2xl font-medium bg-[color:var(--color-bg-secondary)] border border-[color:var(--color-border-primary)] rounded-lg px-4 py-3 outline-none text-[color:var(--color-text-primary)] placeholder:text-[color:var(--color-text-muted)] focus:border-[color:var(--color-primary-blue)] transition-colors"
                                    autoFocus
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-[color:var(--color-text-secondary)]">Travel Dates (Optional)</label>
                                <div className="flex items-center gap-4">
                                    <div className="flex-1 bg-[color:var(--color-bg-secondary)] border border-[color:var(--color-border-primary)] rounded-lg px-4 py-2 flex items-center gap-3">
                                        <i className="fi fi-rr-calendar text-[color:var(--color-text-muted)]" />
                                        <input
                                            type="date"
                                            name="startDate"
                                            value={formData.startDate}
                                            onChange={handleInputChange}
                                            className="bg-transparent border-none outline-none text-[color:var(--color-text-primary)] w-full"
                                        />
                                    </div>
                                    <span className="text-[color:var(--color-text-muted)]">to</span>
                                    <div className="flex-1 bg-[color:var(--color-bg-secondary)] border border-[color:var(--color-border-primary)] rounded-lg px-4 py-2 flex items-center gap-3">
                                        <i className="fi fi-rr-calendar text-[color:var(--color-text-muted)]" />
                                        <input
                                            type="date"
                                            name="endDate"
                                            value={formData.endDate}
                                            onChange={handleInputChange}
                                            className="bg-transparent border-none outline-none text-[color:var(--color-text-primary)] w-full"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="flex flex-col gap-6 animate-fade-in">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-[color:var(--color-text-secondary)]">Travel Status</label>
                                    <select
                                        name="travelStatus"
                                        value={formData.travelStatus}
                                        onChange={handleInputChange}
                                        className="w-full bg-[color:var(--color-bg-secondary)] border border-[color:var(--color-border-primary)] rounded-lg px-4 py-3 outline-none text-[color:var(--color-text-primary)] focus:border-[color:var(--color-primary-blue)] transition-colors"
                                    >
                                        {travelStatusOptions.map((opt) => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-[color:var(--color-text-secondary)]">Travel Type</label>
                                    <select
                                        name="travelType"
                                        value={formData.travelType}
                                        onChange={handleInputChange}
                                        className="w-full bg-[color:var(--color-bg-secondary)] border border-[color:var(--color-border-primary)] rounded-lg px-4 py-3 outline-none text-[color:var(--color-text-primary)] focus:border-[color:var(--color-primary-blue)] transition-colors"
                                    >
                                        <option value="" disabled>Select type</option>
                                        {travelTypeOptions.map((opt) => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-[color:var(--color-text-secondary)]">Custom Image URL (Optional)</label>
                                <div className="flex items-center gap-3 bg-[color:var(--color-bg-secondary)] border border-[color:var(--color-border-primary)] rounded-lg px-4 py-3 focus-within:border-[color:var(--color-primary-blue)] transition-colors">
                                    <i className="fi fi-rr-picture text-[color:var(--color-text-muted)]" />
                                    <input
                                        type="url"
                                        name="heroImageUrl"
                                        value={formData.heroImageUrl}
                                        onChange={handleInputChange}
                                        placeholder="Leave empty to use a default image based on travel type"
                                        className="flex-1 bg-transparent border-none outline-none text-[color:var(--color-text-primary)] placeholder:text-[color:var(--color-text-muted)]"
                                    />
                                </div>
                            </div>
                            
                            {/* Image Grid Suggestion */}
                            {formData.travelType && !formData.heroImageUrl && (
                                <div className="text-xs text-[color:var(--color-text-muted)]">
                                    Using default image for {formData.travelType}.
                                </div>
                            )}
                        </div>
                    )}

                    {step === 3 && (
                        <div className="flex flex-col gap-4 animate-fade-in flex-1">
                            <p className="text-sm text-[color:var(--color-text-secondary)]">Let's build a rough itinerary. You can always edit this later.</p>
                            <div className="flex gap-4 overflow-x-auto pb-4 pt-2">
                                {days.map((day, dayIndex) => (
                                    <div key={dayIndex} className={`flex-shrink-0 w-[240px] rounded-xl p-4 shadow-sm border border-white/10 ${getDayCardClass(dayIndex)}`}>
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="inline-block px-3 py-1 rounded-md bg-white/20 text-sm font-medium">
                                                Day {day.day}
                                            </span>
                                            {days.length > 1 && (
                                                <button type="button" onClick={() => removeDay(dayIndex)} className="text-white/60 hover:text-red-400 p-1 rounded hover:bg-white/10 transition-colors">
                                                    <i className="fi fi-rr-trash flex items-center" />
                                                </button>
                                            )}
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            {day.activities.map((activity, actIndex) => (
                                                <div key={actIndex} className="bg-white/10 rounded-lg p-2.5 flex items-center gap-2 group">
                                                    <input
                                                        type="text"
                                                        value={activity.title}
                                                        onChange={(e) => handleActivityChange(dayIndex, actIndex, e.target.value)}
                                                        placeholder="Add activity..."
                                                        className="bg-transparent border-none outline-none flex-1 text-sm text-[color:var(--color-text-primary)] placeholder:text-white/40"
                                                    />
                                                    {day.activities.length > 1 && (
                                                        <button type="button" onClick={() => removeActivity(dayIndex, actIndex)} className="text-white/40 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <i className="fi fi-rr-cross-small flex items-center text-lg" />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                            <button type="button" onClick={() => addActivity(dayIndex)} className="w-full py-2 text-sm text-white/70 hover:text-white border border-dashed border-white/30 rounded-lg hover:border-white/50 hover:bg-white/5 transition-colors flex justify-center items-center gap-2">
                                                <i className="fi fi-rr-plus flex items-center" /> Activity
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                <div onClick={addDay} className="flex-shrink-0 w-[240px] rounded-xl border-2 border-dashed border-[color:var(--color-border-primary)] flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-[color:var(--color-bg-secondary)] hover:border-[color:var(--color-primary-blue)] transition-colors text-[color:var(--color-text-muted)] hover:text-[color:var(--color-primary-blue)]">
                                    <i className="fi fi-rr-plus text-2xl flex items-center" />
                                    <span className="font-medium">Add Day</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between items-center mt-auto pt-4 border-t border-[color:var(--color-border-secondary)]">
                        {step > 1 ? (
                            <button type="button" onClick={handleBack} className="px-6 py-2.5 text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)] hover:bg-[color:var(--color-bg-secondary)] rounded-lg font-medium transition-colors">
                                Back
                            </button>
                        ) : <div />}
                        
                        <button type="submit" disabled={isSubmitting} className="px-8 py-2.5 bg-[color:var(--color-primary-blue)] hover:bg-[color:var(--color-primary-blue-light)] text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2">
                            {step < 3 ? "Next" : (isSubmitting ? "Creating..." : "Create Plan")}
                            {step < 3 && <i className="fi fi-rr-arrow-small-right flex items-center" />}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
