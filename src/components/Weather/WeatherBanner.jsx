import React, { useState, useEffect } from 'react';
import { useWeather } from '../../hooks/useWeather';
import './WeatherBanner.css';

function WeatherBanner() {
  const [cityName, setCityName] = useState('臺北市');
  const [locationPermission, setLocationPermission] = useState(null);
  const { weatherData, loading, error } = useWeather(cityName);

  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // 使用 Google Maps Geocoding API 反查地址
  const getCityFromCoords = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${GOOGLE_MAPS_API_KEY}&language=zh-TW`
      );
      const data = await response.json();

      if (data.status === 'OK' && data.results.length > 0) {
        // 從地址組件中找出城市
        for (const result of data.results) {
          for (const component of result.address_components) {
            if (component.types.includes('administrative_area_level_1')) {
              return component.long_name; // 回傳縣市名稱
            }
          }
        }
      }
      
      return '臺北市'; // 預設
    } catch (error) {
      console.error('Google Maps API 錯誤:', error);
      return '臺北市';
    }
  };

  // 請求使用者位置
  const requestLocation = () => {
    if (!navigator.geolocation) {
      alert('您的瀏覽器不支援定位功能');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const detectedCity = await getCityFromCoords(latitude, longitude);
        setCityName(detectedCity);
        setLocationPermission('granted');
      },
      (error) => {
        console.error('定位失敗:', error);
        setLocationPermission('denied');
        alert('無法取得位置，將顯示台北市天氣');
      }
    );
  };

  // 頁面載入時自動請求位置
  useEffect(() => {
    requestLocation();
  }, []);

  // 判斷天氣類型（6 種分類）
  const getWeatherType = () => {
    const { description, minTemp, maxTemp, rainProbability } = weatherData;
    const descLower = description.toLowerCase();
    const rainChance = parseInt(rainProbability);

    // 1. 優先判斷：雷雨暴雨（最危險）
    if (descLower.includes('雷') || descLower.includes('暴雨') || descLower.includes('大雨')) {
      return 'stormy';
    }

    // 2. 炎熱天（> 32°C）
    if (parseInt(maxTemp) >= 32) {
      return 'hot';
    }

    // 3. 寒冷天（< 15°C）
    if (parseInt(minTemp) <= 15) {
      return 'cold';
    }

    // 4. 下雨天（降雨機率 > 50% 或描述含雨）
    if (rainChance > 50 || descLower.includes('雨')) {
      return 'rainy';
    }

    // 5. 晴朗舒適（無雨 + 溫度適中 20-28°C）
    const minT = parseInt(minTemp);
    const maxT = parseInt(maxTemp);
    if (rainChance < 30 && minT >= 20 && maxT <= 28 && 
        (descLower.includes('晴') || descLower.includes('sun'))) {
      return 'sunny';
    }

    // 6. 預設：多雲適中
    return 'cloudy';
  };

  // 問候語庫（每種天氣 3 個隨機選擇）
  const greetings = {
    sunny: [
      '完美的打球天氣！出門扣球去！',
      '天氣超讚！今天適合練習攻擊！',
      '好天氣！來場暢快的比賽吧！'
    ],
    cloudy: [
      '天氣還不錯，適合練習發球！',
      '多雲天氣剛剛好，出門打球吧！',
      '不熱不冷，最適合練習接球！'
    ],
    rainy: [
      '記得帶傘！場地濕滑，改天再打',
      '下雨天不適合打球，在家看比賽影片吧！',
      '雨天路滑危險，改練室內吧！'
    ],
    stormy: [
      '危險天氣！今天在家休息吧',
      '雷雨天氣，千萬別出門打球！',
      '暴雨來襲！安全第一，在家最好！'
    ],
    hot: [
      '天氣炎熱！記得多補水、注意防曬',
      '高溫警報！打球記得戴帽子、多喝水',
      '太陽好大！防曬乳擦好再出門！'
    ],
    cold: [
      '天氣有點冷，記得充分暖身！',
      '氣溫偏低，暖身要做好才不會受傷！',
      '天冷記得多穿一件，暖身再下場！'
    ]
  };

  // Emoji 圖示
  const emojis = {
    sunny: '☀️',
    cloudy: '🌤️',
    rainy: '🌧️',
    stormy: '⛈️',
    hot: '🥵',
    cold: '🥶'
  };

  // 隨機選擇問候語
  const getRandomGreeting = (type) => {
    const messages = greetings[type];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  if (loading) return <div className="weather-banner loading">載入天氣中...</div>;
  if (error) return null;

  const { description, minTemp, maxTemp, rainProbability } = weatherData;
  const weatherType = getWeatherType();
  const greeting = getRandomGreeting(weatherType);
  const emoji = emojis[weatherType];

  return (
    <div className={`weather-banner ${weatherType}-weather`}>
      <div className="weather-content">
        <span className="weather-emoji">{emoji}</span>
        <div className="weather-info">
          <p className="weather-message">{greeting}</p>
          <p className="weather-detail">
            {cityName} · {description} · {minTemp}°C - {maxTemp}°C · 降雨機率 {rainProbability}%
          </p>
          {locationPermission === 'denied' && (
            <button className="retry-location-btn" onClick={requestLocation}>
              📍 重新定位
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default WeatherBanner;