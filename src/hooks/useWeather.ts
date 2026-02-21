import { useQuery } from '@tanstack/react-query'
import { useWeatherStore } from '../store/weatherStore'
import { getService } from '../api/registry'

export function useWeather() {
  const { selectedServiceId, location } = useWeatherStore()

  return useQuery({
    queryKey: ['weather', selectedServiceId, location],
    queryFn: () => {
      const service = getService(selectedServiceId)
      return service.fetchWeather(location)
    },
    enabled: location.length > 0,
    staleTime: 5 * 60 * 1000,
  })
}
