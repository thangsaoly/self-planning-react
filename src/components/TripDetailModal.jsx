import { useState, useEffect } from "react";
import TodoSection from "./TripDetails/TodoSection";

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
    Citytrip: "🌆",
    Roadtrip: "🚗",
    Beach: "🏝️",
    Festival: "🎪",
    Camping: "🏕️",
    Hiking: "⛰️",
};

// Default data structure for a new trip
const getDefaultTripData = (tripName) => ({
    booking: {
        departure: "Departure Airport - Date TBD",
        arrival: "Arrival Airport - Date TBD",
    },
    transport: [
        { text: "Rental Car: TBD" },
    ],
    googleMapsLink: "",
    todos: [
        { task: "Book flights", isDone: false },
        { task: "Book accommodations", isDone: false },
        { task: "Research activities", isDone: false },
    ],
    highlights: [
        "Main attraction 1",
        "Local experience",
        "Must-try food",
    ],
    packing: [
        { item: "Passport & documents", isPacked: false },
        { item: "Clothes", isPacked: false },
        { item: "Camera & charger", isPacked: false },
    ],
    costs: [
        { name: "Plane Tickets", amount: 0 },
        { name: "Accommodation", amount: 0 },
        { name: "Transport", amount: 0 },
        { name: "Food Budget", amount: 0 },
        { name: "Activities", amount: 0 },
    ],
});

