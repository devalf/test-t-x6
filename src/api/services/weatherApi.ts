import type { WeatherData } from '../../types/types';
import type { WeatherService } from '../weatherService';

interface WeatherApiResponse {
  location: {
    name: string;
  };
  current: {
    temp_c: number;
    feelslike_c: number;
    humidity: number;
    condition: {
      text: string;
      icon: string;
    };
    wind_kph: number;
  };
}

export const weatherApiService: WeatherService = {
  config: {
    id: 'weatherapi',
    displayName: 'WeatherAPI',
    themeKey: 'weatherapi',
  },

  async fetchWeather(location: string): Promise<WeatherData> {
    const apiKey = import.meta.env.VITE_WEATHERAPI_API_KEY;
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(location)}`;

    const response = await fetch(url);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message ?? 'Failed to fetch weather data');
    }

    const data: WeatherApiResponse = await response.json();

    return {
      location: data.location.name,
      temperature: Math.round(data.current.temp_c * 10) / 10,
      feelsLike: Math.round(data.current.feelslike_c * 10) / 10,
      humidity: data.current.humidity,
      description: data.current.condition.text,
      icon: `https:${data.current.condition.icon}`,
      windSpeed: Math.round(data.current.wind_kph * 10) / 10,
      provider: 'WeatherAPI',
    };
  },
};
