export interface WeatherData {
  location: string
  temperature: number
  feelsLike: number
  humidity: number
  description: string
  icon: string
  windSpeed: number
  provider: string
}

export interface ServiceConfig {
  id: string
  displayName: string
  themeKey: string
}
