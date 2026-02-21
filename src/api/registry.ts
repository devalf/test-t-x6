import type { WeatherService } from './weatherService'

const services = new Map<string, WeatherService>()

export function registerService(service: WeatherService): void {
  services.set(service.config.id, service)
}

export function getService(id: string): WeatherService {
  const service = services.get(id)
  if (!service) throw new Error(`Weather service "${id}" is not registered.`)
  return service
}

export function getAllServices(): WeatherService[] {
  return Array.from(services.values())
}

export function clearServices(): void {
  services.clear()
}
