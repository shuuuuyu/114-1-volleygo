import React, { useState } from 'react';
import { LogIn, LogOut, UserPlus } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';
import './Login.css';

const Login = ({ user, setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    setLoading(true);
    try {
      if (isLogin) {
        // 登入
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        setUser(data.user);
        alert('登入成功!');
        setEmail('');
        setPassword('');
      } else {
        // 註冊
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (error) throw error;
        
        alert('註冊成功!請檢查 Email 確認信箱');
        setEmail('');
        setPassword('');
      }
    } catch (error) {
      alert('錯誤: ' + error.message);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <div className="auth-container">
      {/* 頭部 - 顯示使用者狀態 */}
      {user && (
        <div className="auth-header">
          <div className="user-info">
            <p className="user-email">✓ 已登入: {user.email}</p>
          </div>
          <button onClick={handleLogout} className="logout-button">
            <LogOut size={18} />
            登出
          </button>
        </div>
      )}

      {/* 登入/註冊表單 */}
      {!user && (
        <div className="auth-form">
          <div className="auth-tabs">
            <button
              onClick={() => setIsLogin(true)}
              className={`auth-tab ${isLogin ? 'active' : ''}`}
            >
              <LogIn className="inline mr-2" size={18} />
              登入
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`auth-tab ${!isLogin ? 'active' : ''}`}
            >
              <UserPlus className="inline mr-2" size={18} />
              註冊
            </button>
          </div>
          
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input"
          />
          <input
            type="password"
            placeholder="密碼 (至少6個字元)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="auth-input"
          />
          <button
            onClick={handleAuth}
            disabled={loading}
            className="auth-submit"
          >
            {loading ? '處理中...' : isLogin ? '登入' : '註冊'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Login;