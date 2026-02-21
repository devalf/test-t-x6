import { describe, it, expect, beforeEach } from 'vitest'
import {
  registerService,
  getService,
  getAllServices,
  clearServices,
} from '../../api/registry'
import type { WeatherService } from '../../api/weatherService'

const mockService: WeatherService = {
  config: { id: 'mock', displayName: 'Mock Service', themeKey: 'mock' },
  fetchWeather: async () => ({
    location: 'Test',
    temperature: 20,
    feelsLike: 18,
    humidity: 50,
    description: 'Clear',
    icon: 'http://example.com/icon.png',
    windSpeed: 10,
    provider: 'Mock',
  }),
}

const mockService2: WeatherService = {
  config: { id: 'mock2', displayName: 'Mock Service 2', themeKey: 'mock2' },
  fetchWeather: mockService.fetchWeather,
}

describe('Service Registry', () => {
  beforeEach(() => {
    clearServices()
  })

  it('registers and retrieves a service', () => {
    registerService(mockService)
    expect(getService('mock')).toBe(mockService)
  })

  it('throws when getting an unregistered service', () => {
    expect(() => getService('nonexistent')).toThrow(
      'Weather service "nonexistent" is not registered.',
    )
  })

  it('returns all registered services', () => {
    registerService(mockService)
    registerService(mockService2)
    const all = getAllServices()
    expect(all).toHaveLength(2)
    expect(all).toContain(mockService)
    expect(all).toContain(mockService2)
  })

  it('overwrites a service with the same id', () => {
    registerService(mockService)
    const replacement: WeatherService = {
      ...mockService,
      config: { ...mockService.config, displayName: 'Replaced' },
    }
    registerService(replacement)
    expect(getService('mock').config.displayName).toBe('Replaced')
    expect(getAllServices()).toHaveLength(1)
  })

  it('clears all services', () => {
    registerService(mockService)
    registerService(mockService2)
    clearServices()
    expect(getAllServices()).toHaveLength(0)
  })
})
