import React from 'react';
import CommentItem from './CommentItem';

const CommentList = ({ comments }) => {
  return (
    <div className="comment-list">
      {comments.length === 0 ? (
        <p className="no-comments">還沒有留言，搶先發表！</p>
      ) : (
        comments.map(comment => (
          <CommentItem key={comment.id} comment={comment} />
        ))
      )}
    </div>
  );
};

export default CommentList;