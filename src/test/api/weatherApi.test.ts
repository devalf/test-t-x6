import { describe, it, expect } from 'vitest';
import { weatherApiService } from '../../api/services/weatherApi';

describe('WeatherAPI Service', () => {
  it('has correct config', () => {
    expect(weatherApiService.config).toEqual({
      id: 'weatherapi',
      displayName: 'WeatherAPI',
      themeKey: 'weatherapi',
    });
  });

  it('fetches and maps weather data correctly', async () => {
    const data = await weatherApiService.fetchWeather('London');

    expect(data).toEqual({
      location: 'London',
      temperature: 16.0,
      feelsLike: 14.8,
      humidity: 70,
      description: 'Partly cloudy',
      icon: 'https://cdn.weatherapi.com/weather/64x64/day/116.png',
      windSpeed: 12.0,
      provider: 'WeatherAPI',
    });
  });

  it('throws on API error', async () => {
    await expect(weatherApiService.fetchWeather('InvalidCity999')).rejects.toThrow(
      'No matching location found.',
    );
  });
});
