import { useWeatherStore } from '../store/weatherStore';
import { getAllServices } from '../api/registry';
import { getTheme } from '../theme/serviceThemes';

export function ServiceToggle() {
  const { selectedServiceId, setSelectedServiceId } = useWeatherStore();
  const services = getAllServices();
  const theme = getTheme(selectedServiceId);

  if (services.length < 2) return null;

  return (
    <div className="flex gap-4 w-full max-w-md mx-auto" role="radiogroup" aria-label="Weather service">
      {services.map((service) => {
        const isActive = service.config.id === selectedServiceId;
        return (
          <button
            key={service.config.id}
            role="radio"
            aria-checked={isActive}
            onClick={() => setSelectedServiceId(service.config.id)}
            className={`grow px-4 py-2 rounded-lg font-medium transition-all text-white ${
              isActive ? theme.buttonActive : 'bg-gray-400 hover:bg-gray-500'
            }`}
          >
            {service.config.displayName}
          </button>
        );
      })}
    </div>
  );
}
