import { useState, useRef, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { restorePhoto } from '@/lib/photoRestorationService';

interface PhotoComparisonProps {
  beforeImage: string;
  title: string;
  onClose: () => void;
}

export function PhotoComparison({
  beforeImage,
  title,
  onClose,
}: PhotoComparisonProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [afterImage, setAfterImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate restored image when component mounts
  useEffect(() => {
    const generateRestoration = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await restorePhoto(beforeImage);
        if (result.success && result.restoredImageUrl) {
          setAfterImage(result.restoredImageUrl);
        } else {
          setError(result.error || '修复失败');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '未知错误');
      } finally {
        setIsLoading(false);
      }
    };

    generateRestoration();
  }, [beforeImage]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !isDragging) return;
    const rect = containerRef.current.getBoundingClientRect();
    const newPosition = ((e.clientX - rect.left) / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, newPosition)));
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const newPosition = ((touch.clientX - rect.left) / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, newPosition)));
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-card rounded-lg overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl animate-in scale-in duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-secondary/50">
          <h2 className="text-foreground font-semibold text-lg">{title}</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-secondary rounded-lg"
          >
            <X size={24} />
          </button>
        </div>

        {/* Comparison Container */}
        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="w-full aspect-video bg-secondary flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-12 h-12 text-accent animate-spin" />
                <p className="text-muted-foreground">正在生成修复版本...</p>
              </div>
            </div>
          ) : error ? (
            <div className="w-full aspect-video bg-secondary flex items-center justify-center">
              <div className="flex flex-col items-center gap-4 text-center px-4">
                <p className="text-destructive font-semibold">修复失败</p>
                <p className="text-muted-foreground text-sm">{error}</p>
              </div>
            </div>
          ) : afterImage ? (
            <div
              ref={containerRef}
              className="relative w-full aspect-video bg-secondary cursor-col-resize overflow-hidden select-none"
              onMouseMove={handleMouseMove}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchMove={handleTouchMove}
              onTouchStart={handleMouseDown}
              onTouchEnd={handleMouseUp}
            >
              {/* Before Image */}
              <div className="absolute inset-0">
                <img
                  src={beforeImage}
                  alt="修复前"
                  className="w-full h-full object-contain"
                  draggable={false}
                />
                <div className="absolute top-4 left-4 bg-black/70 px-4 py-2 rounded-lg text-foreground text-sm font-semibold uppercase tracking-wider">
                  修复前
                </div>
              </div>

              {/* After Image */}
              <div
                className="absolute inset-0 overflow-hidden transition-all duration-75"
                style={{ width: `${sliderPosition}%` }}
              >
                <img
                  src={afterImage}
                  alt="修复后"
                  className="absolute inset-0 w-full h-full object-contain"
                  draggable={false}
                  style={{ width: `${(100 / sliderPosition) * 100}%` }}
                />
                <div className="absolute top-4 left-4 bg-accent/90 px-4 py-2 rounded-lg text-accent-foreground text-sm font-semibold uppercase tracking-wider">
                  修复后
                </div>
              </div>

              {/* Slider Handle */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-accent cursor-col-resize transition-all duration-75 hover:w-1.5"
                style={{ left: `${sliderPosition}%` }}
                onMouseDown={handleMouseDown}
              >
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-accent rounded-full flex items-center justify-center shadow-lg transition-all duration-200 ${
                  isDragging ? 'scale-110' : 'hover:scale-105'
                }`}>
                  <div className="flex gap-1.5">
                    <div className="w-0.5 h-5 bg-accent-foreground rounded-full"></div>
                    <div className="w-0.5 h-5 bg-accent-foreground rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer Info */}
        <div className="p-4 border-t border-border bg-secondary/50">
          <p className="text-muted-foreground text-sm text-center">
            {isLoading ? '正在处理...' : error ? '修复失败，请重试' : `拖动滑块或触摸屏幕查看修复效果 • 位置: ${Math.round(sliderPosition)}%`}
          </p>
        </div>
      </div>
    </div>
  );
}
