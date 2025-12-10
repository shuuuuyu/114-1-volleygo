// src/services/favoriteService.js
import { supabase } from './supabaseClient';

/**
 * 🎯 收藏服務 - 處理所有收藏相關的資料操作
 */

// ➕ 新增收藏
export const addFavorite = async (userId, matchId, matchData) => {
  try {
    const { data, error } = await supabase
      .from('favorites')
      .insert({
        user_id: userId,
        match_id: matchId,
        match_data: matchData
      })
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('新增收藏失敗:', error);
    return { success: false, error: error.message };
  }
};

// ➖ 取消收藏
export const removeFavorite = async (userId, matchId) => {
  try {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('match_id', matchId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('取消收藏失敗:', error);
    return { success: false, error: error.message };
  }
};

// 🔍 檢查是否已收藏
export const checkIsFavorited = async (userId, matchId) => {
  try {
    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('match_id', matchId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return !!data; // 有資料就是 true，沒資料就是 false
  } catch (error) {
    console.error('檢查收藏狀態失敗:', error);
    return false;
  }
};

// 📋 取得使用者的所有收藏
export const getUserFavorites = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('取得收藏清單失敗:', error);
    return { success: false, error: error.message, data: [] };
  }
};

export const setEmailReminder = async (userId, matchId, matchData, minutesBefore = 60) => {
  try {
    // 計算提醒時間
    const matchDateTime = new Date(matchData.date + ' ' + matchData.time);
    const remindAt = new Date(matchDateTime.getTime() - minutesBefore * 60000);

    const { data, error } = await supabase
      .from('email_reminders')
      .insert({
        user_id: userId,
        match_id: matchId,
        match_data: matchData,
        remind_at: remindAt.toISOString(),
        sent: false
      })
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('設定提醒失敗:', error);
    return { success: false, error: error.message };
  }
};

// 🗑️ 取消 Email 提醒
export const removeEmailReminder = async (userId, matchId) => {
  try {
    const { error } = await supabase
      .from('email_reminders')
      .delete()
      .eq('user_id', userId)
      .eq('match_id', matchId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('取消提醒失敗:', error);
    return { success: false, error: error.message };
  }
};

// 🔍 檢查是否已設定提醒
export const checkHasReminder = async (userId, matchId) => {
  try {
    const { data, error } = await supabase
      .from('email_reminders')
      .select('id')
      .eq('user_id', userId)
      .eq('match_id', matchId)
      .eq('sent', false)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return !!data;
  } catch (error) {
    console.error('檢查提醒狀態失敗:', error);
    return false;
  }
};