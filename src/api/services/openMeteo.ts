import type { WeatherData } from '../../types/types';
import type { WeatherService } from '../weatherService';

interface GeocodingResult {
  results?: Array<{
    name: string;
    latitude: number;
    longitude: number;
  }>;
}

interface OpenMeteoResponse {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    weather_code: number;
    wind_speed_10m: number;
  };
}

const wmoDescriptions: Record<number, string> = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  56: 'Light freezing drizzle',
  57: 'Dense freezing drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  66: 'Light freezing rain',
  67: 'Heavy freezing rain',
  71: 'Slight snow fall',
  73: 'Moderate snow fall',
  75: 'Heavy snow fall',
  77: 'Snow grains',
  80: 'Slight rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  85: 'Slight snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with slight hail',
  99: 'Thunderstorm with heavy hail',
};

function getWmoDescription(code: number): string {
  return wmoDescriptions[code] ?? 'Unknown';
}

function getWmoIcon(code: number): string {
  if (code === 0) return '☀️';
  if (code <= 2) return '⛅';
  if (code === 3) return '☁️';
  if (code <= 48) return '🌫️';
  if (code <= 67) return '🌧️';
  if (code <= 86) return '🌨️';
  return '⛈️';
}

export const openMeteoService: WeatherService = {
  config: {
    id: 'openmeteo',
    displayName: 'Open-Meteo',
    themeKey: 'openmeteo',
  },

  async fetchWeather(location: string): Promise<WeatherData> {
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`;

    const geoResponse = await fetch(geoUrl);
    if (!geoResponse.ok) {
      throw new Error('Failed to geocode location');
    }

    const geoData: GeocodingResult = await geoResponse.json();
    if (!geoData.results?.length) {
      throw new Error('Location not found');
    }

    const { name, latitude, longitude } = geoData.results[0];

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m`;

    const weatherResponse = await fetch(weatherUrl);
    if (!weatherResponse.ok) {
      throw new Error('Failed to fetch weather data');
    }

    const data: OpenMeteoResponse = await weatherResponse.json();

    return {
      location: name,
      temperature: Math.round(data.current.temperature_2m * 10) / 10,
      feelsLike: Math.round(data.current.apparent_temperature * 10) / 10,
      humidity: data.current.relative_humidity_2m,
      description: getWmoDescription(data.current.weather_code),
      icon: getWmoIcon(data.current.weather_code),
      windSpeed: Math.round(data.current.wind_speed_10m * 10) / 10,
      provider: 'Open-Meteo',
    };
  },
};
