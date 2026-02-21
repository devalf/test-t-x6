import type { WeatherData } from '../../types/types';
import type { WeatherService } from '../weatherService';

interface WttrInResponse {
  current_condition: Array<{
    temp_C: string;
    FeelsLikeC: string;
    humidity: string;
    weatherDesc: Array<{ value: string }>;
    weatherCode: string;
    windspeedKmph: string;
  }>;
  nearest_area: Array<{
    areaName: Array<{ value: string }>;
  }>;
}

function getWeatherEmoji(code: number): string {
  if (code === 113) return '☀️';
  if (code === 116) return '⛅';
  if (code === 119 || code === 122) return '☁️';
  if ([143, 248, 260].includes(code)) return '🌫️';
  if ([200, 386, 389, 392, 395].includes(code)) return '⛈️';
  if ([179, 227, 230, 323, 326, 329, 332, 335, 338, 368, 371].includes(code)) return '🌨️';
  if ([182, 185, 281, 284, 311, 314, 317, 320, 350, 362, 365, 374, 377].includes(code)) return '🌨️';
  return '🌧️';
}

export const wttrInService: WeatherService = {
  config: {
    id: 'wttrin',
    displayName: 'WTTR',
    themeKey: 'wttrin',
  },

  async fetchWeather(location: string): Promise<WeatherData> {
    const url = `https://wttr.in/${encodeURIComponent(location)}?format=j1`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Location not found');
    }

    const data: WttrInResponse = await response.json();

    if (!data.current_condition?.length) {
      throw new Error('Location not found');
    }

    const current = data.current_condition[0];
    const area = data.nearest_area?.[0];

    return {
      location: area?.areaName?.[0]?.value ?? location,
      temperature: Math.round(parseFloat(current.temp_C) * 10) / 10,
      feelsLike: Math.round(parseFloat(current.FeelsLikeC) * 10) / 10,
      humidity: parseInt(current.humidity, 10),
      description: current.weatherDesc[0]?.value ?? 'Unknown',
      icon: getWeatherEmoji(parseInt(current.weatherCode, 10)),
      windSpeed: Math.round(parseFloat(current.windspeedKmph) * 10) / 10,
      provider: 'wttr.in',
    };
  },
};
