import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage';
import MatchesPage from './pages/MatchesPage';
import RulesPage from './pages/RulesPage';
import VideoPage from './pages/VideoPage';
import FavoritesPage from './pages/FavoritesPage';
import { supabase } from './services/supabaseClient';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 檢查是否有登入的使用者
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) setUser(user);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="matches" element={<MatchesPage user={user} setUser={setUser} />} />
          <Route path="/favorites" element={<FavoritesPage user={user} />} />
          <Route path="rules" element={<RulesPage />} />
          <Route path="videos" element={<VideoPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;