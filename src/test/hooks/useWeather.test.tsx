import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { useWeather } from '../../hooks/useWeather'
import { useWeatherStore } from '../../store/weatherStore'
import { registerService, clearServices } from '../../api/registry'
import { openMeteoService } from '../../api/services/openMeteo'
import { weatherApiService } from '../../api/services/weatherApi'

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useWeather', () => {
  beforeEach(() => {
    clearServices()
    registerService(openMeteoService)
    registerService(weatherApiService)
    useWeatherStore.setState({
      selectedServiceId: 'openmeteo',
      location: '',
    })
  })

  it('does not fetch when location is empty', () => {
    const { result } = renderHook(() => useWeather(), {
      wrapper: createWrapper(),
    })

    expect(result.current.isFetching).toBe(false)
    expect(result.current.data).toBeUndefined()
  })

  it('fetches weather data when location is set', async () => {
    useWeatherStore.setState({ location: 'London' })

    const { result } = renderHook(() => useWeather(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.location).toBe('London')
    expect(result.current.data?.provider).toBe('Open-Meteo')
  })

  it('fetches from different service when toggled', async () => {
    useWeatherStore.setState({
      location: 'London',
      selectedServiceId: 'weatherapi',
    })

    const { result } = renderHook(() => useWeather(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.provider).toBe('WeatherAPI')
  })

  it('returns error for invalid city', async () => {
    useWeatherStore.setState({ location: 'InvalidCity999' })

    const { result } = renderHook(() => useWeather(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error?.message).toContain('Location not found')
  })
})
