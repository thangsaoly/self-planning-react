import { useState, useEffect } from "react";
import TripCover from "./TripDetails/TripCover";
import TripMetaSection from "./TripDetails/TripMetaSection";
import ItinerarySection from "./TripDetails/ItinerarySection";
import BookingSection from "./TripDetails/BookingSection";
import TransportSection from "./TripDetails/TransportSection";
import GoogleMapsSection from "./TripDetails/GoogleMapsSection";
import TodoSection from "./TripDetails/TodoSection";
import HighlightsSection from "./TripDetails/HighlightsSection";
import PackingSection from "./TripDetails/PackingSection";
import CostsSection from "./TripDetails/CostsSection";

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

// Anchor TOC entries — key matches trip-section-{key} wrapper ids in the main column
const tocEntries = [
    { key: "itinerary", label: "Itinerary" },
    { key: "booking", label: "Booking" },
    { key: "transport", label: "Transport" },
    { key: "map", label: "Map" },
    { key: "todo", label: "To Do's" },
    { key: "highlights", label: "Highlights" },
    { key: "packing", label: "Packing" },
    { key: "costs", label: "Costs" },
];

// Default data structure for a new trip
const getDefaultTripData = () => ({
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

export default function TripDetailModal({ isOpen, onClose, trip, section, onUpdate, onPartialUpdate, onDelete }) {
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
        costs: true,
        itinerary: true,
        todo: true,
    });

    const toggleSection = (section) => setExpanded(prev => ({ ...prev, [section]: !prev[section] }));

    // Initialize form with trip data when modal opens
    useEffect(() => {
        if (trip && isOpen) {
            const defaults = getDefaultTripData();

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

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

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
            onPartialUpdate(trip.id, section, { itinerary: newDays });
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
                onPartialUpdate(trip.id, section, { todos: newTodos });
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
                onPartialUpdate(trip.id, section, { packing: newPacking });
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
        setCosts((prev) => prev.map((c, i) => {
            if (i !== index) return c;
            if (field !== "amount") return { ...c, [field]: value };
            // Non-negative amounts only: clamp to 0 (empty/invalid also -> 0)
            return { ...c, amount: Math.max(0, parseFloat(value) || 0) };
        }));
    };

    const removeCost = (index) => {
        setCosts((prev) => prev.filter((_, i) => i !== index));
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

    if (!isOpen || !trip) return null;

    return (
        <div
            className="fixed inset-0 z-[150] flex items-center justify-center bg-black/70"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="relative w-full h-full bg-(--color-bg-primary) overflow-y-auto animate-scale-up">
                {/* Sticky slim toolbar (lives inside the scroller) */}
                <div className="sticky top-0 z-[110] flex items-center gap-3 px-4 py-2 bg-[rgba(25,25,25,0.85)] backdrop-blur-md border-b border-(--color-border-secondary)">
                    {/* Glass-circle close */}
                    <button
                        onClick={onClose}
                        aria-label="Close trip details"
                        className="rounded-full w-8 h-8 flex items-center justify-center bg-black/40 hover:bg-black/60 ring-1 ring-white/20 backdrop-blur transition-colors"
                    >
                        <i className="fi fi-rr-cross text-white text-sm" />
                    </button>
                    {/* Emoji chip + truncated name */}
                    <span className="text-lg" aria-hidden="true">{trip.emoji || "✈️"}</span>
                    <span className="max-w-[200px] truncate text-(--color-text-primary) font-medium text-sm">
                        {formData.name || trip.name}
                    </span>
                    <div className="flex-1" />
                    {/* Action buttons — migrated verbatim from TripCover, restyled compact */}
                    {showDeleteConfirm ? (
                        <div className="flex items-center gap-2 bg-red-600 p-1.5 rounded-lg animate-fade-in">
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
                                className="px-3 py-1.5 text-sm bg-(--color-primary-blue) hover:bg-(--color-primary-blue-light) text-white rounded-lg transition-colors flex items-center gap-2"
                            >
                                <i className="fi fi-rr-pencil" />
                                Edit
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-3 py-1.5 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2"
                            >
                                <i className="fi fi-rr-trash" />
                                Delete
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-3 py-1.5 text-sm bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="px-3 py-1.5 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
                            >
                                {isSaving ? "Saving..." : "Save Changes"}
                            </button>
                        </>
                    )}
                </div>

                {/* Hero / Cover — presentation only */}
                <TripCover
                    trip={trip}
                    formData={formData}
                    travelTypeEmojis={travelTypeEmojis}
                />

                {/* Main Content + anchor TOC */}
                <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_200px] xl:gap-8">
                <main className="relative mt-10 w-[90%] mx-auto pb-10">
                    {/* Title & Metadata */}
                    <TripMetaSection
                        formData={formData}
                        isEditing={isEditing}
                        handleInputChange={handleInputChange}
                        travelStatusOptions={travelStatusOptions}
                        travelTypeOptions={travelTypeOptions}
                    />

                    <hr className="border-t border-(--color-border-secondary) my-4" />

                    {/* Itinerary */}
                    <div id="trip-section-itinerary" className="scroll-mt-24">
                    <ItinerarySection
                        days={days}
                        isEditing={isEditing}
                        expanded={expanded.itinerary}
                        onToggle={() => toggleSection('itinerary')}
                        onActivityChange={handleActivityChange}
                        onToggleActivity={toggleActivityDone}
                        onAddActivity={addActivity}
                        onRemoveActivity={removeActivity}
                        onAddDay={addDay}
                        onRemoveDay={removeDay}
                    />
                    </div>

                    {/* Grid Section for other details */}
                    <div className="grid-section grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Booking Details */}
                        <div id="trip-section-booking" className="scroll-mt-24">
                        <BookingSection
                            booking={booking}
                            isEditing={isEditing}
                            expanded={expanded.booking}
                            onToggle={() => toggleSection('booking')}
                            onChange={setBooking}
                        />
                        </div>

                        {/* Transport Details */}
                        <div id="trip-section-transport" className="scroll-mt-24">
                        <TransportSection
                            transport={transport}
                            isEditing={isEditing}
                            expanded={expanded.transport}
                            onToggle={() => toggleSection('transport')}
                            onAdd={addTransport}
                            onUpdate={updateTransport}
                            onRemove={removeTransport}
                        />
                        </div>

                        {/* Google Maps */}
                        <div id="trip-section-map" className="scroll-mt-24">
                        <GoogleMapsSection
                            googleMapsLink={googleMapsLink}
                            isEditing={isEditing}
                            expanded={expanded.map}
                            onToggle={() => toggleSection('map')}
                            onChange={setGoogleMapsLink}
                        />
                        </div>

                        {/* To Do's */}
                        <div id="trip-section-todo" className="scroll-mt-24">
                        <TodoSection
                            todos={todos}
                            todoNote={todoNote}
                            isEditing={isEditing}
                            expanded={expanded.todo}
                            onToggle={() => toggleSection('todo')}
                            onToggleItem={toggleTodo}
                            onAdd={addTodo}
                            onUpdate={updateTodo}
                            onRemove={removeTodo}
                            onNoteChange={setTodoNote}
                        />
                        </div>

                        {/* Travel Highlights */}
                        <div id="trip-section-highlights" className="scroll-mt-24">
                        <HighlightsSection
                            highlights={highlights}
                            highlightNote={highlightNote}
                            isEditing={isEditing}
                            expanded={expanded.highlights}
                            onToggle={() => toggleSection('highlights')}
                            onAdd={addHighlight}
                            onUpdate={updateHighlight}
                            onRemove={removeHighlight}
                            onNoteChange={setHighlightNote}
                        />
                        </div>

                        {/* Packing List */}
                        <div id="trip-section-packing" className="scroll-mt-24">
                        <PackingSection
                            packing={packing}
                            packingNote={packingNote}
                            isEditing={isEditing}
                            expanded={expanded.packing}
                            onToggle={() => toggleSection('packing')}
                            onAdd={addPackingItem}
                            onUpdate={updatePackingItem}
                            onRemove={removePackingItem}
                            onToggleItem={togglePacking}
                            onNoteChange={setPackingNote}
                        />
                        </div>

                        {/* Travel Costs */}
                        <div id="trip-section-costs" className="scroll-mt-24">
                        <CostsSection
                            costs={costs}
                            costNote={costNote}
                            isEditing={isEditing}
                            expanded={expanded.costs}
                            onToggle={() => toggleSection('costs')}
                            onAdd={addCost}
                            onUpdate={updateCost}
                            onRemove={removeCost}
                            onNoteChange={setCostNote}
                        />
                        </div>
                    </div>
                </main>

                {/* Anchor TOC — xl only, plain hrefs, zero JS */}
                <aside className="hidden xl:block">
                    <nav aria-label="Trip sections" className="sticky top-16 self-start py-10 pl-2">
                        <p className="text-xs font-medium text-(--color-text-muted) mb-2">On this page</p>
                        {tocEntries.map((entry) => (
                            <a
                                key={entry.key}
                                href={`#trip-section-${entry.key}`}
                                className="block py-1 text-sm text-(--color-text-secondary) hover:text-(--color-primary-blue) transition-colors"
                            >
                                {entry.label}
                            </a>
                        ))}
                    </nav>
                </aside>
                </div>
            </div>
        </div>
    );
}
