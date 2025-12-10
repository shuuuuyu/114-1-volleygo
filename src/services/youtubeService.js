// YouTube Data API v3 服務層

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const API_BASE_URL = 'https://www.googleapis.com/youtube/v3';

/**
 * 搜尋精華影片 - 針對 TPVL 女排精華
 * @param {number} maxResults - 最多回傳幾筆
 * @returns {Promise<Array>} 影片列表
 */
export const searchHighlightVideos = async (maxResults = 6) => {
  try {
    // 限制最近 2 個月的影片
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
    const publishedAfter = twoMonthsAgo.toISOString();
    
    // 針對 TPVL 精華影片的關鍵字
    const query = encodeURIComponent('TPVL 好球集錦');
    
    const response = await fetch(
      `${API_BASE_URL}/search?` +
      `part=snippet&` +
      `q=${query}&` +
      `type=video&` +
      `maxResults=${maxResults}&` +
      `order=date&` +  // 按日期排序
      `publishedAfter=${publishedAfter}&` +
      `key=${YOUTUBE_API_KEY}`
    );

    if (!response.ok) {
      throw new Error('YouTube API 請求失敗');
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return [];
    }

    // 過濾：只保留標題包含「好球集錦」或「精華」的影片
    const filteredItems = data.items.filter(item => {
      const title = item.snippet.title.toLowerCase();
      return title.includes('好球集錦') || 
             title.includes('精華') || 
             title.includes('highlights') ||
             title.includes('super spike');
    });

    return filteredItems.map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.medium.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
    }));

  } catch (error) {
    console.error('YouTube API Error:', error);
    return [];
  }
};

/**
 * 搜尋隊伍相關影片 - 包含完整比賽和精華
 * @param {string} teamName - 隊伍名稱
 * @param {number} maxResults - 最多回傳幾筆
 * @returns {Promise<Array>} 影片列表
 */
export const searchTeamVideos = async (teamName, maxResults = 6) => {
  try {
    // 限制最近 3 個月的影片
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    const publishedAfter = threeMonthsAgo.toISOString();
    
    // 搜尋關鍵字：隊伍名稱 + 排球聯賽相關
    const query = encodeURIComponent(`${teamName} 排球`);
    
    const response = await fetch(
      `${API_BASE_URL}/search?` +
      `part=snippet&` +
      `q=${query}&` +
      `type=video&` +
      `maxResults=${Math.min(maxResults * 2, 20)}&` +  // 多抓一些來過濾
      `order=date&` +
      `publishedAfter=${publishedAfter}&` +
      `key=${YOUTUBE_API_KEY}`
    );

    if (!response.ok) {
      throw new Error('YouTube API 請求失敗');
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return [];
    }

    // 過濾：排除非比賽相關的影片
    const filteredItems = data.items.filter(item => {
      const title = item.snippet.title.toLowerCase();
      const teamLower = teamName.toLowerCase();
      
      // 必須包含隊伍名稱
      if (!title.includes(teamLower)) return false;
      
      // 排除訓練、花絮等非比賽影片
      const excludeKeywords = ['訓練', '練習', '專訪', '採訪', '幕後'];
      if (excludeKeywords.some(keyword => title.includes(keyword))) return false;
      
      return true;
    }).slice(0, maxResults);  // 限制回傳數量

    return filteredItems.map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.medium.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
    }));

  } catch (error) {
    console.error('YouTube API Error:', error);
    return [];
  }
};

/**
 * 通用搜尋功能
 * @param {string} searchQuery - 搜尋關鍵字
 * @param {number} maxResults - 最多回傳幾筆
 * @returns {Promise<Array>} 影片列表
 */
export const searchVideos = async (searchQuery, maxResults = 9) => {
  try {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    const publishedAfter = threeMonthsAgo.toISOString();
    
    const query = encodeURIComponent(searchQuery);
    
    const response = await fetch(
      `${API_BASE_URL}/search?` +
      `part=snippet&` +
      `q=${query}&` +
      `type=video&` +
      `maxResults=${maxResults}&` +
      `order=date&` +
      `publishedAfter=${publishedAfter}&` +
      `key=${YOUTUBE_API_KEY}`
    );

    if (!response.ok) {
      throw new Error('YouTube API 請求失敗');
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return [];
    }

    return data.items.map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.medium.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
    }));

  } catch (error) {
    console.error('YouTube API Error:', error);
    return [];
  }
};

/**
 * 搜尋比賽相關影片（保留原有功能）
 */
export const searchMatchVideos = async (match) => {
  try {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    const publishedAfter = oneYearAgo.toISOString();
    
    const query = encodeURIComponent(`${match.home_team} vs ${match.away_team} 排球`);
    
    const response = await fetch(
      `${API_BASE_URL}/search?` +
      `part=snippet&` +
      `q=${query}&` +
      `type=video&` +
      `maxResults=3&` +
      `order=date&` +
      `publishedAfter=${publishedAfter}&` +
      `key=${YOUTUBE_API_KEY}`
    );

    if (!response.ok) {
      throw new Error('YouTube API 請求失敗');
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return [];
    }

    return data.items.map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.medium.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
    }));

  } catch (error) {
    console.error('YouTube API Error:', error);
    return [];
  }
};