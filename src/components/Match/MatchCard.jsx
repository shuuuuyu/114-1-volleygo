import React, { useState } from 'react';
import CommentSection from '../Comment/CommentSection';
import FavoriteButton from './FavoriteButton';
import MatchLocationModal from './MatchLocationModal';
import './MatchCard.css';

const MatchCard = ({ match, user }) => {
  const [activeTab, setActiveTab] = useState('info');
  const [isMapOpen, setIsMapOpen] = useState(false); // ✨ 新增：地圖 Modal 狀態
  const isUpcoming = match.status === 'upcoming';

  // 聯賽標籤顯示
  const getLeagueLabel = () => {
    const leagueName = match.league === 'TPVL' ? '職業排球聯盟 (TPVL)' : '企業排球聯賽 (TVL)';
    const genderLabel = match.gender === 'male' ? '男子組' : '女子組';
    return `${leagueName} - ${genderLabel}`;
  };

  return (
    <>
      <div className={`match-card ${isUpcoming ? 'upcoming-card' : 'result-card'}`}>
        {/* 聯賽標籤 */}
        <div className="league-info">
          <span className="league-badge">{match.league}</span>
          <span className="gender-badge">{match.gender === 'male' ? '🏐 男排' : '🏐 女排'}</span>
          <span className="league-full-name">{getLeagueLabel()}</span>
          <FavoriteButton match={match} user={user} />
        </div>

        {/* Tab 切換 */}
        <div className="match-tabs">
          <button 
            className={`tab-button ${activeTab === 'info' ? 'active' : ''}`}
            onClick={() => setActiveTab('info')}
          >
            📊 賽事資訊
          </button>
          <button 
            className={`tab-button ${activeTab === 'comments' ? 'active' : ''}`}
            onClick={() => setActiveTab('comments')}
          >
            💬 {isUpcoming ? '留言揪團' : '賽後討論'} ({match.commentCount || 0})
          </button>
        </div>

        {/* 賽事資訊 */}
        {activeTab === 'info' && (
          <div className="match-body">
            {isUpcoming ? (
              <>
                <div className="team-vs">
                  <span className="team-name">{match.homeTeam}</span>
                  <span className="vs">VS</span>
                  <span className="team-name">{match.awayTeam}</span>
                </div>
                <div className="time-location">
                  <p>📅 <strong>時間：</strong>{match.date} ({match.weekday}) {match.time}</p>
                  {match.location && (
                    <p>📍 <strong>地點：</strong>{match.location}</p>
                  )}
                </div>
                <div className="match-footer">
                  {/* 地圖按鈕 ✨ 新增 */}
                  {match.location && (
                    <button 
                      className="action-button map-btn"
                      onClick={() => setIsMapOpen(true)}
                    >
                      📍 地圖
                    </button>
                  )}
                  
                  {/* 原有的賽事詳情按鈕 */}
                  {match.url && (
                    <a 
                      href={match.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="action-button primary"
                    >
                      🎫 賽事詳情
                    </a>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="team-score team-home">
                  <span className="team-name">{match.homeTeam} (主)</span>
                  <span className="score-set">{match.homeScore}</span>
                </div>
                <div className="team-score team-away">
                  <span className="team-name">{match.awayTeam} (客)</span>
                  <span className="score-set">{match.awayScore}</span>
                </div>
                
                {match.setScores && (
                  <div className="set-details">
                    <span className="label">局數：</span>
                    {match.setScores.map((set, index) => (
                      <React.Fragment key={index}>
                        <span className="set">{set}</span>
                        {index < match.setScores.length - 1 && ', '}
                      </React.Fragment>
                    ))}
                  </div>
                )}

                <div className="match-footer">
                  {/* 地圖按鈕 ✨ 新增（已結束比賽也可以看地圖）*/}
                  {match.location && (
                    <button 
                      className="action-button map-btn"
                      onClick={() => setIsMapOpen(true)}
                    >
                      📍 地圖
                    </button>
                  )}

                  {/* 原有的完整戰報按鈕 */}
                  {match.url && (
                    <a 
                      href={match.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="action-button secondary"
                    >
                      📊 完整戰報
                    </a>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* 留言區 */}
        {activeTab === 'comments' && (
          <div className="comments-tab-content">
            <CommentSection matchId={match.id} user={user} />
          </div>
        )}
      </div>

      {/* 地圖 Modal ✨ 新增 */}
      {match.location && (
        <MatchLocationModal
          match={match}
          isOpen={isMapOpen}
          onClose={() => setIsMapOpen(false)}
        />
      )}
    </>
  );
};

export default MatchCard;