export default function TripDetailModal({ isOpen, onClose, trip, section, onUpdate, onDelete }) {
    const [formData, setFormData] = useState({
        name: "",
        image: "",
        startDate: "",
        endDate: "",
        travelStatus: "visiting",
        travelType: "",
    });

    const [days, setDays] = useState([
        { day: 1, activities: [{ title: "Visit destination", isDone: false }] },
    ]);

    // Extended trip data
    const [booking, setBooking] = useState({ departure: "", arrival: "" });
    const [transport, setTransport] = useState([{ text: "" }]);
    const [googleMapsLink, setGoogleMapsLink] = useState("");
    const [todos, setTodos] = useState([]);
    const [todoNote, setTodoNote] = useState("");
    const [highlights, setHighlights] = useState([]);
    const [highlightNote, setHighlightNote] = useState("");
    const [packing, setPacking] = useState([]);
    const [packingNote, setPackingNote] = useState("");
    const [costs, setCosts] = useState([]);
    const [costNote, setCostNote] = useState("");

    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const [expanded, setExpanded] = useState({
        booking: true,
        transport: true,
        map: true,
        highlights: true,
        packing: true,
        costs: true
    });

    const toggleSection = (section) => setExpanded(prev => ({ ...prev, [section]: !prev[section] }));

    // Initialize form with trip data when modal opens
    useEffect(() => {
        if (trip && isOpen) {
            const defaults = getDefaultTripData(trip.name);

            setFormData({
                name: trip.name || "",
                image: trip.image || "",
                startDate: trip.startDate || "",
                endDate: trip.endDate || "",
                travelStatus: section || "visiting",
                travelType: trip.typeClass || trip.type || "",
            });

            if (trip.itinerary && trip.itinerary.length > 0) {
                setDays(trip.itinerary);
            } else {
                setDays([{ day: 1, activities: [{ title: "Explore " + (trip.name || "destination"), isDone: false }] }]);
            }

            // Load extended data or use defaults
            setBooking(trip.booking || defaults.booking);
            setTransport(trip.transport || defaults.transport);
            setGoogleMapsLink(trip.googleMapsLink || "");
            setTodos(trip.todos || defaults.todos);
            setTodoNote(trip.todoNote || "");
            setHighlights(trip.highlights || defaults.highlights);
            setHighlightNote(trip.highlightNote || "");
            setPacking(trip.packing || defaults.packing);
            setPackingNote(trip.packingNote || "");
            setCosts(trip.costs || defaults.costs);
            setCostNote(trip.costNote || "");

            setIsEditing(false);
        }
    }, [trip, section, isOpen]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Itinerary handlers
    const handleActivityChange = (dayIndex, activityIndex, value) => {
        setDays((prev) => {
            const newDays = [...prev];
            newDays[dayIndex].activities[activityIndex].title = value;
            return newDays;
        });
    };

    const toggleActivityDone = (dayIndex, activityIndex) => {
        const newDays = days.map((day, dIdx) => {
            if (dIdx !== dayIndex) return day;
            return {
                ...day,
                activities: day.activities.map((activity, aIdx) => {
                    if (aIdx !== activityIndex) return activity;
                    return { ...activity, isDone: !activity.isDone };
                }),
            };
        });

        setDays(newDays);

        // Auto-save when toggling in view mode
        if (!isEditing) {
            const updatedTrip = {
                ...trip,
                itinerary: newDays,
            };
            onUpdate(updatedTrip, section, section);
        }
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
        setDays((prev) => [...prev, { day: prev.length + 1, activities: [{ title: "", isDone: false }] }]);
    };

    const removeDay = (dayIndex) => {
        if (days.length <= 1) return;
        setDays((prev) => prev.filter((_, i) => i !== dayIndex).map((day, i) => ({ ...day, day: i + 1 })));
    };

    // Todo handlers
    const toggleTodo = (index) => {
        setTodos((prev) => {
            const newTodos = prev.map((t, i) => (i === index ? { ...t, isDone: !t.isDone } : t));

            // Auto-save when toggling in view mode
            if (!isEditing) {
                const updatedTrip = {
                    ...trip,
                    todos: newTodos,
                };
                onUpdate(updatedTrip, section, section);
            }

            return newTodos;
        });
    };

    const addTodo = () => {
        setTodos((prev) => [...prev, { task: "", isDone: false }]);
    };

    const updateTodo = (index, value) => {
        setTodos((prev) => prev.map((t, i) => (i === index ? { ...t, task: value } : t)));
    };

    const removeTodo = (index) => {
        setTodos((prev) => prev.filter((_, i) => i !== index));
    };

    // Highlight handlers
    const addHighlight = () => {
        setHighlights((prev) => [...prev, ""]);
    };

    const updateHighlight = (index, value) => {
        setHighlights((prev) => prev.map((h, i) => (i === index ? value : h)));
    };

    const removeHighlight = (index) => {
        setHighlights((prev) => prev.filter((_, i) => i !== index));
    };

    // Packing handlers
    const togglePacking = (index) => {
        setPacking((prev) => {
            const newPacking = prev.map((p, i) => (i === index ? { ...p, isPacked: !p.isPacked } : p));

            // Auto-save when toggling in view mode
            if (!isEditing) {
                const updatedTrip = {
                    ...trip,
                    packing: newPacking,
                };
                onUpdate(updatedTrip, section, section);
            }

            return newPacking;
        });
    };

    const addPackingItem = () => {
        setPacking((prev) => [...prev, { item: "", isPacked: false }]);
    };

    const updatePackingItem = (index, value) => {
        setPacking((prev) => prev.map((p, i) => (i === index ? { ...p, item: value } : p)));
    };

    const removePackingItem = (index) => {
        setPacking((prev) => prev.filter((_, i) => i !== index));
    };

    // Cost handlers
    const addCost = () => {
        setCosts((prev) => [...prev, { name: "", amount: 0 }]);
    };

    const updateCost = (index, field, value) => {
        setCosts((prev) => prev.map((c, i) => (i === index ? { ...c, [field]: field === "amount" ? parseFloat(value) || 0 : value } : c)));
    };

    const removeCost = (index) => {
        setCosts((prev) => prev.filter((_, i) => i !== index));
    };

    const calculateTotal = () => {
        return costs.reduce((sum, c) => sum + (c.amount || 0), 0);
    };

    const renderBudgetChart = () => {
        const total = calculateTotal();
        if (costs.length === 0) return null;

        const colors = [
            "var(--color-primary-blue)", 
            "#4ade80", 
            "#f472b6", 
            "#fbbf24", 
            "#a78bfa", 
            "#f87171", 
            "#2dd4bf"
        ];
        
        return (
            <div className="flex flex-col gap-3 mb-4 p-4 bg-[color:var(--color-bg-primary)] rounded-lg border border-[color:var(--color-border-secondary)]">
                <h3 className="text-sm font-medium text-[color:var(--color-text-secondary)]">Budget Distribution</h3>
                
                {/* Horizontal Stacked Bar */}
                <div className="w-full h-3 rounded-full flex overflow-hidden bg-[color:var(--color-bg-secondary)]">
                    {total > 0 ? costs.map((c, i) => {
                        const width = (c.amount / total) * 100;
                        if (width === 0) return null;
                        return (
                            <div 
                                key={i} 
                                style={{ width: `${width}%`, backgroundColor: colors[i % colors.length] }} 
                                title={`${c.name}: $${c.amount}`}
                            />
                        );
                    }) : (
                        <div className="w-full h-full bg-white/10" title="Add costs to see distribution" />
                    )}
                </div>
                
                {/* Legend */}
                {total > 0 ? (
                    <div className="flex flex-wrap gap-x-4 gap-y-2 mt-1">
                        {costs.map((c, i) => {
                            if (c.amount === 0) return null;
                            return (
                                <div key={i} className="flex items-center gap-1.5 text-xs">
                                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors[i % colors.length] }} />
                                    <span className="text-[color:var(--color-text-secondary)]">{c.name}</span>
                                    <span className="font-medium text-[color:var(--color-text-primary)]">{Math.round((c.amount/total)*100)}%</span>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <span className="text-xs text-[color:var(--color-text-muted)] mt-1">Enter costs in edit mode to see budget distribution</span>
                )}
            </div>
        );
    };

    // Transport handlers
    const addTransport = () => {
        setTransport((prev) => [...prev, { text: "" }]);
    };

    const updateTransport = (index, value) => {
        setTransport((prev) => prev.map((t, i) => (i === index ? { text: value } : t)));
    };

    const removeTransport = (index) => {
        setTransport((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSave = () => {
        setIsSaving(true);

        const updatedTrip = {
            ...trip,
            name: formData.name,
            emoji: travelTypeEmojis[formData.travelType] || trip.emoji || "✈️",
            type: formData.travelType,
            typeClass: formData.travelType,
            image: formData.image,
            startDate: formData.startDate,
            endDate: formData.endDate,
            itinerary: days,
            booking,
            transport,
            googleMapsLink,
            todos,
            todoNote,
            highlights,
            highlightNote,
            packing,
            packingNote,
            costs,
            costNote,
        };

        setTimeout(() => {
            onUpdate(updatedTrip, section, formData.travelStatus);
            setIsSaving(false);
            setIsEditing(false);
            onClose();
        }, 500);
    };

    const handleDelete = () => {
        setShowDeleteConfirm(true);
    };

    const confirmDelete = () => {
        onDelete(trip, section);
        setShowDeleteConfirm(false);
        onClose();
    };

    const getDayCardClass = (index) => {
        const themes = [
            "bg-[color:var(--color-planner-day1-bg)]",
            "bg-[color:var(--color-planner-day2-bg)]",
            "bg-[color:var(--color-planner-day3-bg)]",
        ];
        return themes[index % 3];
    };

    if (!isOpen || !trip) return null;

    const inputClasses = "w-full px-3 py-2 rounded bg-[color:var(--color-bg-secondary)] border-none text-[color:var(--color-text-primary)] outline-none placeholder:text-[color:var(--color-text-muted)]";
    const calloutClasses = "w-full px-3 py-2 rounded bg-[color:var(--color-callout-bg)] border border-[color:var(--color-callout-border)] text-[color:var(--color-text-primary)] outline-none placeholder:text-[color:var(--color-text-muted)] text-sm";

    return (
        <div
            className="fixed inset-0 z-[150] flex items-center justify-center bg-black/70"
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
                <div className="w-full h-[260px] relative">
                    <img
                        src={formData.image || trip.image}
                        alt={formData.name}
                        className="w-full h-full object-cover"
                    />
                    {/* Emoji icon overlay - fixed position from left edge */}
                    <div className="absolute -bottom-8 left-[5%] text-6xl z-20">
                        {travelTypeEmojis[formData.travelType] || trip.emoji || "🏛️"}
                    </div>
                    {/* Edit/Delete buttons overlay */}
                    <div className="absolute bottom-4 right-4 flex gap-2">
                        {showDeleteConfirm ? (
                            <div className="flex items-center gap-2 bg-red-600 p-1.5 rounded-lg shadow-lg animate-fade-in">
                                <span className="text-white text-sm font-medium px-2">Delete?</span>
                                <button
                                    onClick={confirmDelete}
                                    className="px-3 py-1 bg-white text-red-600 hover:bg-red-50 rounded font-medium transition-colors text-sm"
                                >
                                    Yes
                                </button>
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="px-3 py-1 bg-red-700 text-white hover:bg-red-800 rounded font-medium transition-colors text-sm"
                                >
                                    No
                                </button>
                            </div>
                        ) : !isEditing ? (
                            <>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-4 py-2 bg-[color:var(--color-primary-blue)] hover:bg-[color:var(--color-primary-blue-light)] text-white rounded-lg transition-colors flex items-center gap-2 shadow-md"
                                >
                                    <i className="fi fi-rr-pencil" />
                                    Edit
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2 shadow-md"
                                >
                                    <i className="fi fi-rr-trash" />
                                    Delete
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors shadow-md"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 shadow-md"
                                >
                                    {isSaving ? "Saving..." : "Save Changes"}
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Main Content */}
                <main className="relative mt-10 w-[90%] mx-auto pb-10">
                    {/* Title Section */}
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
                        <hr className="border-t border-[color:var(--color-border-secondary)] mt-4 hidden" />

                        {/* Meta Info */}
                        <div className="meta-info flex flex-col gap-3 ml-6">
                            {/* Travel Date */}
                            <div className="meta-item flex items-center gap-3 text-sm">
                                <img src="https://cdn-icons-png.flaticon.com/128/3652/3652267.png" alt="calendar" className="w-8 h-8" />
                                <span className="font-medium w-28">Travel Date</span>
                                {isEditing ? (
                                    <div className="flex flex-wrap items-center gap-2">
                                        <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} className={inputClasses + " w-auto"} />
                                        <span className="text-[color:var(--color-text-muted)]">-</span>
                                        <input type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} className={inputClasses + " w-auto"} />
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
                                <span className="font-medium w-28">Travel Status</span>
                                {isEditing ? (
                                    <select name="travelStatus" value={formData.travelStatus} onChange={handleInputChange} className={inputClasses + " w-40"}>
                                        {travelStatusOptions.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                                    </select>
                                ) : (
                                    <span className="text-[color:var(--color-text-muted)] capitalize">{formData.travelStatus}</span>
                                )}
                            </div>

                            {/* Travel Type */}
                            <div className="meta-item flex items-center gap-3 text-sm">
                                <img src="https://cdn-icons-png.flaticon.com/128/3308/3308315.png" alt="type" className="w-8 h-8" />
                                <span className="font-medium w-28">Travel Type</span>
                                {isEditing ? (
                                    <select name="travelType" value={formData.travelType} onChange={handleInputChange} className={inputClasses + " w-40"}>
                                        <option value="" disabled>Select type</option>
                                        {travelTypeOptions.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                                    </select>
                                ) : (
                                    <span className="text-[color:var(--color-text-muted)]">{formData.travelType || "Not set"}</span>
                                )}
                            </div>

                            {/* Image URL (editing only) */}
                            {isEditing && (
                                <div className="meta-item flex items-center gap-3 text-sm">
                                    <img src="https://cdn-icons-png.flaticon.com/128/1375/1375106.png" alt="image" className="w-8 h-8" />
                                    <span className="font-medium w-28">Image URL</span>
                                    <input type="url" name="image" value={formData.image} onChange={handleInputChange} placeholder="https://example.com/image.jpg" className={inputClasses + " flex-1 max-w-md"} />
                                </div>
                            )}
                        </div>
                    </section>

                    <hr className="border-t border-[color:var(--color-border-secondary)] my-4" />

                    {/* Itinerary Section */}
                    <section className="mb-8">
                        <h2 className="section-header flex items-center gap-2 text-xl font-medium mb-4">🛣️ Itinerary</h2>
                        <hr className="border-t border-[color:var(--color-border-secondary)] my-4" />

                        <div className="itinerary-grid flex gap-4 overflow-x-auto pb-4 rounded-lg">
                            {days.map((day, dayIndex) => (
                                <div key={dayIndex} className={`day-card flex-shrink-0 w-[200px] min-h-[320px] rounded-lg p-4 ${getDayCardClass(dayIndex)}`}>
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="day-badge inline-block px-3 py-1 rounded bg-white/20 text-sm">Day {day.day}</span>
                                        {isEditing && days.length > 1 && (
                                            <button onClick={() => removeDay(dayIndex)} className="text-xs hover:text-red-400"><i className="fi fi-rr-cross" /></button>
                                        )}
                                    </div>

                                    {day.activities.map((activity, actIndex) => (
                                        <div key={actIndex} className="activity-card bg-white/10 rounded-lg p-3 mb-3">
                                            <div className="activity-header flex justify-between items-start mb-2">
                                                {isEditing ? (
                                                    <input type="text" value={activity.title} onChange={(e) => handleActivityChange(dayIndex, actIndex, e.target.value)} placeholder="Activity" className="bg-transparent border-none outline-none w-full text-sm" />
                                                ) : (
                                                    <span className={`activity-title text-sm transition-all duration-300 ${activity.isDone ? "line-through opacity-60 text-[color:var(--color-text-muted)]" : ""}`}>{activity.title}</span>
                                                )}
                                                {isEditing && day.activities.length > 1 && (
                                                    <button onClick={() => removeActivity(dayIndex, actIndex)} className="text-xs ml-2 hover:text-red-400"><i className="fi fi-rr-cross" /></button>
                                                )}
                                            </div>
                                            <label className="checkbox-label flex items-center gap-2 cursor-pointer">
                                                <input type="checkbox" checked={activity.isDone} onChange={() => toggleActivityDone(dayIndex, actIndex)} className="w-4 h-4 rounded accent-[color:var(--color-primary-blue)]" />
                                                <span className="text-xs text-[color:var(--color-text-secondary)]">Done</span>
                                            </label>
                                        </div>
                                    ))}

                                    {isEditing && (
                                        <button onClick={() => addActivity(dayIndex)} className="new-page-btn w-full py-2 text-sm border border-dashed border-white/30 rounded-lg hover:border-white/50">+ New activity</button>
                                    )}
                                </div>
                            ))}

                            {isEditing && (
                                <div onClick={addDay} className="newDay flex-shrink-0 w-[200px] h-[320px] rounded-lg border border-dashed border-gray-400 flex items-center justify-center cursor-pointer hover:bg-white/5">
                                    <span className="text-[color:var(--color-text-secondary)]">+ New Day</span>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Grid Section for other details */}
                    <div className="grid-section grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Booking Details */}
                        <section className="info-section booking bg-[color:var(--color-bg-secondary)] rounded-lg p-4 transition-all">
                            <div className="flex justify-between items-center cursor-pointer select-none" onClick={() => toggleSection('booking')}>
                                <h2 className="section-header flex items-center gap-2 text-lg font-medium">✈️ Booking Details</h2>
                                <i className={`fi fi-rr-angle-small-${expanded.booking ? 'up' : 'down'} text-xl transition-transform`} />
                            </div>
                            
                            {expanded.booking && (
                                <div className="mt-4 animate-fade-in flex flex-col gap-3">
                                    <hr className="border-t border-[color:var(--color-border-secondary)] mb-3" />

                            <div className="info-callout bg-[color:var(--color-callout-bg)] rounded-lg p-3 mb-2">
                                {isEditing ? (
                                    <input type="text" value={booking.departure} onChange={(e) => setBooking({ ...booking, departure: e.target.value })} placeholder="🛫 Departure details" className={calloutClasses} />
                                ) : (
                                    <div className="text-sm">🛫 {booking.departure || "Departure: Not set"}</div>
                                )}
                            </div>
                            <div className="info-callout bg-[color:var(--color-callout-bg)] rounded-lg p-3">
                                {isEditing ? (
                                    <input type="text" value={booking.arrival} onChange={(e) => setBooking({ ...booking, arrival: e.target.value })} placeholder="🛬 Arrival details" className={calloutClasses} />
                                ) : (
                                    <div className="text-sm">🛬 {booking.arrival || "Arrival: Not set"}</div>
                                )}
                            </div>
                                </div>
                            )}
                        </section>

                        {/* Transport Details */}
                        <section className="info-section transport bg-[color:var(--color-bg-secondary)] rounded-lg p-4 transition-all">
                            <div className="flex justify-between items-center cursor-pointer select-none" onClick={() => toggleSection('transport')}>
                                <h2 className="section-header flex items-center gap-2 text-lg font-medium">🚗 Transport Details</h2>
                                <i className={`fi fi-rr-angle-small-${expanded.transport ? 'up' : 'down'} text-xl transition-transform`} />
                            </div>

                            {expanded.transport && (
                                <div className="mt-4 animate-fade-in flex flex-col gap-2">
                                    <hr className="border-t border-[color:var(--color-border-secondary)] mb-3" />

                            {transport.map((t, i) => (
                                <div key={i} className="info-callout bg-[color:var(--color-callout-bg)] rounded-lg p-3 mb-2 flex items-center gap-2">
                                    {isEditing ? (
                                        <>
                                            <input type="text" value={t.text} onChange={(e) => updateTransport(i, e.target.value)} placeholder="🚘 Transport details" className={calloutClasses + " flex-1"} />
                                            <button onClick={() => removeTransport(i)} className="text-red-400 hover:text-red-600"><i className="fi fi-rr-cross text-xs" /></button>
                                        </>
                                    ) : (
                                        <div className="text-sm">🚘 {t.text || "Not set"}</div>
                                    )}
                                </div>
                            ))}
                            {isEditing && (
                                <button onClick={addTransport} className="text-sm text-[color:var(--color-primary-blue)] hover:underline">+ Add transport</button>
                            )}
                                </div>
                            )}
                        </section>

                        {/* Google Maps */}
                        <section className="info-section googleMap bg-[color:var(--color-bg-secondary)] rounded-lg p-4 md:col-span-2 transition-all">
                            <div className="flex justify-between items-center cursor-pointer select-none" onClick={() => toggleSection('map')}>
                                <h2 className="section-header flex items-center gap-2 text-lg font-medium">🗺️ Google Maps</h2>
                                <i className={`fi fi-rr-angle-small-${expanded.map ? 'up' : 'down'} text-xl transition-transform`} />
                            </div>

                            {expanded.map && (
                                <div className="mt-4 animate-fade-in">
                                    <hr className="border-t border-[color:var(--color-border-secondary)] mb-3" />

                            <div className="info-callout bg-[color:var(--color-callout-bg)] rounded-lg p-3">
                                {isEditing ? (
                                    <input type="url" value={googleMapsLink} onChange={(e) => setGoogleMapsLink(e.target.value)} placeholder="Paste Google Maps link here..." className={calloutClasses} />
                                ) : (
                                    googleMapsLink ? (
                                        <a href={googleMapsLink} target="_blank" rel="noopener noreferrer" className="text-sm text-[color:var(--color-primary-blue)] hover:underline">📍 View route planning</a>
                                    ) : (
                                        <div className="text-sm text-[color:var(--color-text-muted)]">No map link added</div>
                                    )
                                )}
                            </div>
                                </div>
                            )}
                        </section>

                        {/* To Do's */}
                        <TodoSection
                            todos={todos}
                            todoNote={todoNote}
                            isEditing={isEditing}
                            onToggle={toggleTodo}
                            onAdd={addTodo}
                            onUpdate={updateTodo}
                            onRemove={removeTodo}
                            onNoteChange={setTodoNote}
                        />

                        {/* Travel Highlights */}
                        <section className="travel bg-[color:var(--color-bg-secondary)] rounded-lg p-4 transition-all">
                            <div className="flex justify-between items-center cursor-pointer select-none" onClick={() => toggleSection('highlights')}>
                                <h2 className="section-header flex items-center gap-2 text-lg font-medium">⭐ Travel Highlights</h2>
                                <i className={`fi fi-rr-angle-small-${expanded.highlights ? 'up' : 'down'} text-xl transition-transform`} />
                            </div>

                            {expanded.highlights && (
                                <div className="mt-4 animate-fade-in">
                                    <hr className="border-t border-[color:var(--color-border-secondary)] mb-3" />

                            {isEditing && (
                                <div className="callout-note mb-3">
                                    <input type="text" value={highlightNote} onChange={(e) => setHighlightNote(e.target.value)} placeholder="Add a note..." className={calloutClasses} />
                                </div>
                            )}
                            {highlightNote && !isEditing && (
                                <div className="callout-note bg-[color:var(--color-callout-bg)] rounded-lg p-2 mb-3 text-sm italic">{highlightNote}</div>
                            )}

                            <ul className="highlights-list">
                                {highlights.map((h, i) => (
                                    <li key={i} className="highlight-item flex items-center gap-2 py-1">
                                        <span className="bullet text-[color:var(--color-primary-blue)]">•</span>
                                        {isEditing ? (
                                            <>
                                                <input type="text" value={h} onChange={(e) => updateHighlight(i, e.target.value)} className={inputClasses + " flex-1 text-sm"} />
                                                <button onClick={() => removeHighlight(i)} className="text-red-400 hover:text-red-600"><i className="fi fi-rr-cross text-xs" /></button>
                                            </>
                                        ) : (
                                            <span className="text-sm">{h}</span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                            {isEditing && (
                                <button onClick={addHighlight} className="text-sm text-[color:var(--color-primary-blue)] hover:underline mt-2">+ Add highlight</button>
                            )}
                                </div>
                            )}
                        </section>

                        {/* Packing List */}
                        <section className="packing-list bg-[color:var(--color-bg-secondary)] rounded-lg p-4 transition-all">
                            <div className="flex justify-between items-center cursor-pointer select-none" onClick={() => toggleSection('packing')}>
                                <h2 className="section-header flex items-center gap-2 text-lg font-medium">🎒 Packing List</h2>
                                <i className={`fi fi-rr-angle-small-${expanded.packing ? 'up' : 'down'} text-xl transition-transform`} />
                            </div>

                            {expanded.packing && (
                                <div className="mt-4 animate-fade-in">
                                    <hr className="border-t border-[color:var(--color-border-secondary)] mb-3" />

                            {isEditing && (
                                <div className="callout-note mb-3">
                                    <input type="text" value={packingNote} onChange={(e) => setPackingNote(e.target.value)} placeholder="Add a note..." className={calloutClasses} />
                                </div>
                            )}
                            {packingNote && !isEditing && (
                                <div className="callout-note bg-[color:var(--color-callout-bg)] rounded-lg p-2 mb-3 text-sm italic">{packingNote}</div>
                            )}

                            {packing.map((p, i) => (
                                <div key={i} className="packing-item flex items-center gap-3 py-2 border-b border-[color:var(--color-border-secondary)] last:border-b-0">
                                    <input type="checkbox" checked={p.isPacked} onChange={() => togglePacking(i)} className="w-4 h-4 rounded accent-[color:var(--color-primary-blue)]" />
                                    {isEditing ? (
                                        <>
                                            <input type="text" value={p.item} onChange={(e) => updatePackingItem(i, e.target.value)} className={inputClasses + " flex-1 text-sm"} />
                                            <button onClick={() => removePackingItem(i)} className="text-red-400 hover:text-red-600"><i className="fi fi-rr-cross text-xs" /></button>
                                        </>
                                    ) : (
                                        <span className={`text-sm transition-all duration-300 ${p.isPacked ? "line-through opacity-60 text-[color:var(--color-text-muted)]" : ""}`}>{p.item}</span>
                                    )}
                                </div>
                            ))}
                            {isEditing && (
                                <button onClick={addPackingItem} className="text-sm text-[color:var(--color-primary-blue)] hover:underline mt-2">+ Add item</button>
                            )}
                                </div>
                            )}
                        </section>

                        {/* Travel Costs */}
                        <section className="travelCost bg-[color:var(--color-bg-secondary)] rounded-lg p-4 transition-all md:col-span-2">
                            <div className="flex justify-between items-center cursor-pointer select-none" onClick={() => toggleSection('costs')}>
                                <h2 className="section-header flex items-center gap-2 text-lg font-medium">💸 Travel Costs</h2>
                                <i className={`fi fi-rr-angle-small-${expanded.costs ? 'up' : 'down'} text-xl transition-transform`} />
                            </div>

                            {expanded.costs && (
                                <div className="mt-4 animate-fade-in">
                                    <hr className="border-t border-[color:var(--color-border-secondary)] mb-3" />

                            {isEditing && (
                                <div className="callout-note mb-3">
                                    <input type="text" value={costNote} onChange={(e) => setCostNote(e.target.value)} placeholder="Add a note..." className={calloutClasses} />
                                </div>
                            )}
                            {costNote && !isEditing && (
                                <div className="callout-note bg-[color:var(--color-callout-bg)] rounded-lg p-2 mb-3 text-sm italic">{costNote}</div>
                            )}

                            {!isEditing && renderBudgetChart()}

                            <table className="cost-table w-full text-sm">
                                <thead>
                                    <tr className="bg-[color:var(--color-table-header-bg)]">
                                        <th className="text-left p-2 rounded-tl-lg">Cost Name</th>
                                        <th className="text-right p-2 rounded-tr-lg">Amount</th>
                                        {isEditing && <th className="w-8"></th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {costs.map((c, i) => (
                                        <tr key={i} className="border-b border-[color:var(--color-table-border)]">
                                            <td className="p-2">
                                                {isEditing ? (
                                                    <input type="text" value={c.name} onChange={(e) => updateCost(i, "name", e.target.value)} className={inputClasses + " text-sm"} />
                                                ) : (
                                                    c.name
                                                )}
                                            </td>
                                            <td className="p-2 text-right">
                                                {isEditing ? (
                                                    <input type="number" value={c.amount} onChange={(e) => updateCost(i, "amount", e.target.value)} className={inputClasses + " text-sm text-right w-24"} />
                                                ) : (
                                                    `$${c.amount.toLocaleString()}`
                                                )}
                                            </td>
                                            {isEditing && (
                                                <td className="p-2">
                                                    <button onClick={() => removeCost(i)} className="text-red-400 hover:text-red-600"><i className="fi fi-rr-cross text-xs" /></button>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                    <tr className="font-bold bg-[color:var(--color-table-header-bg)]">
                                        <td className="p-2 rounded-bl-lg">Total</td>
                                        <td className="p-2 text-right text-[color:var(--color-total-highlight)] rounded-br-lg">${calculateTotal().toLocaleString()}</td>
                                        {isEditing && <td></td>}
                                    </tr>
                                </tbody>
                            </table>
                            {isEditing && (
                                <button onClick={addCost} className="text-sm text-[color:var(--color-primary-blue)] hover:underline mt-2">+ Add cost</button>
                            )}
                                </div>
                            )}
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
}
