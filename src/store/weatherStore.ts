import { create } from 'zustand'

interface WeatherState {
  selectedServiceId: string
  location: string
  setSelectedServiceId: (id: string) => void
  setLocation: (location: string) => void
}

export const useWeatherStore = create<WeatherState>((set) => ({
  selectedServiceId: 'openmeteo',
  location: '',
  setSelectedServiceId: (id) => set({ selectedServiceId: id }),
  setLocation: (location) => set({ location }),
}))
