export interface HistoricalPhoto {
  id: string;
  title: string;
  description: string;
  category: string;
  period: string;
  location?: string;
  date?: string;
  source?: string;
  restorationNotes?: string;
  imageUrl: string;
  width: number;
  height: number;
}

// Mock data for 90 historical photos
// In production, this would be fetched from an API
export const mockPhotos: HistoricalPhoto[] = [
  {
    id: '001',
    title: '红军长征出发地',
    description: '红军长征的起点，记录了这一伟大历史时刻',
    category: '长征出发',
    period: '1934年',
    location: '江西瑞金',
    date: '1934年10月',
    source: '中国革命博物馆',
    restorationNotes: '修复了照片的色调和对比度，恢复了细节',
    imageUrl: 'https://via.placeholder.com/400x500?text=Photo+001',
    width: 400,
    height: 500,
  },
  {
    id: '002',
    title: '红军战士行军',
    description: '长征途中的红军战士们坚定前行',
    category: '行军',
    period: '1934-1935年',
    location: '贵州',
    date: '1935年',
    source: '新华社',
    restorationNotes: '增强了照片的清晰度和对比度',
    imageUrl: 'https://via.placeholder.com/350x450?text=Photo+002',
    width: 350,
    height: 450,
  },
  {
    id: '003',
    title: '遵义会议旧址',
    description: '中国共产党历史上的重要会议地点',
    category: '会议',
    period: '1935年',
    location: '贵州遵义',
    date: '1935年1月',
    source: '遵义会议纪念馆',
    restorationNotes: '修复了建筑细节和光线效果',
    imageUrl: 'https://via.placeholder.com/450x350?text=Photo+003',
    width: 450,
    height: 350,
  },
  {
    id: '004',
    title: '飞夺泸定桥',
    description: '长征中最惊险的战役之一',
    category: '战役',
    period: '1935年',
    location: '四川泸定',
    date: '1935年5月',
    source: '泸定桥纪念馆',
    restorationNotes: '恢复了历史场景的原貌',
    imageUrl: 'https://via.placeholder.com/380x480?text=Photo+004',
    width: 380,
    height: 480,
  },
  {
    id: '005',
    title: '翻越夹金山',
    description: '红军克服自然障碍的壮举',
    category: '自然障碍',
    period: '1935年',
    location: '四川夹金山',
    date: '1935年6月',
    source: '新华社',
    restorationNotes: '增强了山景的层次感',
    imageUrl: 'https://via.placeholder.com/420x520?text=Photo+005',
    width: 420,
    height: 520,
  },
  {
    id: '006',
    title: '红军领导人合影',
    description: '长征中的重要领导人物合影',
    category: '人物',
    period: '1935年',
    location: '陕北',
    date: '1935年',
    source: '中央档案馆',
    restorationNotes: '修复了人物肖像的清晰度',
    imageUrl: 'https://via.placeholder.com/360x450?text=Photo+006',
    width: 360,
    height: 450,
  },
  {
    id: '007',
    title: '红军过草地',
    description: '长征中最艰苦的路段之一',
    category: '地形',
    period: '1935年',
    location: '四川草地',
    date: '1935年7月',
    source: '新华社',
    restorationNotes: '恢复了草地的纹理和细节',
    imageUrl: 'https://via.placeholder.com/400x480?text=Photo+007',
    width: 400,
    height: 480,
  },
  {
    id: '008',
    title: '红军医疗队',
    description: '长征中的医疗保障工作',
    category: '后勤',
    period: '1935年',
    location: '陕甘宁',
    date: '1935年',
    source: '解放军报',
    restorationNotes: '增强了医疗场景的细节',
    imageUrl: 'https://via.placeholder.com/380x450?text=Photo+008',
    width: 380,
    height: 450,
  },
  {
    id: '009',
    title: '红军宣传队',
    description: '红军的文化宣传工作',
    category: '文化',
    period: '1935年',
    location: '陕北',
    date: '1935年',
    source: '新华社',
    restorationNotes: '修复了文字和图案的清晰度',
    imageUrl: 'https://via.placeholder.com/420x500?text=Photo+009',
    width: 420,
    height: 500,
  },
  {
    id: '010',
    title: '长征胜利大会',
    description: '红军长征胜利后的庆祝大会',
    category: '庆祝',
    period: '1935年',
    location: '陕北延安',
    date: '1935年10月',
    source: '新华社',
    restorationNotes: '恢复了集会现场的完整记录',
    imageUrl: 'https://via.placeholder.com/450x380?text=Photo+010',
    width: 450,
    height: 380,
  },
];

// Generate 90 photos by extending the mock data
export const generatePhotos = (): HistoricalPhoto[] => {
  const photos: HistoricalPhoto[] = [];
  const categories = ['长征出发', '行军', '会议', '战役', '自然障碍', '人物', '地形', '后勤', '文化', '庆祝'];
  const periods = ['1934年', '1934-1935年', '1935年', '1935年6月', '1935年7月', '1935年10月'];
  const locations = ['江西瑞金', '贵州', '贵州遵义', '四川泸定', '四川夹金山', '陕北', '四川草地', '陕甘宁', '陕北延安'];

  for (let i = 1; i <= 90; i++) {
    const categoryIndex = (i - 1) % categories.length;
    const periodIndex = (i - 1) % periods.length;
    const locationIndex = (i - 1) % locations.length;
    const width = 350 + (i % 4) * 50;
    const height = 400 + (i % 3) * 80;

    photos.push({
      id: String(i).padStart(3, '0'),
      title: `历史照片 ${i}`,
      description: `这是长征历史中的重要照片记录，编号为 ${i}`,
      category: categories[categoryIndex],
      period: periods[periodIndex],
      location: locations[locationIndex],
      date: `${1934 + Math.floor(i / 45)}-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
      source: i % 3 === 0 ? '新华社' : i % 3 === 1 ? '中央档案馆' : '解放军报',
      restorationNotes: `使用先进的AI技术修复了照片 ${i} 的色调、对比度和细节`,
      imageUrl: `https://via.placeholder.com/${width}x${height}?text=Photo+${String(i).padStart(3, '0')}`,
      width,
      height,
    });
  }

  return photos;
};

export const allPhotos = generatePhotos();
