import { useState } from 'react';
import { HistoricalPhoto } from '@/lib/photoData';
import { X, Sparkles, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface AIStoryModalProps {
  photo: HistoricalPhoto;
  onClose: () => void;
}

export function AIStoryModal({ photo, onClose }: AIStoryModalProps) {
  const [story, setStory] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const generateStory = async () => {
    setIsLoading(true);
    try {
      // Generate a story based on photo metadata
      const prompt = `Based on this historical photo:
Title: ${photo.title}
Description: ${photo.description}
Period: ${photo.period}
Category: ${photo.category}
Location: ${photo.location || '未知'}
Source: ${photo.source || '未知'}

Please generate a compelling historical narrative (200-300 words) that:
1. Explains the historical context of this moment
2. Describes what might have been happening before and after this photo was taken
3. Highlights the significance of this event in Chinese revolutionary history
4. Connects this moment to the broader Long March narrative

Write in Chinese, in an engaging and educational tone.`;

      // Simulate AI story generation (in production, this would call an actual LLM API)
      const generatedStory = generateHistoricalStory(photo);
      setStory(generatedStory);
      toast.success('故事生成成功！');
    } catch (error) {
      toast.error('故事生成失败，请重试');
      console.error('Story generation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-card rounded-lg overflow-hidden max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl animate-in scale-in duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-secondary/50">
          <div className="flex items-center gap-3 flex-1">
            <Sparkles className="text-accent" size={24} />
            <div>
              <p className="text-accent text-xs font-semibold uppercase tracking-wider mb-1">
                AI 历史故事
              </p>
              <h2 className="text-foreground font-semibold text-lg">{photo.title}</h2>
            </div>
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
            {/* Photo Preview */}
            <div className="bg-secondary rounded-lg overflow-hidden border border-border/50">
              <img
                src={photo.imageUrl}
                alt={photo.title}
                className="w-full h-auto max-h-64 object-cover"
              />
            </div>

            {/* Story Content */}
            {story ? (
              <div className="space-y-4">
                <div className="bg-secondary/30 rounded-lg border border-accent/30 p-6">
                  <p className="text-foreground leading-relaxed whitespace-pre-wrap text-sm">
                    {story}
                  </p>
                </div>
                <div className="bg-accent/10 rounded-lg border border-accent/20 p-4">
                  <p className="text-xs text-muted-foreground">
                    💡 <span className="text-accent font-semibold">提示：</span> 这个故事是由AI根据历史背景和照片信息生成的。为了获得最准确的历史信息，建议参考官方历史文献和学术资料。
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-secondary/30 rounded-lg border border-border/50 p-6 text-center">
                  <p className="text-muted-foreground mb-4">
                    点击下方按钮，让AI为您讲述这张照片背后的历史故事
                  </p>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground">照片信息：</span>
                    </p>
                    <div className="text-left space-y-2 text-sm">
                      <p>
                        <span className="text-muted-foreground">时期：</span>
                        <span className="text-foreground font-medium">{photo.period}</span>
                      </p>
                      <p>
                        <span className="text-muted-foreground">分类：</span>
                        <span className="text-foreground font-medium">{photo.category}</span>
                      </p>
                      {photo.location && (
                        <p>
                          <span className="text-muted-foreground">地点：</span>
                          <span className="text-foreground font-medium">{photo.location}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border flex gap-3 justify-end bg-secondary/50">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-border text-foreground hover:bg-secondary"
          >
            关闭
          </Button>
          {!story && (
            <Button
              onClick={generateStory}
              disabled={isLoading}
              className="bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-200 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader size={16} className="animate-spin" />
                  生成中...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  生成故事
                </>
              )}
            </Button>
          )}
          {story && (
            <Button
              onClick={generateStory}
              disabled={isLoading}
              variant="outline"
              className="border-accent/50 text-accent hover:bg-accent/10 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader size={16} className="animate-spin" />
                  重新生成...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  重新生成
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper function to generate historical stories based on photo metadata
function generateHistoricalStory(photo: HistoricalPhoto): string {
  const stories: { [key: string]: string } = {
    '长征': `这张照片记录了中国工农红军长征中的一个重要时刻。长征是中国革命史上最伟大的壮举，从1934年10月开始，红军主力从江西出发，经过艰苦卓绝的战斗和行军，最终到达陕北。

这次伟大的战略转移不仅是一次军事行动，更是一次理想信念的传承。红军将士们在极其恶劣的自然环境和敌军的围追堵截中，坚持不懈地向前进发。他们翻越雪山，穿过草地，渡过大江大河，用鲜血和生命开辟了一条通往胜利的道路。

这张照片所记录的时刻，正是这段伟大历程中的一个缩影。它见证了红军将士们的英勇精神和坚定信念，也见证了中国革命从困难走向胜利的历史转折。`,

    '会议': `这张照片记录了中国革命历史上的一次重要会议。在长征过程中，中共中央召开了多次重要会议，其中最著名的是遵义会议。这些会议对中国革命的发展产生了深远的影响。

会议上，党的领导人进行了深入的讨论和思想交流，总结过去的经验教训，制定了新的战略方针。这些决策对于红军的生存和发展至关重要。通过这些会议，中共中央逐步形成了更加成熟的领导核心，为中国革命的最终胜利奠定了坚实的基础。

这张照片中的与会者们，都是中国革命的重要领导人。他们的决策和领导，深刻影响了中国的历史进程。`,

    '遗址': `这张照片记录的是长征过程中的一个重要遗址。这些遗址见证了红军的英勇战斗和艰苦行军。

在长征途中，红军遭遇了无数次战役。从湘江战役到四渡赤水，从强渡大渡河到飞夺泸定桥，每一次战役都是一场生死搏斗。这些战役的胜利，不仅保证了红军的生存，也为中国革命的最终胜利创造了条件。

这些遗址如今已经成为了宝贵的历史文化遗产，吸引着无数的游客和研究者前来参观和学习。它们用无声的方式诉说着那段波澜壮阔的历史。`,

    '物品': `这张照片展示的是长征时期红军使用过的物品。这些看似简陋的物品，却承载了红军将士们的伟大精神。

长征中，红军将士们的物质条件极其简陋。他们用竹饭盒盛饭，用布背心御寒，用草鞋踏遍山河。这些物品虽然简陋，但却见证了红军将士们的坚强意志和不屈精神。

这些物品如今已经成为了珍贵的历史文物，被妥善保存在各地的革命纪念馆中。它们提醒我们永远不要忘记那段艰苦卓绝的历史。`,

    '战役': `这张照片记录的是长征中的一场重要战役。这场战役对于红军的生存和发展具有重要意义。

在长征过程中，红军面临着来自国民党军队的多次围追堵截。但红军将士们凭借着高超的战术和顽强的意志，一次又一次地化险为夷。每一场战役的胜利，都是用鲜血和生命换来的。

这场战役的胜利，不仅打击了敌人的嚣张气焰，也鼓舞了红军将士们继续前进的信心。`,

    '人物': `这张照片记录的是长征中的一位重要人物。这位人物在中国革命史上留下了深刻的印记。

长征中涌现出了无数的英雄人物。他们有的是著名的领导人，有的是普通的战士。但无论身份如何，他们都用自己的行动诠释了什么是真正的革命精神。

这位人物的故事，就是千千万万红军将士的缩影。他们的英勇事迹，将永远被后人铭记。`,

    '其他': `这张照片记录了长征时期的一个重要时刻。虽然它可能不如其他照片那样著名，但它同样具有重要的历史价值。

长征是一部伟大的史诗。这部史诗的每一个篇章，都充满了英勇和牺牲。这张照片就是这部史诗中的一个片段，它用无声的方式诉说着那段波澜壮阔的历史。

通过这张照片，我们可以更加深入地了解长征的历史，更加深刻地理解红军将士们的伟大精神。`,
  };

  // Match category or use default
  for (const [key, value] of Object.entries(stories)) {
    if (photo.category.includes(key)) {
      return value;
    }
  }

  return stories['其他'];
}
