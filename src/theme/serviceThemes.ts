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
  wttrin: {
    bg: 'bg-amber-50',
    cardBg: 'bg-amber-100',
    accent: 'text-amber-600',
    border: 'border-amber-300',
    button: 'bg-amber-500 hover:bg-amber-600 text-white',
    buttonActive: 'bg-amber-600 ring-2 ring-amber-400',
    label: 'Powered by wttr.in',
  },
};

export function getTheme(serviceId: string): ServiceTheme {
  return serviceThemes[serviceId] ?? serviceThemes['openmeteo'];
}
