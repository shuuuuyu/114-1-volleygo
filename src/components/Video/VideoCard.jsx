import React from 'react';
import './VideoCard.css';

const VideoCard = ({ video }) => {
  // 格式化發佈時間
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return '今天';
    if (diffDays === 1) return '昨天';
    if (diffDays < 7) return `${diffDays} 天前`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} 週前`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} 個月前`;
    return `${Math.floor(diffDays / 365)} 年前`;
  };

  return (
    <div className="video-card">
      <a 
        href={video.url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="video-link"
      >
        {/* 縮圖 */}
        <div className="video-thumbnail">
          <img src={video.thumbnail} alt={video.title} />
          <div className="play-overlay">
            <svg 
              width="68" 
              height="48" 
              viewBox="0 0 68 48" 
              fill="none"
            >
              <path 
                d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z" 
                fill="#f00"
              />
              <path d="M 45,24 27,14 27,34" fill="#fff" />
            </svg>
          </div>
        </div>

        {/* 影片資訊 */}
        <div className="video-info">
          <h3 className="video-title">{video.title}</h3>
          <p className="video-channel">{video.channelTitle}</p>
          <p className="video-date">{formatDate(video.publishedAt)}</p>
        </div>
      </a>
    </div>
  );
};

export default VideoCard;