import { HistoricalPhoto } from './photoData';

/**
 * Load real photos from the desktop directory
 * This would typically be done via an API in production
 * For now, we'll use placeholder data with real image references
 */

export const realPhotoMetadata: Array<Omit<HistoricalPhoto, 'imageUrl'> & { filename: string }> = [
  {
    id: '001',
    filename: '红军长征出发地',
    title: '红军长征出发地',
    description: '红军长征的起点，记录了这一伟大历史时刻',
    category: '长征出发',
    period: '1934年',
    location: '江西瑞金',
    date: '1934年10月',
    source: '中国革命博物馆',
    restorationNotes: '修复了照片的色调和对比度，恢复了细节',
    width: 400,
    height: 500,
  },
  {
    id: '002',
    filename: '红军战士行军',
    title: '红军战士行军',
    description: '长征途中的红军战士们坚定前行',
    category: '行军',
    period: '1934-1935年',
    location: '贵州',
    date: '1935年',
    source: '新华社',
    restorationNotes: '增强了照片的清晰度和对比度',
    width: 350,
    height: 450,
  },
  {
    id: '003',
    filename: '遵义会议旧址',
    title: '遵义会议旧址',
    description: '中国共产党历史上的重要会议地点',
    category: '会议',
    period: '1935年',
    location: '贵州遵义',
    date: '1935年1月',
    source: '遵义会议纪念馆',
    restorationNotes: '修复了建筑细节和光线效果',
    width: 450,
    height: 350,
  },
];

/**
 * Convert real photo metadata to HistoricalPhoto objects
 * In production, this would fetch from an API
 */
export function convertToHistoricalPhotos(
  metadata: Array<Omit<HistoricalPhoto, 'imageUrl'> & { filename: string }>,
  imageUrlMap: Record<string, string>
): HistoricalPhoto[] {
  return metadata.map((item) => ({
    ...item,
    imageUrl: imageUrlMap[item.filename] || `https://via.placeholder.com/${item.width}x${item.height}?text=${item.id}`,
  }));
}

/**
 * In a real application, you would:
 * 1. Have a backend API that serves the images
 * 2. Use that API to fetch the image URLs
 * 3. Combine with metadata to create HistoricalPhoto objects
 * 
 * For now, we're using placeholder images with the metadata structure ready
 */
