import { describe, it, expect } from 'vitest'
import { openMeteoService } from '../../api/services/openMeteo'

describe('Open-Meteo Service', () => {
  it('has correct config', () => {
    expect(openMeteoService.config).toEqual({
      id: 'openmeteo',
      displayName: 'Open-Meteo',
      themeKey: 'openmeteo',
    })
  })

  it('fetches and maps weather data correctly', async () => {
    const data = await openMeteoService.fetchWeather('London')

    expect(data).toEqual({
      location: 'London',
      temperature: 15.5,
      feelsLike: 14.2,
      humidity: 72,
      description: 'Partly cloudy',
      icon: expect.stringContaining('data:image/svg+xml'),
      windSpeed: 12.6,
      provider: 'Open-Meteo',
    })
  })

  it('throws on location not found', async () => {
    await expect(
      openMeteoService.fetchWeather('InvalidCity999'),
    ).rejects.toThrow('Location not found')
  })
})
