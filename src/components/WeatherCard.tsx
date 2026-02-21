import type { WeatherData } from '../types/types';
import { useWeatherStore } from '../store/weatherStore';
import { getTheme } from '../theme/serviceThemes';

interface WeatherCardProps {
  data: WeatherData;
}

export function WeatherCard({ data }: WeatherCardProps) {
  const { selectedServiceId } = useWeatherStore();
  const theme = getTheme(selectedServiceId);

  return (
    <div
      className={`w-full max-w-md mx-auto rounded-xl border ${theme.border} ${theme.cardBg} p-6 transition-colors`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-2xl font-bold ${theme.accent}`}>{data.location}</h2>
        <img src={data.icon} alt={data.description} className="w-16 h-16" />
      </div>

      <p className="text-4xl font-bold text-gray-900 mb-1">{data.temperature}°C</p>
      <p className="text-gray-600 capitalize mb-4">{data.description}</p>

      <div className="grid grid-cols-3 gap-4 text-sm text-gray-700">
        <div>
          <p className="font-medium">Feels like</p>
          <p>{data.feelsLike}°C</p>
        </div>
        <div>
          <p className="font-medium">Humidity</p>
          <p>{data.humidity}%</p>
        </div>
        <div>
          <p className="font-medium">Wind</p>
          <p>{data.windSpeed} km/h</p>
        </div>
      </div>

      <p className={`mt-4 text-xs ${theme.accent} text-right`}>{theme.label}</p>
    </div>
  );
}

export function WeatherCardSkeleton() {
  return (
    <div className="w-full max-w-md mx-auto rounded-xl border border-gray-200 bg-gray-50 p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-7 w-32 bg-gray-200 rounded" />
        <div className="w-16 h-16 bg-gray-200 rounded-full" />
      </div>
      <div className="h-10 w-24 bg-gray-200 rounded mb-1" />
      <div className="h-5 w-36 bg-gray-200 rounded mb-4" />
      <div className="grid grid-cols-3 gap-4">
        <div className="h-10 bg-gray-200 rounded" />
        <div className="h-10 bg-gray-200 rounded" />
        <div className="h-10 bg-gray-200 rounded" />
      </div>
    </div>
  );
}
