import React, { useState, useEffect } from 'react';
import { searchHighlightVideos, searchTeamVideos } from '../services/youtubeService';
import VideoCard from '../components/Video/VideoCard';
import './VideoPage.css';

const VideoPage = () => {
  const [highlightVideos, setHighlightVideos] = useState([]);
  const [teamVideos, setTeamVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [searchInput, setSearchInput] = useState('');

  // 真實的台灣排球隊伍
  const popularTeams = [
    // (TPVL)
    '台中連莊',
    '台北鯨華',
    '新北中纖',
    '台北伊斯特',
  ];

  useEffect(() => {
    fetchHighlights();
  }, []);

  const fetchHighlights = async () => {
    try {
      setLoading(true);
      // 使用新的 searchHighlightVideos 函式
      const highlights = await searchHighlightVideos(6);
      setHighlightVideos(highlights);
    } catch (err) {
      console.error('載入精華影片失敗:', err);
      setError('無法載入精華影片，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (teamName) => {
    if (!teamName.trim()) return;
    
    setSelectedTeam(teamName);
    setSearchInput(teamName);
    setLoading(true);
    
    try {
      // 使用新的 searchTeamVideos 函式
      const videos = await searchTeamVideos(teamName, 6);
      setTeamVideos(videos);
      setError(null);
    } catch (err) {
      console.error('搜尋失敗:', err);
      setError('搜尋失敗，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  const handleTeamClick = (teamName) => {
    handleSearch(teamName);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(searchInput);
    }
  };

  if (loading && highlightVideos.length === 0) {
    return (
      <div className="video-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>載入影片中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="video-page">
      {/* 精華影片區域 - 主要是 TPVL 好球集錦 */}
      <section className="video-section">
        <h2 className="section-title">🔥 精華好球集錦</h2>
        <p className="section-subtitle">TPVL 聯賽每週精彩好球</p>
        {highlightVideos.length > 0 ? (
          <div className="video-grid">
            {highlightVideos.map(video => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        ) : (
          <p className="no-videos">目前沒有精華影片</p>
        )}
      </section>

      {/* 隊伍專區 - 完整比賽 + 精華 */}
      <section className="video-section">
        <h2 className="section-title">🏐 隊伍專區</h2>
        <p className="section-subtitle">搜尋你喜愛的球隊完整比賽與精彩片段</p>
        
        <div className="team-search-container">
          {/* 搜尋框 */}
          <div className="search-input-wrapper">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="搜尋隊伍名稱..."
              className="team-search-input"
            />
            <button 
              onClick={() => handleSearch(searchInput)}
              className="search-button"
            >
              🔍 搜尋
            </button>
          </div>

          {/* 快速標籤 */}
          <div className="quick-tags">
            <span className="tags-label">熱門球隊：</span>
            {popularTeams.map(team => (
              <button
                key={team}
                onClick={() => handleTeamClick(team)}
                className={`team-tag ${selectedTeam === team ? 'active' : ''}`}
              >
                {team}
              </button>
            ))}
          </div>
        </div>

        {/* 隊伍影片 */}
        {loading && selectedTeam ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
          </div>
        ) : teamVideos.length > 0 ? (
          <div className="video-grid">
            {teamVideos.map(video => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        ) : selectedTeam ? (
          <p className="no-videos">找不到「{selectedTeam}」的相關影片</p>
        ) : (
          <p className="no-videos">請輸入隊伍名稱或點擊熱門標籤</p>
        )}
      </section>

      {error && (
        <div className="error-toast">
          {error}
        </div>
      )}
    </div>
  );
};

export default VideoPage;