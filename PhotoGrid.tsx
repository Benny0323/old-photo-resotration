import { useState } from 'react';
import { HistoricalPhoto } from '@/lib/photoData';
import { ChevronRight } from 'lucide-react';

interface PhotoGridProps {
  photos: HistoricalPhoto[];
  onPhotoClick: (photo: HistoricalPhoto) => void;
}

interface PhotoCardProps {
  photo: HistoricalPhoto;
  index: number;
  onPhotoClick: (photo: HistoricalPhoto) => void;
}

function PhotoCard({ photo, index, onPhotoClick }: PhotoCardProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div
      className="group cursor-pointer"
      onClick={() => onPhotoClick(photo)}
      style={{
        animation: `fadeInUp 0.5s ease-out ${index * 0.05}s both`,
      }}
    >
      {/* Photo Card */}
      <div className="photo-card overflow-hidden flex flex-col transition-all duration-300 h-full">
        {/* Image Container */}
        <div className="relative bg-secondary overflow-hidden flex-1 min-h-64">
          {/* Loading skeleton */}
          {!isLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/50 to-secondary animate-pulse" />
          )}

          {/* Image - always rendered with native lazy loading */}
          <img
            src={photo.imageUrl}
            alt={photo.title}
            loading="lazy"
            decoding="async"
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setIsLoaded(true)}
            onError={() => setIsLoaded(true)}
          />

          {/* Overlay on Hover */}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end justify-between p-4 transition-opacity duration-300 ${
              hoveredId === photo.id ? 'opacity-100' : 'opacity-0'
            }`}
            onMouseEnter={() => setHoveredId(photo.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div className="flex-1">
              <p className="text-accent text-xs font-semibold mb-1 uppercase tracking-wider">
                {photo.category}
              </p>
              <p className="text-foreground text-sm line-clamp-2 font-medium">
                {photo.title}
              </p>
            </div>
            <ChevronRight className="text-accent ml-2 flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1" size={20} />
          </div>
        </div>

        {/* Card Footer */}
        <div className="p-4 border-t border-border/50 bg-secondary/50">
          <h3 className="text-foreground font-semibold text-sm mb-2 line-clamp-2 leading-tight">
            {photo.title}
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-xs">{photo.period}</span>
            <span className="text-accent text-xs font-medium px-2 py-1 bg-accent/10 rounded">
              {photo.category}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PhotoGrid({ photos, onPhotoClick }: PhotoGridProps) {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {photos.map((photo, index) => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            index={index}
            onPhotoClick={onPhotoClick}
          />
        ))}
      </div>

      {/* Animation keyframes */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
