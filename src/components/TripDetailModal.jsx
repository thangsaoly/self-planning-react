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
        setCosts((prev) => prev.map((c, i) => (i === index ? { ...c, [field]: field === "amount" ? parseFloat(value) || 0 : value } : c)));
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
            <div className="relative w-full h-full bg-[color:var(--color-bg-primary)] overflow-y-auto">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="fixed top-0 right-0 z-50 px-2 py-1 bg-red-600 hover:bg-red-800 rounded-bl-lg transition-colors animate-fade-in"
                >
                    <i className="fi fi-rr-cross text-white text-sm" />
                </button>

                {/* Hero / Cover */}
                <TripCover
                    trip={trip}
                    formData={formData}
                    travelTypeEmojis={travelTypeEmojis}
                    isEditing={isEditing}
                    isSaving={isSaving}
                    showDeleteConfirm={showDeleteConfirm}
                    setShowDeleteConfirm={setShowDeleteConfirm}
                    setIsEditing={setIsEditing}
                    handleSave={handleSave}
                    handleDelete={handleDelete}
                    confirmDelete={confirmDelete}
                />

                {/* Main Content */}
                <main className="relative mt-10 w-[90%] mx-auto pb-10">
                    {/* Title & Metadata */}
                    <TripMetaSection
                        formData={formData}
                        isEditing={isEditing}
                        handleInputChange={handleInputChange}
                        travelStatusOptions={travelStatusOptions}
                        travelTypeOptions={travelTypeOptions}
                    />

                    <hr className="border-t border-[color:var(--color-border-secondary)] my-4" />

                    {/* Itinerary */}
                    <ItinerarySection
                        days={days}
                        isEditing={isEditing}
                        onActivityChange={handleActivityChange}
                        onToggleActivity={toggleActivityDone}
                        onAddActivity={addActivity}
                        onRemoveActivity={removeActivity}
                        onAddDay={addDay}
                        onRemoveDay={removeDay}
                    />

                    {/* Grid Section for other details */}
                    <div className="grid-section grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Booking Details */}
                        <BookingSection
                            booking={booking}
                            isEditing={isEditing}
                            expanded={expanded.booking}
                            onToggle={() => toggleSection('booking')}
                            onChange={setBooking}
                        />

                        {/* Transport Details */}
                        <TransportSection
                            transport={transport}
                            isEditing={isEditing}
                            expanded={expanded.transport}
                            onToggle={() => toggleSection('transport')}
                            onAdd={addTransport}
                            onUpdate={updateTransport}
                            onRemove={removeTransport}
                        />

                        {/* Google Maps */}
                        <GoogleMapsSection
                            googleMapsLink={googleMapsLink}
                            isEditing={isEditing}
                            expanded={expanded.map}
                            onToggle={() => toggleSection('map')}
                            onChange={setGoogleMapsLink}
                        />

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

                        {/* Packing List */}
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

                        {/* Travel Costs */}
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
                </main>
            </div>
        </div>
    );
}
