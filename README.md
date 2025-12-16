# 🏐 VolleyGo - 台灣排球資訊整合平台

> **All Volleyball Info, One Simple Platform**  
> 國立臺灣師範大學科技應用與人力資源發展學系 | 網際網路概論期末專題
> 
> 小組成員：41371101H 林書妤、41371107H 林家靖、41371127H 寸得育

## 🔗 重要連結

- **專題網站**: [https://one14-1-volleygo.onrender.com/](https://one14-1-volleygo.onrender.com/)
- **專題影片**: [https://youtu.be/JvZHsMg0NoM](https://youtu.be/JvZHsMg0NoM)
- 其他連結:
  -  [volleygo-api](https://github.com/shuuuuyu/114-1-volleygo-api)
  -  [https://one14-1-volleygo-api.onrender.com/docs](https://one14-1-volleygo-api.onrender.com/docs)
  - [volleygo-crawler](https://github.com/shuuuuyu/114-1-volleygo-crawler)
---
## 📖 專題簡介

VOLLEY GO 整合台灣職業排球聯盟 (TPVL) 與企業排球聯賽 (TVL) 的賽事資訊，結合 AI 智能助理、社群互動與自動化更新，為排球愛好者打造一站式資訊平台。

### 💡 解決的問題
- ❌ **賽事資訊分散** - TPVL 與 TVL 分別在不同網站
- ❌ **缺乏社群互動** - 無法揪團看比賽、討論賽事
- ❌ **規則查詢困難** - 新手球迷不熟悉排球規則

### ✅ 我們的解決方案
打造整合雙聯賽、AI 智能、社群互動的一站式平台

---

## ✨ 核心功能

| 功能 | 說明 |
|------|------|
| 🔥 **賽事整合** | 自動爬蟲整合 TPVL + TVL 雙聯賽資訊 |
| ⭐ **收藏提醒** | 收藏比賽並設定 Email 提醒通知 |
| 🤖 **AI 顧問** | RAG 技術 + Gemini AI 解答排球規則 |
| 📺 **影音專區** | YouTube API 自動搜尋精華影片 |
| 💬 **留言揪團** | 社群互動功能，討論賽事、揪團看球 |
| 🌤️ **天氣建議** | 整合氣象署 API，推薦打球天氣 |
| 🗺️ **地點導航** | Google Maps 顯示場館位置與導航 |

---

## 🛠️ 技術架構

### 前端技術
- **React 18 + Vite** - 現代化前端框架
- **React Router v6** - 頁面路由管理
- **React Hooks** - 狀態管理

### 後端服務
- **Supabase** - PostgreSQL 雲端資料庫 + Auth + Edge Functions
- **FastAPI** - 自架 AI 後端 (部署於 Render)
- **GitHub Actions** - 定時爬蟲自動更新賽事

### API 整合
- **Google Gemini AI** - 智能規則諮詢 (RAG + FAISS)
- **YouTube Data API** - 精華影片搜尋
- **Google Maps API** - 地圖與導航
- **中央氣象署 API** - 即時天氣資訊
- **Resend API** - Email 提醒通知(測試中)
---

## 🙏 致謝

感謝以下服務提供的技術支援：
- [Supabase](https://supabase.com/) - 資料庫與後端服務
- [Google](https://cloud.google.com/) - Gemini AI, YouTube API, Maps API
- [Resend](https://resend.com/) - 郵件發送服務
- [中央氣象署](https://www.cwa.gov.tw/) - 天氣資料 API
- [Render](https://render.com/) - 雲端部署平台

---

**⭐ 如果這個專題對你有幫助，歡迎給個 Star！**

🏐 **排球熱情，即刻出發！**
