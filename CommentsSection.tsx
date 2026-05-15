import { useState } from 'react';
import { MessageSquare, ThumbsUp, Flag, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface Comment {
  id: string;
  author: string;
  role: 'scholar' | 'user';
  content: string;
  timestamp: string;
  likes: number;
  tags: string[];
}

interface CommentsSectionProps {
  photoId: string;
  photoTitle: string;
}

export function CommentsSection({ photoId, photoTitle }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      author: '历史学家李明',
      role: 'scholar',
      content: '这张照片拍摄于1934年10月，记录了中央红军渡过于都河的历史时刻。从照片中可以看到红军战士们的坚定表情和井然有序的队伍。',
      timestamp: '2026-05-10',
      likes: 24,
      tags: ['长征', '于都河', '1934年']
    },
    {
      id: '2',
      author: '用户张三',
      role: 'user',
      content: '非常珍贵的历史资料！这张照片让我更深入地了解了长征的艰苦。',
      timestamp: '2026-05-11',
      likes: 8,
      tags: ['感谢', '历史']
    }
  ]);

  const [newComment, setNewComment] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const availableTags = ['长征', '会议', '遗址', '战役', '人物', '物品', '1934年', '1935年', '1936年', '1937年'];

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: String(comments.length + 1),
        author: '我',
        role: 'user',
        content: newComment,
        timestamp: new Date().toISOString().split('T')[0],
        likes: 0,
        tags: selectedTags
      };
      setComments([comment, ...comments]);
      setNewComment('');
      setSelectedTags([]);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-accent" />
        <h3 className="text-lg font-bold text-foreground">学术评论与标注</h3>
        <span className="text-sm text-muted-foreground">({comments.length})</span>
      </div>

      {/* New Comment Form */}
      <div className="bg-secondary/50 rounded-lg p-4 space-y-4">
        <Textarea
          placeholder="分享您对这张照片的学术见解或标注..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-24 resize-none"
        />

        {/* Tags */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">添加标签（可选）：</p>
          <div className="flex flex-wrap gap-2">
            {availableTags.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full text-sm transition-all ${
                  selectedTags.includes(tag)
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-secondary text-muted-foreground hover:text-foreground'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleAddComment}
            disabled={!newComment.trim()}
            className="gap-2"
          >
            <Send className="w-4 h-4" />
            发布评论
          </Button>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map(comment => (
          <div key={comment.id} className="bg-card rounded-lg p-4 border border-border hover:border-accent/50 transition-colors">
            {/* Comment Header */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-foreground">{comment.author}</p>
                  {comment.role === 'scholar' && (
                    <span className="text-xs px-2 py-1 bg-accent/20 text-accent rounded-full">学者</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{comment.timestamp}</p>
              </div>
              <button className="text-muted-foreground hover:text-destructive transition-colors p-1">
                <Flag className="w-4 h-4" />
              </button>
            </div>

            {/* Comment Content */}
            <p className="text-foreground mb-3 leading-relaxed">{comment.content}</p>

            {/* Tags */}
            {comment.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {comment.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 bg-secondary text-muted-foreground rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-1 text-muted-foreground hover:text-accent transition-colors text-sm">
                <ThumbsUp className="w-4 h-4" />
                <span>{comment.likes}</span>
              </button>
              <button className="text-muted-foreground hover:text-accent transition-colors text-sm">
                回复
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* No Comments Message */}
      {comments.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>还没有评论，成为第一个评论者吧！</p>
        </div>
      )}
    </div>
  );
}
