export default function TripCover({
    trip,
    formData,
    travelTypeEmojis,
    isEditing,
    isSaving,
    showDeleteConfirm,
    setShowDeleteConfirm,
    setIsEditing,
    handleSave,
    handleDelete,
    confirmDelete
}) {
    return (
        <div className="w-full h-[260px] relative">
            <img
                src={formData.image || trip.image}
                alt={formData.name}
                className="w-full h-full object-cover"
            />
            {/* Emoji icon overlay */}
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
    );
}
