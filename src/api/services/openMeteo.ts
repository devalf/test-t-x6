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
  const svg = (content: string) =>
    `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E${encodeURIComponent(content)}%3C/svg%3E`;

  if (code === 0)
    return svg(
      `<circle cx='32' cy='32' r='12' fill='%23FBBF24'/><g stroke='%23FBBF24' stroke-width='2.5' stroke-linecap='round'><line x1='32' y1='8' x2='32' y2='16'/><line x1='32' y1='48' x2='32' y2='56'/><line x1='8' y1='32' x2='16' y2='32'/><line x1='48' y1='32' x2='56' y2='32'/><line x1='15' y1='15' x2='20.7' y2='20.7'/><line x1='43.3' y1='43.3' x2='49' y2='49'/><line x1='15' y1='49' x2='20.7' y2='43.3'/><line x1='43.3' y1='20.7' x2='49' y2='15'/></g>`,
    );
  if (code <= 2)
    return svg(
      `<circle cx='24' cy='24' r='9' fill='%23FBBF24'/><g stroke='%23FBBF24' stroke-width='2' stroke-linecap='round'><line x1='24' y1='8' x2='24' y2='13'/><line x1='24' y1='35' x2='24' y2='40'/><line x1='8' y1='24' x2='13' y2='24'/><line x1='35' y1='24' x2='40' y2='24'/></g><path d='M28 36a10 10 0 0 1 20 0 8 8 0 0 1-2 0H30a8 8 0 0 1-2 0z' fill='%239CA3AF'/><ellipse cx='38' cy='36' rx='12' ry='7' fill='%23D1D5DB'/>`,
    );
  if (code === 3)
    return svg(
      `<ellipse cx='32' cy='30' rx='16' ry='10' fill='%239CA3AF'/><ellipse cx='24' cy='34' rx='12' ry='8' fill='%23D1D5DB'/><ellipse cx='40' cy='34' rx='12' ry='8' fill='%23D1D5DB'/>`,
    );
  if (code <= 48)
    return svg(
      `<g fill='%23D1D5DB' opacity='0.6'><rect x='12' y='20' width='40' height='3' rx='1.5'/><rect x='8' y='28' width='48' height='3' rx='1.5'/><rect x='12' y='36' width='40' height='3' rx='1.5'/><rect x='16' y='44' width='32' height='3' rx='1.5'/></g>`,
    );
  if (code <= 67)
    return svg(
      `<ellipse cx='32' cy='24' rx='16' ry='10' fill='%239CA3AF'/><ellipse cx='24' cy='28' rx='12' ry='8' fill='%23D1D5DB'/><ellipse cx='40' cy='28' rx='12' ry='8' fill='%23D1D5DB'/><g fill='%2360A5FA'><circle cx='24' cy='44' r='2'/><circle cx='32' cy='48' r='2'/><circle cx='40' cy='44' r='2'/></g>`,
    );
  if (code <= 86)
    return svg(
      `<ellipse cx='32' cy='24' rx='16' ry='10' fill='%239CA3AF'/><ellipse cx='24' cy='28' rx='12' ry='8' fill='%23D1D5DB'/><ellipse cx='40' cy='28' rx='12' ry='8' fill='%23D1D5DB'/><g fill='%23BFDBFE'><circle cx='24' cy='42' r='2.5'/><circle cx='32' cy='48' r='2.5'/><circle cx='40' cy='42' r='2.5'/><circle cx='28' cy='52' r='2'/></g>`,
    );
  return svg(
    `<ellipse cx='32' cy='20' rx='16' ry='10' fill='%236B7280'/><ellipse cx='24' cy='24' rx='12' ry='8' fill='%239CA3AF'/><ellipse cx='40' cy='24' rx='12' ry='8' fill='%239CA3AF'/><polygon points='30,30 34,30 28,48' fill='%23FDE68A'/><polygon points='36,30 40,30 34,48' fill='%23FDE68A'/>`,
  );
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
