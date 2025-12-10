import React from 'react';
import { X, Navigation, MapPin } from 'lucide-react';
import './MatchLocationModal.css';

function MatchLocationModal({ match, isOpen, onClose }) {
  if (!isOpen) return null;

  // ✅ 使用正確的欄位名稱
  const { location, homeTeam, awayTeam, date, weekday, time } = match;
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // Google Maps Embed URL
  const mapEmbedUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(location)}`;

  // Google Maps 導航 URL
  const navigationUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location)}`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title">
            <MapPin size={24} />
            <h2>比賽地點</h2>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* 比賽資訊 */}
        <div className="match-info">
          <h3>{homeTeam} vs {awayTeam}</h3>
          <p className="match-datetime">
            📅 {date} ({weekday}) {time}
          </p>
          <p className="match-location">
            <MapPin size={16} />
            {location}
          </p>
        </div>

        {/* Google Maps 嵌入地圖 */}
        <div className="map-container">
          <iframe
            src={mapEmbedUrl}
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`${location} 地圖`}
          />
        </div>

        {/* 導航按鈕 */}
        <div className="modal-actions">
          <a
            href={navigationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="navigate-btn"
          >
            <Navigation size={20} />
            導航至球場
          </a>
        </div>
      </div>
    </div>
  );
}

export default MatchLocationModal;
