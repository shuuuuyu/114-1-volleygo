import { supabase } from './supabaseClient';

// 取得隊伍名稱映射
const getTeamMapping = async () => {
  const { data, error } = await supabase
    .from('tpvl_teams')
    .select('id, name');
  
  if (error) {
    console.error('Error fetching teams:', error);
    return {};
  }
  
  if (!data || data.length === 0) {
    console.warn('⚠️ 沒有找到隊伍資料');
    return {};
  }
  
  // 🔧 修復：加上初始值 {}
  return data.reduce((acc, team) => {
    acc[team.id] = team.name;
    return acc;  // 記得 return
  }, {}); // ← 這裡是關鍵！加上空物件作為初始值
};

// 取得 TPVL 比賽資料
const getTPVLMatches = async () => {
  console.log('📥 正在抓取 TPVL 資料...');
  
  const { data, error } = await supabase
    .from('tpvl_matches')
    .select('*')
    .order('match_date', { ascending: false });

  if (error) {
    console.error('❌ TPVL 錯誤:', error);
    return [];
  }

  console.log('✅ TPVL 原始資料:', data);
  console.log('📊 TPVL 比賽數量:', data?.length || 0);

  const teamMap = await getTeamMapping();
  console.log('👥 隊伍映射:', teamMap);

  const processed = data.map(match => ({
    id: `tpvl_${match.id}`,
    originalId: match.id,
    league: 'TPVL',
    gender: 'male',
    homeTeam: teamMap[match.home_team_id] || '未知隊伍',
    awayTeam: teamMap[match.away_team_id] || '未知隊伍',
    homeScore: match.home_score,
    awayScore: match.away_score,
    date: match.match_date,
    time: match.match_time,
    weekday: match.weekday,
    location: match.venue,
    status: match.status === 'completed' ? 'finished' : 'upcoming',
    setScores: null,
    url: null
  }));

  console.log('✅ TPVL 處理後資料範例:', processed[0]);
  return processed;
};

// 取得 TVL 比賽資料
const getTVLMatches = async () => {
  console.log('📥 正在抓取 TVL 資料...');
  
  const { data, error } = await supabase
    .from('tvl_matches')
    .select('*')
    .order('match_date', { ascending: false });

  if (error) {
    console.error('❌ TVL 錯誤:', error);
    return [];
  }

  console.log('✅ TVL 原始資料:', data);
  console.log('📊 TVL 比賽數量:', data?.length || 0);

  const processed = data.map(match => ({
    id: `tvl_${match.id}`,
    originalId: match.id,
    league: 'TVL',
    gender: match.gender,
    homeTeam: match.home_team_name,
    awayTeam: match.away_team_name,
    homeScore: match.home_score,
    awayScore: match.away_score,
    date: match.match_date,
    time: match.match_time,
    location: null,
    status: match.status === 'finished' ? 'finished' : 'upcoming',
    setScores: match.set_scores ? match.set_scores.split(', ') : null,
    url: match.url
  }));

  console.log('✅ TVL 處理後資料範例:', processed[0]);
  return processed;
};

// 取得所有比賽（合併 TPVL + TVL）
export const getAllMatches = async () => {
  const [tpvlMatches, tvlMatches] = await Promise.all([
    getTPVLMatches(),
    getTVLMatches()
  ]);

  return [...tpvlMatches, ...tvlMatches].sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });
};

// 取得未來一週的比賽
export const getUpcomingMatches = (matches) => {
  const now = new Date();
  const oneWeekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  return matches.filter(match => {
    if (match.status !== 'upcoming') return false;
    const matchDate = new Date(match.date);
    return matchDate >= now && matchDate <= oneWeekLater;
  });
};

// 取得已結束的比賽
export const getFinishedMatches = (matches) => {
  return matches.filter(match => match.status === 'finished');
};

// 取得某場比賽的留言數
export const getCommentCount = async (matchId) => {
  const { count, error } = await supabase
    .from('comments')
    .select('*', { count: 'exact', head: true })
    .eq('post_id', matchId);

  if (error) {
    console.error('Error counting comments:', error);
    return 0;
  }

  return count || 0;
};