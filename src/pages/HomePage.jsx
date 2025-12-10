import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';
import WeatherBanner from '../components/Weather/WeatherBanner';

const HomePage = () => {
  return (
    <div className="home-page">
      <WeatherBanner cityName="臺北市" />
      <section className="hero">
        <h1>VOLLEY GO：排球熱情，即刻出發！</h1>
        <p>匯集職業/企業賽事資訊、球友交流與排球知識的平台。</p>
      </section>

      <section className="intro-section">
        <div className="intro-grid">
          <div className="intro-card">
            <div className="intro-icon">🔥</div>
            <h3>即時賽事資訊</h3>
            <p>整合台灣職業排球聯盟（TPVL）與企業排球聯賽（TVL）的最新賽事數據，讓你不錯過任何精彩對決。</p>
            <Link to="/matches" className="intro-link">查看賽事 →</Link>
          </div>

          <div className="intro-card">
            <div className="intro-icon">⭐</div>
            <h3>我的收藏</h3>
            <p>收藏喜愛的比賽與球隊，快速追蹤關注賽事，打造專屬你的排球資訊中心。</p>
            <Link to="/favorites" className="intro-link">查看收藏 →</Link>
          </div>

          <div className="intro-card">
            <div className="intro-icon">🤖</div>
            <h3>AI 排球顧問</h3>
            <p>運用 RAG 技術與 Gemini AI，隨時為你解答排球規則、戰術分析與賽事數據查詢。</p>
            <Link to="/rules" className="intro-link">諮詢 AI →</Link>
          </div>

          <div className="intro-card">
            <div className="intro-icon">📺</div>
            <h3>精彩影音回顧</h3>
            <p>收錄職業賽事精華片段、球員專訪與戰術解析影片，深入了解排球魅力。</p>
            <Link to="/videos" className="intro-link">觀看影片 →</Link>
          </div>
        </div>
      </section>

      <section className="about-platform">
        <h2>About Us</h2>
        <div className="about-content">
          <p>
            VOLLEY GO 是由國立臺灣師範大學科技應用與人力資源發展學系學生團隊開發的整合排球資訊平台。
            我們透過自動化網路爬蟲技術，即時整合台灣職業與企業排球賽事數據，
            結合 AI 智能助理與社群互動功能，打造專屬於台灣排球愛好者的數位空間。
          </p>
          <h3>核心功能</h3>
          <div className="feature-section">
            <p>
              天氣資訊整合：串接中央氣象署 API，提供即時天氣資訊,協助使用者規劃打球行程。
            </p>
            <p>
              賽事總覽與互動：連結 Supabase 資料庫,透過 GitHub Actions 定期自動更新賽事資料。
              使用者可在貼文區討論賽事、揪團觀賽，並使用 Gmail 登入後訂閱比賽提醒通知。
              整合 Google Maps API，輕鬆查看比賽地點。
            </p>
            <p>
              AI 排球顧問：採用「熱血裁判」人設的 AI 助理，基於 Gemini API、FastAPI 架構，
              搭載 RAG 技術與 FAISS 向量資料庫，提供精準的排球規則與知識查詢服務。
            </p>
            <p>
              影音專區：串接 YouTube API,即時呈現最新熱門的賽事精華影片。
            </p>
            <p className="closing-text">
            無論你是資深球迷、業餘球員或排球新手，都能在 VOLLEY GO 找到你需要的賽事資訊與排球知識。
          </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;