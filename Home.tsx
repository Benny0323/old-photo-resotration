import { useState, useEffect, useMemo } from 'react';
import { PhotoGrid } from '@/components/PhotoGrid';
import { PhotoDetailModal } from '@/components/PhotoDetailModal';
import { PhotoComparison } from '@/components/PhotoComparison';
import { AIStoryModal } from '@/components/AIStoryModal';
import { TimelineView } from '@/components/TimelineView';
import { CommentsSection } from '@/components/CommentsSection';
import { AdvancedSearch, SearchFilters } from '@/components/AdvancedSearch';
import { HistoricalPhoto } from '@/lib/photoData';
import { Search, Filter, Calendar, MessageSquare } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import realPhotosData from '@/lib/realPhotos.json';

export default function Home() {
  const [selectedPhoto, setSelectedPhoto] = useState<HistoricalPhoto | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [showStory, setShowStory] = useState(false);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    query: '',
    category: 'all',
    period: 'all',
  });
  const [allPhotos, setAllPhotos] = useState<HistoricalPhoto[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid');
  const [selectedPhotoForComments, setSelectedPhotoForComments] = useState<HistoricalPhoto | null>(null);

  // Load real photos from JSON
  useEffect(() => {
    setAllPhotos(realPhotosData as HistoricalPhoto[]);
  }, []);

  // Get unique categories and periods
  const categories = useMemo(() => {
    const cats = new Set(allPhotos.map((p) => p.category));
    return Array.from(cats).sort();
  }, [allPhotos]);

  const periods = useMemo(() => {
    const pds = new Set(allPhotos.map((p) => p.period));
    return Array.from(pds).sort();
  }, [allPhotos]);

  // Filter photos based on search and filters
  const filteredPhotos = useMemo(() => {
    return allPhotos.filter((photo) => {
      const matchesSearch =
        photo.title.toLowerCase().includes(searchFilters.query.toLowerCase()) ||
        photo.description.toLowerCase().includes(searchFilters.query.toLowerCase());
      const matchesCategory =
        searchFilters.category === 'all' || photo.category === searchFilters.category;
      const matchesPeriod =
        searchFilters.period === 'all' || photo.period === searchFilters.period;

      return matchesSearch && matchesCategory && matchesPeriod;
    });
  }, [searchFilters, allPhotos]);

  const handleSearchChange = (filters: SearchFilters) => {
    setSearchFilters(filters);
  };

  const handlePhotoSelect = (photo: HistoricalPhoto) => {
    setSelectedPhoto(photo);
    setSelectedPhotoForComments(photo);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Background Image */}
      <section className="relative py-20 md:py-32 border-b border-border overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663658990694/d6ADixNEoY2xBP473Z7J6Q/hero-archive-jxVDN39RJNNoDJxma2naSw.webp"
            alt="Archive Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background"></div>
        </div>

        {/* Content */}
        <div className="container relative z-10">
          <div className="max-w-3xl">
            <div className="mb-4 inline-block">
              <span className="text-accent text-sm font-semibold tracking-widest uppercase">
                历史档案馆
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-accent leading-tight">
              老照片修复展示
            </h1>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed max-w-2xl">
              南京大学与东南大学联合项目，采用先进的人工智能技术对90张珍贵的历史照片进行修复和增强。这些照片记录了中国革命的重要时刻，承载着深厚的历史意义。
            </p>
            <div className="flex flex-wrap gap-8 pt-4">
              <div>
                <p className="text-4xl font-bold text-accent">90+</p>
                <p className="text-muted-foreground text-sm mt-1">历史照片</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-accent">100%</p>
                <p className="text-muted-foreground text-sm mt-1">AI修复</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-accent">2所</p>
                <p className="text-muted-foreground text-sm mt-1">顶级大学</p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative divider */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent"></div>
      </section>

      {/* Institution Info */}
      <section className="py-16 border-b border-border bg-secondary/30">
        <div className="container">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">学术合作</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="p-6 rounded-lg border border-border/50 hover:border-accent/30 transition-colors">
              <h3 className="text-foreground font-semibold mb-3 text-lg">南京大学</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                中国顶级综合性大学，在历史研究和数字人文领域具有深厚的学术积累。提供历史资料整理、学术指导与项目协调。
              </p>
            </div>
            <div className="p-6 rounded-lg border border-border/50 hover:border-accent/30 transition-colors">
              <h3 className="text-foreground font-semibold mb-3 text-lg">东南大学</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                工程技术领先的高等学府，在图像处理和AI技术方面拥有卓越的研究能力。负责照片修复算法开发与技术实现。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-10 border-b border-border bg-secondary/20">
        <div className="container">
          <div className="space-y-4">
            {/* Advanced Search Component */}
            <AdvancedSearch
              onSearch={handleSearchChange}
              categories={categories}
              periods={periods}
            />

            {/* View Mode Tabs */}
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-sm">
                找到 <span className="text-accent font-semibold text-base">{filteredPhotos.length}</span> 张照片
              </p>
              <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'grid' | 'timeline')} className="w-auto">
                <TabsList className="bg-secondary border-border">
                  <TabsTrigger value="grid" className="gap-2">
                    <Filter size={16} />
                    网格视图
                  </TabsTrigger>
                  <TabsTrigger value="timeline" className="gap-2">
                    <Calendar size={16} />
                    时间线
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Gallery / Timeline */}
      <section className="py-12">
        <div className="container">
          {filteredPhotos.length > 0 ? (
            viewMode === 'grid' ? (
              <PhotoGrid photos={filteredPhotos} onPhotoClick={(photo) => {
                setSelectedPhoto(photo);
              }} />
            ) : (
              <TimelineView
                photos={filteredPhotos}
                onPhotoSelect={(photo: any) => {
                  setSelectedPhoto(photo as HistoricalPhoto);
                }}
              />
            )
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">未找到匹配的照片</p>
            </div>
          )}
        </div>
      </section>

      {/* Photo Detail Modal */}
      {selectedPhoto && !showComparison && !showStory && (
        <PhotoDetailModal
          photo={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
          onCompare={() => setShowComparison(true)}
          onStory={() => setShowStory(true)}
        />
      )}

      {/* Photo Comparison Modal */}
      {showComparison && selectedPhoto && (
        <PhotoComparison
          beforeImage={selectedPhoto.imageUrl}
          title={selectedPhoto.title}
          onClose={() => setShowComparison(false)}
        />
      )}

      {/* AI Story Modal */}
      {showStory && selectedPhoto && (
        <AIStoryModal
          photo={selectedPhoto}
          onClose={() => setShowStory(false)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-secondary/50">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="text-foreground font-semibold mb-3">关于项目</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                致力于保护和传承珍贵的历史记忆，通过现代技术赋予历史照片新的生命。
              </p>
            </div>
            <div>
              <h4 className="text-foreground font-semibold mb-3">技术支持</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                采用深度学习和计算机视觉技术，实现照片的自动修复、增强和保护。
              </p>
            </div>
            <div>
              <h4 className="text-foreground font-semibold mb-3">联系方式</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                南京大学 | 东南大学<br />
                老照片修复项目组
              </p>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-muted-foreground text-sm">
            <p>© 2026 南京大学 × 东南大学 老照片修复项目</p>
            <p className="mt-2">采用先进的AI技术进行历史照片修复与增强</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
