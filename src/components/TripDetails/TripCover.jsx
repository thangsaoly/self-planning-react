export default function TripCover({ trip, formData, travelTypeEmojis }) {
    return (
        <div className="w-full h-[260px] relative overflow-visible">
            <img
                src={formData.image || trip.image}
                alt={formData.name}
                className="w-full h-full object-cover"
            />
            {/* Legibility veil (foundation class .scrim-cover) */}
            <div className="scrim-cover absolute inset-0 pointer-events-none" />
            {/* Notion page-icon motif: circular emoji tile overlapping the cover bottom-left */}
            <div className="absolute -bottom-8 left-[5%] z-20 w-16 h-16 rounded-full flex items-center justify-center text-4xl bg-(--color-bg-secondary) ring-1 ring-white/15">
                {travelTypeEmojis[formData.travelType] || trip.emoji || "🏛️"}
            </div>
        </div>
    );
}
