import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
interface Photo {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  period: string;
  date?: string;
  location: string;
  category: string;
  source: string;
  restorationNotes: string;
}

interface TimelineViewProps {
  photos: any[];
  onPhotoSelect: (photo: any) => void;
}

export function TimelineView({ photos, onPhotoSelect }: TimelineViewProps) {
  const [selectedYear, setSelectedYear] = useState<string>('all');

  // Group photos by year
  const photosByYear = photos.reduce((acc, photo) => {
    const year = photo.period.split('-')[0] || 'other';
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(photo);
    return acc;
  }, {} as Record<string, Photo[]>);

  const years = Object.keys(photosByYear)
    .filter(year => year !== 'other')
    .sort()
    .concat(['other']);

  const displayPhotos = selectedYear === 'all' 
    ? photos 
    : photosByYear[selectedYear] || [];

  return (
    <div className="w-full bg-secondary/50 rounded-lg p-6 space-y-6">
      {/* Timeline Header */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-foreground">历史时间线</h3>
        <p className="text-muted-foreground">按时间顺序浏览长征历史照片</p>
      </div>

      {/* Year Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedYear('all')}
          className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
            selectedYear === 'all'
              ? 'bg-accent text-accent-foreground'
              : 'bg-secondary text-muted-foreground hover:text-foreground'
          }`}
        >
          全部年份
        </button>
        {years.map(year => (
          <button
            key={year}
            onClick={() => setSelectedYear(year)}
            className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
              selectedYear === year
                ? 'bg-accent text-accent-foreground'
                : 'bg-secondary text-muted-foreground hover:text-foreground'
            }`}
          >
            {year === 'other' ? '其他' : `${year}年`}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-accent via-accent/50 to-accent/20"></div>

        {/* Timeline Items */}
        <div className="space-y-6">
          {displayPhotos.map((photo: Photo) => (
            <div key={photo.id} className="pl-24 relative">
              {/* Timeline Dot */}
              <div className="absolute left-0 top-2 w-16 h-16 flex items-center justify-center">
                <div className="w-4 h-4 bg-accent rounded-full border-4 border-card"></div>
              </div>

              {/* Content Card */}
              <button
                onClick={() => onPhotoSelect(photo)}
                className="w-full text-left bg-card hover:bg-secondary/80 rounded-lg p-4 transition-all hover:shadow-lg hover:scale-105 group"
              >
                <div className="flex gap-4">
                  {/* Thumbnail */}
                  <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-secondary">
                    <img
                      src={photo.imageUrl}
                      alt={photo.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-accent mb-1">{photo.period}</p>
                        <h4 className="text-lg font-bold text-foreground line-clamp-2 group-hover:text-accent transition-colors">
                          {photo.title}
                        </h4>
                      </div>
                      <span className="text-xs px-2 py-1 bg-secondary rounded-full text-muted-foreground flex-shrink-0">
                        {photo.category}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {photo.description}
                    </p>
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
        <div className="text-center">
          <p className="text-2xl font-bold text-accent">{displayPhotos.length}</p>
          <p className="text-sm text-muted-foreground">张照片</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-accent">{years.length}</p>
          <p className="text-sm text-muted-foreground">个年份</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-accent">1934-1937</p>
          <p className="text-sm text-muted-foreground">时间跨度</p>
        </div>
      </div>
    </div>
  );
}
