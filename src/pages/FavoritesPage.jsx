// src/pages/FavoritesPage.jsx
import React, { useState, useEffect } from 'react';
import MatchCard from '../components/Match/MatchCard';
import { getUserFavorites } from '../services/favoriteService';
import './FavoritesPage.css';

const FavoritesPage = ({ user }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadFavorites();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadFavorites = async () => {
    setLoading(true);
    try {
      const result = await getUserFavorites(user.id);
      if (result.success) {
        setFavorites(result.data);
      }
    } catch (error) {
      console.error('載入收藏失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  // 未登入狀態
  if (!user) {
    return (
      <div className="favorites-page">
        <div className="empty-state">
          <h2>🔒 請先登入</h2>
          <p>登入後即可查看你的收藏賽事</p>
        </div>
      </div>
    );
  }

  // 載入中
  if (loading) {
    return (
      <div className="favorites-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>載入收藏中...</p>
        </div>
      </div>
    );
  }

  // 沒有收藏
  if (favorites.length === 0) {
    return (
      <div className="favorites-page">
        <div className="empty-state">
          <h2>📭 還沒有收藏</h2>
          <p>快去賽事頁面收藏你感興趣的比賽吧！</p>
          <a href="/matches" className="go-matches-btn">
            前往賽事頁面
          </a>
        </div>
      </div>
    );
  }

  // 顯示收藏清單
  return (
    <div className="favorites-page">
      <section className="favorites-header">
        <h2>我的收藏</h2>
        <p className="favorites-subtitle">共 {favorites.length} 場比賽</p>
      </section>

      <div className="favorites-list">
        {favorites.map(favorite => (
          <MatchCard 
            key={favorite.match_id} 
            match={favorite.match_data} 
            user={user}
          />
        ))}
      </div>
    </div>
  );
};

export default FavoritesPage;