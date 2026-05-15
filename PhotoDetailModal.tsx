import { HistoricalPhoto } from '@/lib/photoData';
import { X, MapPin, Calendar, BookOpen, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface PhotoDetailModalProps {
  photo: HistoricalPhoto;
  onClose: () => void;
  onCompare: () => void;
  onStory?: () => void;
}

export function PhotoDetailModal({
  photo,
  onClose,
  onCompare,
  onStory,
}: PhotoDetailModalProps) {
  const handleDownload = async () => {
    try {
      const response = await fetch(photo.imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${photo.title}-修复版.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('照片下载成功！');
    } catch (error) {
      toast.error('下载失败，请重试');
      console.error('Download error:', error);
    }
  };
  return (
    <div className="fixed inset-0 bg-black/80 z-40 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-card rounded-lg overflow-hidden max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl animate-in scale-in duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-secondary/50">
          <div className="flex-1">
            <p className="text-accent text-xs font-semibold uppercase tracking-wider mb-1">
              {photo.category}
            </p>
            <h2 className="text-foreground font-semibold text-lg">{photo.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-secondary rounded-lg"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Image */}
            <div className="bg-secondary rounded-lg overflow-hidden border border-border/50">
              <img
                src={photo.imageUrl}
                alt={photo.title}
                className="w-full h-auto"
              />
            </div>

            {/* Description */}
            <div>
              <h3 className="text-foreground font-semibold mb-2">描述</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {photo.description}
              </p>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-secondary/30 rounded-lg border border-border/50">
              {photo.period && (
                <div className="flex items-start gap-3">
                  <Calendar size={18} className="text-accent mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-muted-foreground text-xs uppercase tracking-wider">时期</p>
                    <p className="text-foreground font-medium text-sm mt-1">{photo.period}</p>
                  </div>
                </div>
              )}
              {photo.date && (
                <div className="flex items-start gap-3">
                  <Calendar size={18} className="text-accent mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-muted-foreground text-xs uppercase tracking-wider">日期</p>
                    <p className="text-foreground font-medium text-sm mt-1">{photo.date}</p>
                  </div>
                </div>
              )}
              {photo.location && (
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-accent mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-muted-foreground text-xs uppercase tracking-wider">地点</p>
                    <p className="text-foreground font-medium text-sm mt-1">{photo.location}</p>
                  </div>
                </div>
              )}
              {photo.category && (
                <div className="flex items-start gap-3">
                  <BookOpen size={18} className="text-accent mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-muted-foreground text-xs uppercase tracking-wider">分类</p>
                    <p className="text-foreground font-medium text-sm mt-1">{photo.category}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Source & Notes */}
            <div className="space-y-3 border-t border-border pt-4">
              {photo.source && (
                <div>
                  <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">来源</p>
                  <p className="text-foreground text-sm">{photo.source}</p>
                </div>
              )}
              {photo.restorationNotes && (
                <div>
                  <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">修复说明</p>
                  <p className="text-foreground text-sm leading-relaxed">{photo.restorationNotes}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border flex gap-3 justify-end bg-secondary/50 flex-wrap">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-border text-foreground hover:bg-secondary"
          >
            关闭
          </Button>
          <Button
            variant="outline"
            onClick={handleDownload}
            className="border-accent/50 text-accent hover:bg-accent/10 flex items-center gap-2"
          >
            <Download size={16} />
            下载修复版
          </Button>
          {onStory && (
            <Button
              variant="outline"
              onClick={onStory}
              className="border-accent/50 text-accent hover:bg-accent/10 flex items-center gap-2"
            >
              📖 故事解读
            </Button>
          )}
          <Button
            onClick={onCompare}
            className="bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-200"
          >
            查看修复对比
          </Button>
        </div>
      </div>
    </div>
  );
}
