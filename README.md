# 🏐 VolleyGo - 台灣排球資訊整合平台

[![React](https://img.shields.io/badge/React-18.x-61dafb?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646cff?logo=vite)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ecf8e?logo=supabase)](https://supabase.com/)

> 由國立臺灣師範大學科技應用與人力資源發展學系學生團隊開發的整合排球資訊平台

## 🌟 專案簡介

VOLLEY GO 透過自動化網路爬蟲技術,即時整合台灣職業排球聯盟 (TPVL) 與企業排球聯賽 (TVL) 的賽事數據,結合 AI 智能助理與社群互動功能,打造專屬於台灣排球愛好者的數位空間。

## ✨ 核心功能

- 🔥 **即時賽事資訊** - 整合 TPVL 與 TVL 最新賽事數據
- ⭐ **我的收藏** - 收藏喜愛的比賽與球隊,快速追蹤關注賽事
- 🤖 **AI 排球顧問** - 運用 RAG 技術與 Gemini AI 解答排球規則與戰術
- 📺 **精彩影音回顧** - 串接 YouTube API 呈現最新賽事精華
- 🌤️ **天氣資訊整合** - 串接中央氣象署 API,協助規劃打球行程
- 📧 **比賽提醒通知** - Gmail 登入後訂閱比賽提醒
- 🗺️ **地點導航** - 整合 Google Maps API 查看比賽地點

## 🛠️ 技術架構

### 前端
- **框架**: React 18 + Vite
- **語言**: JavaScript (ES6+)
- **狀態管理**: React Hooks
- **路由**: React Router v6
- **樣式**: CSS Modules

### 後端與資料庫
- **資料庫**: Supabase (PostgreSQL)
- **即時更新**: GitHub Actions 自動化爬蟲
- **無伺服器函數**: Supabase Edge Functions (Deno)
- **郵件服務**: Resend API

### AI 與 API 整合
- **AI 模型**: Google Gemini API
- **RAG 技術**: FastAPI + FAISS 向量資料庫
- **天氣資料**: 中央氣象署 API
- **影音服務**: YouTube Data API v3
- **地圖服務**: Google Maps API

## 🚀 快速開始

### 環境需求
- Node.js 18+ 
- npm 或 yarn

### 安裝步驟

1. **Clone 專案**
```bash
git clone https://github.com/你的帳號/volley-go.git
cd volley-go
```

2. **安裝依賴**
```bash
npm install
```

3. **設定環境變數**

建立 `.env` 檔案:
```env
VITE_SUPABASE_URL=你的Supabase網址
VITE_SUPABASE_ANON_KEY=你的Supabase金鑰
VITE_YOUTUBE_API_KEY=你的YouTube金鑰
VITE_GEMINI_API_KEY=你的Gemini金鑰
VITE_WEATHER_API_KEY=你的天氣API金鑰
VITE_GOOGLE_MAPS_API_KEY=你的Google Maps金鑰
```

4. **啟動開發伺服器**
```bash
npm run dev
```

5. **開啟瀏覽器**
```
http://localhost:5173
```

## 📦 部署

### 前端部署 (Render)
```bash
# Build 指令
npm run build

# 輸出目錄
dist/
```

### Edge Function 部署 (Supabase)
```bash
# 安裝 Supabase CLI
npm install -g supabase

# 部署函數
supabase functions deploy send-reminders
```

## 📁 專案結構
```
volley-go/
├── src/
│   ├── components/      # React 元件
│   ├── pages/          # 頁面元件
│   ├── services/       # API 服務層
│   ├── utils/          # 工具函數
│   └── App.jsx         # 主應用程式
├── public/             # 靜態資源
├── supabase/
│   └── functions/      # Edge Functions
├── index.html
├── vite.config.js
└── package.json
```

## 🎯 功能展示

### AI 排球顧問
採用「熱血裁判」人設,基於 Gemini API 與 RAG 技術,提供精準的排球規則查詢服務。

### 賽事自動更新
透過 GitHub Actions 定期執行爬蟲,自動更新 Supabase 資料庫中的賽事資訊。

### 智能提醒系統
使用者可設定比賽提醒,系統將在賽前自動發送 Email 通知。

## 👥 開發團隊

國立臺灣師範大學 科技應用與人力資源發展學系

## 📝 授權

本專案僅供學術研究與作品集展示使用。

## 🙏 致謝

感謝以下服務提供的技術支援:
- Supabase - 資料庫與後端服務
- Google - Gemini AI, YouTube API, Maps API
- Resend - 郵件發送服務
- 中央氣象署 - 天氣資料 API

## 📧 聯絡方式

如有任何問題或建議,歡迎透過以下方式聯繫:
- GitHub Issues: [專案 Issues 頁面]
- Email: [你的聯絡信箱]

---

⭐ 如果這個專案對你有幫助,歡迎給個 Star!