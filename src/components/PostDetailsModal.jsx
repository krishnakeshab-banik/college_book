import React, { useState } from 'react';
import { Heart, Bookmark, X, Send, BadgeCheck, MessageCircle } from 'lucide-react';

export default function PostDetailsModal({ moment, onClose, onLike, onBookmark, onAddComment }) {
  const [commentText, setCommentText] = useState('');

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(moment.id, commentText.trim());
    setCommentText('');
  };

  const comments = moment.comments || [];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content post-details-modal glass" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        <div className="post-details-layout">
          {/* Left Side: Post Image */}
          <div className="post-details-media">
            <img src={moment.image} alt="Memory" className="post-details-img" />
          </div>

          {/* Right Side: Details & Comments Feed */}
          <div className="post-details-info-panel">
            {/* Header */}
            <div className="post-details-header">
              <img src={moment.user.avatar} alt={moment.user.name} className="moment-user-avatar" />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span className="moment-user-name">{moment.user.name}</span>
                  <BadgeCheck size={14} style={{ color: 'var(--primary)', fill: 'rgba(79, 70, 229, 0.15)' }} title="Verified Campus Coordinator" />
                </div>
                <div className="moment-user-univ">{moment.user.university}</div>
              </div>
              <span className="moment-time" style={{ marginLeft: 'auto' }}>{moment.timestamp}</span>
            </div>

            {/* Caption */}
            <div className="post-details-caption">
              <p>{moment.description}</p>
            </div>

            {/* Action Bar */}
            <div className="post-details-actions">
              <button 
                className={`moment-action-btn ${moment.hasLiked ? 'liked' : ''}`}
                onClick={() => onLike(moment.id)}
              >
                <Heart size={18} fill={moment.hasLiked ? 'currentColor' : 'none'} />
                <span>{moment.likes} likes</span>
              </button>

              <button className="moment-action-btn" style={{ cursor: 'default' }}>
                <MessageCircle size={18} />
                <span>{comments.length} comments</span>
              </button>

              <button 
                className={`moment-action-btn ${moment.hasBookmarked ? 'bookmarked' : ''}`}
                onClick={() => onBookmark(moment.id)}
                style={{ marginLeft: 'auto' }}
              >
                <Bookmark size={18} fill={moment.hasBookmarked ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Comments List */}
            <div className="post-comments-section">
              <div className="comments-title">Comments</div>
              <div className="comments-list-scroll">
                {comments.length === 0 ? (
                  <div className="no-comments-message">No comments yet. Be the first to share your thoughts!</div>
                ) : (
                  comments.map((comment, index) => (
                    <div key={index} className="comment-item">
                      <img src={comment.avatar} alt={comment.user} className="comment-user-avatar" />
                      <div className="comment-body">
                        <div className="comment-user-meta">
                          <span className="comment-user-name">{comment.user}</span>
                          <span className="comment-time">{comment.time}</span>
                        </div>
                        <p className="comment-text">{comment.text}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Add Comment Form */}
            <form onSubmit={handleSubmitComment} className="post-comment-input-form">
              <input
                type="text"
                placeholder="Write a comment..."
                className="chat-input"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button type="submit" className="chat-send-btn" style={{ flexShrink: 0 }}>
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
