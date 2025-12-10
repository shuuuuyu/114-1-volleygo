import React from 'react';

const CommentItem = ({ comment }) => {
  return (
    <div className="comment">
      <div className="comment-user">
        <div className="user-avatar">
          {comment.user_email ? comment.user_email[0].toUpperCase() : '?'}
        </div>
        <div className="user-details">
          <p className="user-email">{comment.user_email || '匿名使用者'}</p>
          <p className="comment-time">
            {new Date(comment.created_at).toLocaleString('zh-TW')}
          </p>
        </div>
      </div>
      <p className="comment-content">{comment.content}</p>
    </div>
  );
};

export default CommentItem;