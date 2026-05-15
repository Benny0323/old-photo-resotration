import { useState } from 'react';
import { Search, X, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  categories: string[];
  periods: string[];
}

export interface SearchFilters {
  query: string;
  category: string;
  period: string;
  source?: string;
  location?: string;
  hasRestoredVersion?: boolean;
}

export function AdvancedSearch({ onSearch, categories, periods }: AdvancedSearchProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: 'all',
    period: 'all',
  });

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onSearch(newFilters);
  };

  const handleReset = () => {
    const resetFilters: SearchFilters = {
      query: '',
      category: 'all',
      period: 'all',
    };
    setFilters(resetFilters);
    onSearch(resetFilters);
  };

  const hasActiveFilters = filters.query || filters.category !== 'all' || filters.period !== 'all';

  return (
    <div className="w-full space-y-4">
      {/* Main Search Bar */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="搜索照片标题、描述、地点或人物..."
            value={filters.query}
            onChange={(e) => handleFilterChange('query', e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className="gap-2"
        >
          高级筛选
          <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </Button>
      </div>

      {/* Advanced Filters */}
      {isExpanded && (
        <div className="bg-secondary/50 rounded-lg p-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">分类</label>
              <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有分类</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Period Filter */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">时期</label>
              <Select value={filters.period} onValueChange={(value) => handleFilterChange('period', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有时期</SelectItem>
                  {periods.map(period => (
                    <SelectItem key={period} value={period}>{period}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Source Filter */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">来源</label>
              <Select value={filters.source || 'all'} onValueChange={(value) => handleFilterChange('source', value === 'all' ? undefined : value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有来源</SelectItem>
                  <SelectItem value="archive">档案馆</SelectItem>
                  <SelectItem value="newspaper">报纸</SelectItem>
                  <SelectItem value="personal">个人收藏</SelectItem>
                  <SelectItem value="museum">博物馆</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Location Filter */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">地点</label>
              <Select value={filters.location || 'all'} onValueChange={(value) => handleFilterChange('location', value === 'all' ? undefined : value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有地点</SelectItem>
                  <SelectItem value="jiangxi">江西</SelectItem>
                  <SelectItem value="hunan">湖南</SelectItem>
                  <SelectItem value="guizhou">贵州</SelectItem>
                  <SelectItem value="yunnan">云南</SelectItem>
                  <SelectItem value="sichuan">四川</SelectItem>
                  <SelectItem value="shaanxi">陕西</SelectItem>
                  <SelectItem value="gansu">甘肃</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Additional Options */}
          <div className="flex items-center gap-4 pt-2 border-t border-border">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.hasRestoredVersion || false}
                onChange={(e) => handleFilterChange('hasRestoredVersion', e.target.checked || undefined)}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm text-foreground">仅显示已修复的照片</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            {hasActiveFilters && (
              <Button variant="outline" onClick={handleReset} className="gap-2">
                <X className="w-4 h-4" />
                重置筛选
              </Button>
            )}
            <Button onClick={() => setIsExpanded(false)}>
              完成
            </Button>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.query && (
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-accent/20 text-accent rounded-full text-sm">
              搜索: {filters.query}
              <button onClick={() => handleFilterChange('query', '')} className="hover:text-accent/80">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.category !== 'all' && (
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-accent/20 text-accent rounded-full text-sm">
              分类: {filters.category}
              <button onClick={() => handleFilterChange('category', 'all')} className="hover:text-accent/80">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.period !== 'all' && (
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-accent/20 text-accent rounded-full text-sm">
              时期: {filters.period}
              <button onClick={() => handleFilterChange('period', 'all')} className="hover:text-accent/80">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
