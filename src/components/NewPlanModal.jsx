import { useState } from "react";

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

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            alert("Please enter a destination name");
            return;
        }

        if (!formData.travelType) {
            alert("Please select a travel type");
            return;
        }

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

        // Convert to simplified card format
        const cardData = {
            id: newPlan.id,
            name: formData.title,
            emoji: travelTypeEmojis[formData.travelType] || "✈️",
            type: formData.travelType,
            typeClass: formData.travelType,
            image: formData.heroImageUrl || defaultHeroImages[formData.travelType],
        };

        onSubmit(cardData, formData.travelStatus);

        // Reset form
        setFormData({
            title: "",
            heroImageUrl: "",
            startDate: "",
            endDate: "",
            travelStatus: targetSection || "visiting",
            travelType: "",
        });
        setDays([{ day: 1, activities: [{ title: "", isDone: false }] }]);
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="relative w-full h-full bg-[color:var(--color-bg-primary)] overflow-y-auto">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="fixed top-0 right-0 z-50 px-2 py-1 bg-red-600 hover:bg-red-800 rounded-bl-lg transition-colors"
                >
                    <i className="fi fi-rr-cross text-white text-sm" />
                </button>

                {/* Hero Image */}
                <div className="w-full h-[260px] overflow-hidden">
                    <img
                        src={
                            formData.heroImageUrl ||
                            (formData.travelType && defaultHeroImages[formData.travelType]) ||
                            "https://www.cathaypacific.com/content/dam/focal-point/cx/inspiration/2025/11/Dining_Cowichan_Valley_the_undiscovered_gem_of_Canada%E2%80%99s_west_coast-RobWilson_BlueGrouse_01-Credit-Cowichan_Valley-HERO.renditionimage.1700.850.jpg"
                        }
                        alt="Hero"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Main Content */}
                <form onSubmit={handleSubmit} className="relative mt-6 w-[90%] mx-auto pb-10">
                    {/* Title Section */}
                    <section className="mb-6">
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="New Itinerary"
                            className="text-[length:var(--font-size-h1)] font-normal bg-transparent border-none outline-none w-full text-[color:var(--color-text-primary)] placeholder:text-[color:var(--color-text-muted)]"
                        />
                        <hr className="border-t border-[color:var(--color-border-secondary)] my-4" />

                        {/* Meta Info */}
                        <div className="flex flex-col gap-3 ml-6">
                            {/* Travel Date */}
                            <div className="flex items-center gap-3 text-sm">
                                <img
                                    src="https://cdn-icons-png.flaticon.com/128/3652/3652267.png"
                                    alt="calendar"
                                    className="w-8 h-8"
                                />
                                <span className="font-medium w-28">Travel Date</span>
                                <div className="flex flex-wrap items-center gap-2">
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleInputChange}
                                        className="px-2 py-1.5 rounded bg-[color:var(--color-bg-secondary)] border-none text-[color:var(--color-text-primary)]"
                                    />
                                    <span className="text-[color:var(--color-text-muted)]">-</span>
                                    <input
                                        type="date"
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={handleInputChange}
                                        className="px-2 py-1.5 rounded bg-[color:var(--color-bg-secondary)] border-none text-[color:var(--color-text-primary)]"
                                    />
                                </div>
                            </div>

                            {/* Travel Status */}
                            <div className="flex items-center gap-3 text-sm">
                                <img
                                    src="https://cdn-icons-png.flaticon.com/128/17438/17438463.png"
                                    alt="status"
                                    className="w-8 h-8"
                                />
                                <span className="font-medium w-28">Travel Status</span>
                                <select
                                    name="travelStatus"
                                    value={formData.travelStatus}
                                    onChange={handleInputChange}
                                    className="w-40 px-2 py-1.5 rounded bg-[color:var(--color-bg-secondary)] border-none text-[color:var(--color-text-primary)] outline-none"
                                >
                                    {travelStatusOptions.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Travel Type */}
                            <div className="flex items-center gap-3 text-sm">
                                <img
                                    src="https://cdn-icons-png.flaticon.com/128/3308/3308315.png"
                                    alt="type"
                                    className="w-8 h-8"
                                />
                                <span className="font-medium w-28">Travel Type</span>
                                <select
                                    name="travelType"
                                    value={formData.travelType}
                                    onChange={handleInputChange}
                                    className="w-40 px-2 py-1.5 rounded bg-[color:var(--color-bg-secondary)] border-none text-[color:var(--color-text-primary)] outline-none"
                                >
                                    <option value="" disabled>
                                        Select type
                                    </option>
                                    {travelTypeOptions.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Hero Image URL */}
                            <div className="flex items-center gap-3 text-sm">
                                <img
                                    src="https://cdn-icons-png.flaticon.com/128/1375/1375106.png"
                                    alt="image"
                                    className="w-8 h-8"
                                />
                                <span className="font-medium w-28">Image URL</span>
                                <input
                                    type="url"
                                    name="heroImageUrl"
                                    value={formData.heroImageUrl}
                                    onChange={handleInputChange}
                                    placeholder="https://example.com/image.jpg (optional)"
                                    className="flex-1 max-w-md px-2 py-1.5 rounded bg-[color:var(--color-callout-bg)] border-none text-[color:var(--color-text-primary)] outline-none placeholder:text-[color:var(--color-text-muted)]"
                                />
                            </div>
                        </div>
                    </section>

                    <hr className="border-t border-[color:var(--color-border-secondary)] my-4" />

                    {/* Itinerary Section */}
                    <section>
                        <h2 className="flex items-center gap-2 text-xl font-medium mb-4">🛣️ Itinerary</h2>
                        <hr className="border-t border-[color:var(--color-border-secondary)] my-4" />

                        <div className="flex gap-4 overflow-x-auto pb-4 rounded-lg">
                            {days.map((day, dayIndex) => (
                                <div
                                    key={dayIndex}
                                    className={`flex-shrink-0 w-[200px] min-h-[320px] rounded-lg p-4 ${getDayCardClass(dayIndex)}`}
                                >
                                    {/* Day Header */}
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="inline-block px-3 py-1 rounded bg-white/20 text-sm">
                                            Day {day.day}
                                        </span>
                                        {days.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeDay(dayIndex)}
                                                className="text-xs hover:text-red-400"
                                            >
                                                <i className="fi fi-rr-cross" />
                                            </button>
                                        )}
                                    </div>

                                    {/* Activities */}
                                    {day.activities.map((activity, actIndex) => (
                                        <div
                                            key={actIndex}
                                            className="bg-white/10 rounded-lg p-3 mb-3"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <input
                                                    type="text"
                                                    value={activity.title}
                                                    onChange={(e) =>
                                                        handleActivityChange(dayIndex, actIndex, e.target.value)
                                                    }
                                                    placeholder="Activity name"
                                                    className="bg-transparent border-none outline-none w-full text-sm text-[color:var(--color-text-primary)] placeholder:text-[color:var(--color-text-muted)]"
                                                />
                                                {day.activities.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeActivity(dayIndex, actIndex)}
                                                        className="text-xs ml-2 hover:text-red-400"
                                                    >
                                                        <i className="fi fi-rr-cross" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    {/* Add Activity Button */}
                                    <button
                                        type="button"
                                        onClick={() => addActivity(dayIndex)}
                                        className="w-full py-2 text-sm text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)] border border-dashed border-white/30 rounded-lg hover:border-white/50 transition-colors"
                                    >
                                        + New activity
                                    </button>
                                </div>
                            ))}

                            {/* Add Day Card */}
                            <div
                                onClick={addDay}
                                className="flex-shrink-0 w-[200px] h-[320px] rounded-lg border border-dashed border-gray-400 flex items-center justify-center cursor-pointer hover:bg-white/5 transition-colors"
                            >
                                <span className="text-[color:var(--color-text-secondary)]">+ New Day</span>
                            </div>
                        </div>
                    </section>

                    {/* Submit Button */}
                    <div className="mt-8 flex justify-end">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-8 py-3 bg-[color:var(--color-primary-blue)] hover:bg-[color:var(--color-primary-blue-light)] text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                        >
                            {isSubmitting ? "Creating..." : "Create Itinerary"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
