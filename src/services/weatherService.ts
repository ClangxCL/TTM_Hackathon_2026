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
  if (hour >= 6 && hour < 9) {
    return { period: '06:00 - 09:00 (เสมหะกาล)', dominant: 'อาโปธาตุ (เสมหะสมุฏฐาน)' };
  } else if (hour >= 9 && hour < 12) {
    return { period: '09:00 - 12:00 (โลหิตกาล)', dominant: 'อาโป/เตโชธาตุ (โลหิตสมุฏฐาน)' };
  } else if (hour >= 12 && hour < 15) {
    return { period: '12:00 - 15:00 (ปิตตะกาล)', dominant: 'เตโชธาตุ (ปิตตะสมุฏฐาน)' };
  } else if (hour >= 15 && hour < 18) {
    return { period: '15:00 - 18:00 (วาตะกาล)', dominant: 'วาโยธาตุ (วาตะสมุฏฐาน)' };
  } else if (hour >= 18 && hour < 21) {
    return { period: '18:00 - 21:00 (เสมหะกาล 2)', dominant: 'อาโปธาตุ (เสมหะสมุฏฐาน)' };
  } else if (hour >= 21 || hour < 0) {
    return { period: '21:00 - 24:00 (โลหิตกาล 2)', dominant: 'อาโป/เตโชธาตุ (โลหิตสมุฏฐาน)' };
  } else if (hour >= 0 && hour < 3) {
    return { period: '00:00 - 03:00 (ปิตตะกาล 2)', dominant: 'เตโชธาตุ (ปิตตะสมุฏฐาน)' };
  } else {
    return { period: '03:00 - 06:00 (วาตะกาล 2)', dominant: 'วาโยธาตุ (วาตะสมุฏฐาน)' };
  }
}
