export interface ServiceTheme {
  bg: string;
  cardBg: string;
  accent: string;
  border: string;
  button: string;
  buttonActive: string;
  label: string;
}

export const serviceThemes: Record<string, ServiceTheme> = {
  openmeteo: {
    bg: 'bg-emerald-50',
    cardBg: 'bg-emerald-100',
    accent: 'text-emerald-600',
    border: 'border-emerald-300',
    button: 'bg-emerald-500 hover:bg-emerald-600 text-white',
    buttonActive: 'bg-emerald-600 ring-2 ring-emerald-400',
    label: 'Powered by Open-Meteo',
  },
  weatherapi: {
    bg: 'bg-sky-50',
    cardBg: 'bg-sky-100',
    accent: 'text-sky-600',
    border: 'border-sky-300',
    button: 'bg-sky-500 hover:bg-sky-600 text-white',
    buttonActive: 'bg-sky-600 ring-2 ring-sky-400',
    label: 'Powered by WeatherAPI',
  },
};

export function getTheme(serviceId: string): ServiceTheme {
  return serviceThemes[serviceId] ?? serviceThemes['openmeteo'];
}
