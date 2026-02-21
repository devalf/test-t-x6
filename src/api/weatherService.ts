import type { WeatherData, ServiceConfig } from './types'

export interface WeatherService {
  config: ServiceConfig
  fetchWeather(location: string): Promise<WeatherData>
}
