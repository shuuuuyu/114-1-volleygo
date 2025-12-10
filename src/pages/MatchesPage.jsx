import React, { useState, useEffect } from 'react';
import MatchCard from '../components/Match/MatchCard';
import Login from '../components/Auth/Login';
import { getAllMatches, getUpcomingMatches, getFinishedMatches, getCommentCount } from '../services/matchService';
import './MatchesPage.css';
import { supabase } from '../services/supabaseClient'

const MatchesPage = ({ user, setUser }) => {
  const [allMatches, setAllMatches] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [finishedMatches, setFinishedMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 篩選狀態
  const [leagueFilter, setLeagueFilter] = useState('all'); // 'all', 'TPVL', 'TVL'
  const [genderFilter, setGenderFilter] = useState('all'); // 'all', 'male', 'female'
  
  useEffect(() => {
    loadMatches();
  }, []);

const loadMatches = async () => {
  setLoading(true);
  try {
    console.log('🔄 開始載入比賽資料...');
    const matches = await getAllMatches();
    console.log('✅ 取得的比賽資料:', matches);
    console.log('📊 比賽總數:', matches.length);
    
    // 為每場比賽取得留言數
    const matchesWithComments = await Promise.all(
      matches.map(async (match) => {
        const commentCount = await getCommentCount(match.id);
        return { ...match, commentCount };
      })
    );

    console.log('💬 加上留言數後:', matchesWithComments);

    setAllMatches(matchesWithComments);
    
    const upcoming = getUpcomingMatches(matchesWithComments);
    const finished = getFinishedMatches(matchesWithComments);
    
    console.log('📅 未來比賽:', upcoming.length, '場');
    console.log('📊 已結束比賽:', finished.length, '場');
    
    setUpcomingMatches(upcoming);
    setFinishedMatches(finished);
  } catch (error) {
    console.error('❌ 載入比賽時發生錯誤:', error);
  } finally {
    setLoading(false);
  }
};

  // 篩選邏輯
  const filterMatches = (matches) => {
    return matches.filter(match => {
      const leagueMatch = leagueFilter === 'all' || match.league === leagueFilter;
      const genderMatch = genderFilter === 'all' || match.gender === genderFilter;
      return leagueMatch && genderMatch;
    });
  };

  const filteredUpcoming = filterMatches(upcomingMatches);
  const filteredFinished = filterMatches(finishedMatches);

  if (loading) {
    return (
      <div className="matches-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>載入比賽資料中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="matches-page">
      <Login user={user} setUser={setUser} />
      
      <section className="matches-header">
        <h2>🔥 最新賽事報告</h2>
        <p className="matches-subtitle">追蹤台灣職業與企業排球聯賽的最新動態</p>
      </section>

      {/* 篩選器 */}
      <div className="filter-section">
        <div className="filter-group">
          <button
            className={`filter-btn ${leagueFilter === 'all' ? 'active' : ''}`}
            onClick={() => setLeagueFilter('all')}
          >
            全部聯賽
          </button>
          <button
            className={`filter-btn ${leagueFilter === 'TPVL' ? 'active' : ''}`}
            onClick={() => setLeagueFilter('TPVL')}
          >
            TPVL 職業
          </button>
          <button
            className={`filter-btn ${leagueFilter === 'TVL' ? 'active' : ''}`}
            onClick={() => setLeagueFilter('TVL')}
          >
            TVL 企業
          </button>
        </div>

        <div className="filter-group">
          <button
            className={`filter-btn ${genderFilter === 'all' ? 'active' : ''}`}
            onClick={() => setGenderFilter('all')}
          >
            男女排
          </button>
          <button
            className={`filter-btn ${genderFilter === 'male' ? 'active' : ''}`}
            onClick={() => setGenderFilter('male')}
          >
            🏐 男排
          </button>
          <button
            className={`filter-btn ${genderFilter === 'female' ? 'active' : ''}`}
            onClick={() => setGenderFilter('female')}
          >
            🏐 女排
          </button>
        </div>
      </div>

      {/* 未來一週賽事 */}
      {filteredUpcoming.length > 0 && (
        <>
          <section className="section-title">
            <h3>📅 未來一週賽事（可揪團）</h3>
            <span className="match-count">{filteredUpcoming.length} 場比賽</span>
          </section>
          <div className="match-list">
            {filteredUpcoming.map(match => (
              <MatchCard key={match.id} match={match} user={user} />
            ))}
          </div>
        </>
      )}

      {/* 已結束賽事 */}
      {filteredFinished.length > 0 && (
        <>
          <section className="section-title finished-section">
            <h3>📊 已結束賽事（可討論）</h3>
            <span className="match-count">{filteredFinished.length} 場比賽</span>
          </section>
          <div className="match-list">
            {filteredFinished.map(match => (
              <MatchCard key={match.id} match={match} user={user} />
            ))}
          </div>
        </>
      )}

      {/* 無資料提示 */}
      {filteredUpcoming.length === 0 && filteredFinished.length === 0 && (
        <div className="no-matches">
          <p>🔍 沒有符合條件的比賽</p>
        </div>
      )}
    </div>
  );
};

export default MatchesPage;