import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import CommentList from './CommentList';
import CommentForm from './CommentForm';
import { supabase } from '../../services/supabaseClient';
import './CommentSection.css';

const CommentSection = ({ matchId, user }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (supabase) {
      loadComments();
    } else {
      // 如果沒有 Supabase，使用模擬資料
      setComments([
        {
          id: 1,
          user_email: 'ball_lover@example.com',
          content: '恭喜台電！請問有沒有人這週六想在台北找場地打友誼賽？缺兩位中手！#找球友 #台北',
          created_at: '2025-11-17T10:00:00',
        },
        {
          id: 2,
          user_email: 'v_editor@example.com',
          content: '這場比賽真的精彩，MVP 無庸置疑！',
          created_at: '2025-11-17T09:30:00',
        }
      ]);
      setLoading(false);
    }
  }, [matchId]);

  const loadComments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', matchId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('載入留言失敗:', error);
    } else {
      setComments(data || []);
    }
    setLoading(false);
  };

  const handleAddComment = async (newComment) => {
    if (!user) {
      alert('請先登入才能留言');
      return;
    }

    if (supabase) {
      const { data, error } = await supabase
        .from('comments')
        .insert([
          {
            post_id: matchId,
            user_id: user.id,
            user_email: user.email,
            content: newComment,
          }
        ])
        .select();

      if (error) {
        alert('留言失敗: ' + error.message);
      } else {
        setComments([data[0], ...comments]);
      }
    } else {
      // 模擬新增留言
      const mockComment = {
        id: Date.now(),
        user_email: user?.email || '訪客',
        content: newComment,
        created_at: new Date().toISOString(),
      };
      setComments([mockComment, ...comments]);
    }
  };

  return (
    <div className="comment-section">
      <div className="comment-header">
        <MessageCircle className="comment-icon" size={20} />
        <h3>留言討論</h3>
      </div>
      
      <CommentForm onSubmit={handleAddComment} user={user} />
      
      {loading ? (
        <p className="loading-text">載入中...</p>
      ) : (
        <CommentList comments={comments} />
      )}
    </div>
  );
};

export default CommentSection;
