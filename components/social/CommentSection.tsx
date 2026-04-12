// components/social/CommentSection.tsx
"use client";

import { useState } from 'react';
import { Send } from 'lucide-react';
import { getCurrentUser } from '@/lib/dummyData/users';

interface Comment {
  id: string;
  user_id: string;
  user_name: string;
  user_avatar: string;
  content: string;
  created_at: string;
}

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  onAddComment: (postId: string, content: string) => void;
}

export default function CommentSection({ postId, comments, onAddComment }: CommentSectionProps) {
  const [newComment, setNewComment] = useState('');
  const currentUser = getCurrentUser();

  const handleSubmit = () => {
    if (!newComment.trim() || !currentUser) return;
    onAddComment(postId, newComment);
    setNewComment('');
  };

  return (
    <div className="mt-4">
      <h4 className="font-semibold text-gray-800 mb-3">মন্তব্য ({comments.length})</h4>
      <div className="space-y-3 max-h-80 overflow-y-auto mb-3">
        {comments.map(c => (
          <div key={c.id} className="flex gap-2">
            <img src={c.user_avatar} className="w-8 h-8 rounded-full object-cover" />
            <div className="flex-1 bg-gray-50 rounded-xl px-3 py-2">
              <p className="text-xs font-semibold text-gray-800">{c.user_name}</p>
              <p className="text-sm text-gray-700">{c.content}</p>
              <p className="text-[10px] text-gray-400 mt-1">{new Date(c.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="মন্তব্য লিখুন..."
          className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <button onClick={handleSubmit} className="p-2 rounded-full bg-orange-500 text-white">
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}