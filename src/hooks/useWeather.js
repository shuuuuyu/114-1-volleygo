import { useState, useEffect } from 'react';

// 使用 36 小時預報 API（支援 CORS）
const CWA_DATA_ID = 'F-C0032-001';

export function useWeather(cityName = '臺北市') {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const API_KEY = import.meta.env.VITE_CWA_API_KEY;

    if (!API_KEY) {
      setError('請在 .env 檔案中設定 VITE_CWA_API_KEY');
      setLoading(false);
      return;
    }

    const API_URL = `https://opendata.cwa.gov.tw/api/v1/rest/datastore/${CWA_DATA_ID}?Authorization=${API_KEY}&locationName=${encodeURIComponent(cityName)}`;

    fetch(API_URL)
      .then(response => {
        if (!response.ok) {
          throw new Error(`API 請求失敗，狀態碼: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        const location = data.records.location.find(loc => loc.locationName === cityName);
        
        if (!location) {
          setError('找不到該城市的天氣資料');
          setLoading(false);
          return;
        }

        const weatherElements = location.weatherElement;
        const weatherDesc = weatherElements.find(el => el.elementName === 'Wx')?.time[0]?.parameter?.parameterName || '資料載入中';
        const minTemp = weatherElements.find(el => el.elementName === 'MinT')?.time[0]?.parameter?.parameterName || '--';
        const maxTemp = weatherElements.find(el => el.elementName === 'MaxT')?.time[0]?.parameter?.parameterName || '--';
        const pop = weatherElements.find(el => el.elementName === 'PoP')?.time[0]?.parameter?.parameterName || '--';

        setWeatherData({
          description: weatherDesc,
          temperature: `${minTemp}°C - ${maxTemp}°C`,
          minTemp: minTemp,
          maxTemp: maxTemp,
          rainProbability: pop,
          cityName: location.locationName
        });
        
        setLoading(false);
      })
      .catch(err => {
        console.error('擷取天氣數據發生錯誤:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [cityName]);

  return { weatherData, loading, error };
}