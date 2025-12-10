import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <img src="/logo.jpg" alt="VOLLEY GO Logo" className="tiny-logo" />
      </div>
      
      <nav>
        <Link to="/">主頁</Link>
        <Link to="/matches">賽事總覽</Link>
        <Link to="/rules">AI 顧問</Link>
        <Link to="/videos">影音專區</Link>
        <Link to="/favorites">我的收藏</Link>
      </nav>
    </header>
  );
};

export default Header;