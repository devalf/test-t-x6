import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { LocationInput } from './LocationInput'
import { ServiceToggle } from './ServiceToggle'
import { WeatherCard, WeatherCardSkeleton } from './WeatherCard'
import { ErrorDisplay } from './ErrorDisplay'
import { useWeather } from '../hooks/useWeather'
import { useWeatherStore } from '../store/weatherStore'
import { getTheme } from '../theme/serviceThemes'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1 },
  },
})

function WeatherContent() {
  const { selectedServiceId, location } = useWeatherStore()
  const theme = getTheme(selectedServiceId)
  const { data, error, isLoading, isFetching, refetch } = useWeather()

  return (
    <div
      className={`min-h-screen ${theme.bg} transition-colors duration-300`}
    >
      <div className="max-w-2xl mx-auto px-4 py-12 flex flex-col items-center gap-6">
        <h1 className={`text-3xl font-bold ${theme.accent} transition-colors`}>
          Weather App
        </h1>

        <ServiceToggle />
        <LocationInput />

        {isLoading && location && <WeatherCardSkeleton />}
        {error && !isLoading && (
          <ErrorDisplay
            message={error.message}
            onRetry={() => refetch()}
          />
        )}
        {data && !isLoading && (
          <div className={isFetching ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
            <WeatherCard data={data} />
          </div>
        )}
      </div>
    </div>
  )
}

export default function
  App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WeatherContent />
    </QueryClientProvider>
  )
}
