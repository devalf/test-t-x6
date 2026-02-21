import { useWeatherStore } from '../store/weatherStore.ts';
import { getTheme } from '../theme/serviceThemes.ts';
import { useWeather } from '../hooks/useWeather.ts';
import { ServiceToggle } from './ServiceToggle.tsx';
import { LocationInput } from './LocationInput.tsx';
import { WeatherCard, WeatherCardSkeleton } from './WeatherCard.tsx';
import { ErrorDisplay } from './ErrorDisplay.tsx';

export default function WeatherContent() {
  const { selectedServiceId, location } = useWeatherStore();
  const theme = getTheme(selectedServiceId);
  const { data, error, isLoading, isFetching, refetch } = useWeather();

  return (
    <div className={`min-h-screen ${theme.bg} transition-colors duration-300`}>
      <div className="max-w-2xl mx-auto px-4 py-12 flex flex-col items-center gap-6">
        <h1 className={`text-3xl font-bold ${theme.accent} transition-colors`}>Weather App</h1>

        <ServiceToggle />
        <LocationInput />

        {isLoading && location && <WeatherCardSkeleton />}
        {error && !isLoading && <ErrorDisplay message={error.message} onRetry={() => refetch()} />}
        {data && !isLoading && (
          <div
            className={['transition-opacity', 'w-full', isFetching ? 'opacity-60' : ''].join(' ')}
          >
            <WeatherCard data={data} />
          </div>
        )}
      </div>
    </div>
  );
}
