import { describe, it, expect } from 'vitest';
import { wttrInService } from '../../api/services/wttrIn';

describe('wttr.in Service', () => {
  it('has correct config', () => {
    expect(wttrInService.config).toEqual({
      id: 'wttrin',
      displayName: 'WTTR',
      themeKey: 'wttrin',
    });
  });

  it('fetches and maps weather data correctly', async () => {
    const data = await wttrInService.fetchWeather('London');

    expect(data).toEqual({
      location: 'London',
      temperature: 16.0,
      feelsLike: 14.8,
      humidity: 70,
      description: 'Partly cloudy',
      icon: '⛅',
      windSpeed: 12.0,
      provider: 'wttr.in',
    });
  });

  it('throws on API error', async () => {
    await expect(wttrInService.fetchWeather('InvalidCity999')).rejects.toThrow(
      'Location not found',
    );
  });
});
