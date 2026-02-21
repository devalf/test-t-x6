import { describe, it, expect, beforeEach } from 'vitest'
import { act } from 'react'
import { render, screen } from '@testing-library/react'
import { WeatherCard, WeatherCardSkeleton } from '../../components/WeatherCard'
import { useWeatherStore } from '../../store/weatherStore'
import type { WeatherData } from '../../types/types'

const mockWeather: WeatherData = {
  location: 'London',
  temperature: 15.5,
  feelsLike: 14.2,
  humidity: 72,
  description: 'Partly cloudy',
  icon: 'data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20viewBox%3D%270%200%2064%2064%27%3E%3C%2Fsvg%3E',
  windSpeed: 12.6,
  provider: 'Open-Meteo',
}

describe('WeatherCard', () => {
  beforeEach(() => {
    useWeatherStore.setState({ selectedServiceId: 'openmeteo' })
  })

  it('renders weather data', () => {
    render(<WeatherCard data={mockWeather} />)

    expect(screen.getByText('London')).toBeInTheDocument()
    expect(screen.getByText('15.5°C')).toBeInTheDocument()
    expect(screen.getByText('Partly cloudy')).toBeInTheDocument()
    expect(screen.getByText('14.2°C')).toBeInTheDocument()
    expect(screen.getByText('72%')).toBeInTheDocument()
    expect(screen.getByText('12.6 km/h')).toBeInTheDocument()
  })

  it('renders weather icon', () => {
    render(<WeatherCard data={mockWeather} />)
    const img = screen.getByAltText('Partly cloudy')
    expect(img).toHaveAttribute('src', mockWeather.icon)
  })

  it('shows attribution label', () => {
    render(<WeatherCard data={mockWeather} />)
    expect(screen.getByText('Powered by Open-Meteo')).toBeInTheDocument()
  })

  it('changes theme when service changes', () => {
    const { rerender } = render(<WeatherCard data={mockWeather} />)

    act(() => {
      useWeatherStore.setState({ selectedServiceId: 'weatherapi' })
    })
    rerender(<WeatherCard data={mockWeather} />)

    expect(screen.getByText('Powered by WeatherAPI')).toBeInTheDocument()
  })
})

describe('WeatherCardSkeleton', () => {
  it('renders without crashing', () => {
    const { container } = render(<WeatherCardSkeleton />)
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument()
  })
})
