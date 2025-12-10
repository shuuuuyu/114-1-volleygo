import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import './FavoriteButton.css';

const FavoriteButton = ({ match, user }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [hasReminder, setHasReminder] = useState(false);
  const [showReminderMenu, setShowReminderMenu] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      checkFavoriteStatus();
      checkReminderStatus();
    }
  }, [user, match.id]);

  // 檢查是否已收藏
  const checkFavoriteStatus = async () => {
    const { data } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('match_id', match.id)
      .single();
    
    setIsFavorite(!!data);
  };

  // 檢查是否已設定提醒
  const checkReminderStatus = async () => {
    const { data } = await supabase
      .from('email_reminders')
      .select('id')
      .eq('user_id', user.id)
      .eq('match_id', match.id)
      .eq('sent', false)
      .single();
    
    setHasReminder(!!data);
  };

  // 收藏/取消收藏
  const toggleFavorite = async () => {
    if (!user) {
      alert('請先登入！');
      return;
    }

    setLoading(true);
    try {
      if (isFavorite) {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('match_id', match.id);
        
        setIsFavorite(false);
      } else {
        await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            match_id: match.id,
            match_data: match
          });
        
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('收藏操作失敗:', error);
      alert('操作失敗，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  // 設定提醒
  const setReminder = async (hoursBefore) => {
    if (!user) {
      alert('請先登入！');
      return;
    }

    setLoading(true);
    try {
      // 計算提醒時間
      const matchDateTime = new Date(`${match.date} ${match.time}`);
      const remindTime = new Date(matchDateTime.getTime() - hoursBefore * 60 * 60 * 1000);

      await supabase
        .from('email_reminders')
        .insert({
          user_id: user.id,
          match_id: match.id,
          match_data: {
            id: match.id,
            homeTeam: match.homeTeam,
            awayTeam: match.awayTeam,
            date: match.date,
            time: match.time,
            location: match.location,
            league: match.league,
            gender: match.gender,
            url: match.url
          },
          remind_at: remindTime.toISOString(),
          sent: false
        });
      
      setHasReminder(true);
      setShowReminderMenu(false);
      
      const timeText = hoursBefore === 24 ? '1 天前' : 
                       hoursBefore === 2 ? '2 小時前' : 
                       '1 小時前';
      alert(`已設定提醒！將在比賽 ${timeText} 寄送郵件`);
    } catch (error) {
      console.error('提醒操作失敗:', error);
      alert('操作失敗，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  // 取消提醒
  const removeReminder = async () => {
    setLoading(true);
    try {
      await supabase
        .from('email_reminders')
        .delete()
        .eq('user_id', user.id)
        .eq('match_id', match.id)
        .eq('sent', false);
      
      setHasReminder(false);
      setShowReminderMenu(false);
      alert('已取消比賽提醒');
    } catch (error) {
      console.error('取消提醒失敗:', error);
      alert('操作失敗，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="favorite-button-container">
      {/* 收藏按鈕 */}
      <button
        onClick={toggleFavorite}
        disabled={loading}
        className={`favorite-button ${isFavorite ? 'favorited' : ''}`}
      >
        {isFavorite ? '⭐ 已收藏' : '☆ 收藏'}
        {hasReminder && <span className="reminder-badge">🔔</span>}
      </button>

      {/* 提醒選單按鈕 - 只在未來賽事顯示 */}
      {match.status === 'upcoming' && (
        <>
          <button
            onClick={() => setShowReminderMenu(!showReminderMenu)}
            disabled={loading}
            className="reminder-menu-button"
            title="設定郵件提醒"
          >
            ⏰
          </button>

          {/* 下拉選單 */}
          {showReminderMenu && (
            <div className="reminder-menu">
              <div className="reminder-menu-header">
                📧 郵件提醒設定
              </div>
              
              {!hasReminder ? (
                <>
                  <button onClick={() => setReminder(24)}>
                    📅 比賽前 1 天
                  </button>
                  <button onClick={() => setReminder(2)}>
                    ⏰ 比賽前 2 小時
                  </button>
                  <button onClick={() => setReminder(1)}>
                    🔔 比賽前 1 小時
                  </button>
                </>
              ) : (
                <button 
                  onClick={removeReminder}
                  className="remove-reminder"
                >
                  ❌ 取消提醒
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FavoriteButton;