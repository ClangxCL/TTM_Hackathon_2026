import { AmbientContext } from '../types/patient';

export interface LiveWeatherData {
  temperature_c: number;
  relative_humidity: number;
  precipitation_mm: number;
  wind_speed_kmh: number;
  weather_condition: string;
  is_live: boolean;
  timestamp: string;
}

export async function fetchLiveWeather(lat: number, lon: number): Promise<LiveWeatherData> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m`;
    const response = await fetch(url, { signal: AbortSignal.timeout(4000) });
    if (!response.ok) throw new Error('Weather API response error');
    
    const data = await response.json();
    const current = data.current;
    
    const temp = current.temperature_2m ?? 32.0;
    const hum = current.relative_humidity_2m ?? 60;
    const rain = current.precipitation ?? 0.0;
    const wind = current.wind_speed_10m ?? 10.0;
    
    let condition = 'แจ่มใส ลมสงบ';
    if (rain > 0.5) condition = 'มีฝนตก ความชื้นสูง';
    else if (temp >= 35) condition = 'แดดจัด ร้อนระอุ';
    else if (temp <= 22) condition = 'อากาศเย็นสบาย ลมหนาว';
    else if (wind > 20) condition = 'ลมพัดแรง';

    return {
      temperature_c: Math.round(temp * 10) / 10,
      relative_humidity: Math.round(hum),
      precipitation_mm: rain,
      wind_speed_kmh: Math.round(wind * 10) / 10,
      weather_condition: condition,
      is_live: true,
      timestamp: new Date().toLocaleTimeString('th-TH'),
    };
  } catch (error) {
    console.warn('[Open-Meteo] Live fetch failed or timeout, using case baseline context:', error);
    return {
      temperature_c: 32.5,
      relative_humidity: 65,
      precipitation_mm: 0,
      wind_speed_kmh: 8.0,
      weather_condition: 'จำลองสภาพอากาศปกติ (ออฟไลน์)',
      is_live: false,
      timestamp: new Date().toLocaleTimeString('th-TH'),
    };
  }
}

export function determineKalaPeriod(date: Date = new Date()): { period: string; dominant: string } {
  const hour = date.getHours();
  if (hour >= 6 && hour < 10) {
    return { period: '06:00 - 10:00 (ยาม 1)', dominant: 'อาโปธาตุ (เสมหะสมุฏฐาน)' };
  } else if (hour >= 10 && hour < 14) {
    return { period: '10:00 - 14:00 (ยาม 2)', dominant: 'เตโชธาตุ (ปิตตะสมุฏฐาน)' };
  } else if (hour >= 14 && hour < 18) {
    return { period: '14:00 - 18:00 (ยาม 3)', dominant: 'วาโยธาตุ (วาตะสมุฏฐาน)' };
  } else if (hour >= 18 && hour < 22) {
    return { period: '18:00 - 22:00 (ยาม 4)', dominant: 'อาโปธาตุ (เสมหะสมุฏฐาน)' };
  } else if (hour >= 22 || hour < 2) {
    return { period: '22:00 - 02:00 (ยาม 5)', dominant: 'เตโชธาตุ (ปิตตะสมุฏฐาน)' };
  } else {
    return { period: '02:00 - 06:00 (ยาม 6)', dominant: 'วาโยธาตุ (วาตะสมุฏฐาน)' };
  }
}
