import React, { useState, useEffect } from 'react';
import { CloudSun, RefreshCw, Droplets, Wind, Thermometer, Wifi, WifiOff } from 'lucide-react';
import { fetchLiveWeather, LiveWeatherData } from '../../services/weatherService';

interface WeatherWidgetProps {
  latitude: number;
  longitude: number;
  locationName: string;
  onWeatherLoaded?: (weather: LiveWeatherData) => void;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({
  latitude,
  longitude,
  locationName,
  onWeatherLoaded,
}) => {
  const [weather, setWeather] = useState<LiveWeatherData | null>(null);
  const [loading, setLoading] = useState(false);

  const loadWeather = async () => {
    setLoading(true);
    const data = await fetchLiveWeather(latitude, longitude);
    setWeather(data);
    setLoading(false);
    if (onWeatherLoaded) onWeatherLoaded(data);
  };

  useEffect(() => {
    loadWeather();
  }, [latitude, longitude]);

  if (!weather) {
    return (
      <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl text-xs text-slate-500 animate-pulse">
        <CloudSun className="w-4 h-4 text-slate-400" />
        <span>กำลังเชื่อมต่อ Open-Meteo API...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 bg-white/90 backdrop-blur border border-slate-200/80 px-3 py-1.5 rounded-xl text-xs shadow-soft text-slate-700">
      <div className="flex items-center gap-1.5">
        <span className="font-medium text-slate-800">{locationName}</span>
        {weather.is_live ? (
          <span className="flex items-center gap-1 text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-medium border border-emerald-200">
            <Wifi className="w-2.5 h-2.5" /> Live Open-Meteo
          </span>
        ) : (
          <span className="flex items-center gap-1 text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded font-medium">
            <WifiOff className="w-2.5 h-2.5" /> ออฟไลน์
          </span>
        )}
      </div>

      <div className="h-3.5 w-px bg-slate-200" />

      <div className="flex items-center gap-1 font-semibold text-slate-900">
        <Thermometer className="w-3.5 h-3.5 text-orange-500" />
        <span>{weather.temperature_c}°C</span>
      </div>

      <div className="flex items-center gap-1 text-slate-600">
        <Droplets className="w-3.5 h-3.5 text-sky-500" />
        <span>{weather.relative_humidity}%</span>
      </div>

      <div className="hidden sm:flex items-center gap-1 text-slate-600">
        <Wind className="w-3.5 h-3.5 text-teal-600" />
        <span>{weather.wind_speed_kmh} km/h</span>
      </div>

      <button
        onClick={loadWeather}
        disabled={loading}
        title="รีเฟรชข้อมูลสภาพอากาศสด"
        className="text-slate-400 hover:text-brand-700 transition p-1 hover:bg-slate-100 rounded-lg ml-1"
      >
        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-brand-600' : ''}`} />
      </button>
    </div>
  );
};
