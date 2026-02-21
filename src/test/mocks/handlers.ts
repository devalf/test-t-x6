import { http, HttpResponse } from 'msw'

export const mockOpenMeteoGeocodingResponse = {
  results: [
    {
      name: 'London',
      latitude: 51.5085,
      longitude: -0.1257,
    },
  ],
}

export const mockOpenMeteoWeatherResponse = {
  current: {
    temperature_2m: 15.5,
    relative_humidity_2m: 72,
    apparent_temperature: 14.2,
    weather_code: 2,
    wind_speed_10m: 12.6,
  },
}

export const mockWeatherApiResponse = {
  location: {
    name: 'London',
  },
  current: {
    temp_c: 16.0,
    feelslike_c: 14.8,
    humidity: 70,
    condition: {
      text: 'Partly cloudy',
      icon: '//cdn.weatherapi.com/weather/64x64/day/116.png',
    },
    wind_kph: 12.0,
  },
}

export const handlers = [
  http.get('https://geocoding-api.open-meteo.com/v1/search', ({ request }) => {
    const url = new URL(request.url)
    const name = url.searchParams.get('name')
    if (name === 'InvalidCity999') {
      return HttpResponse.json({ results: [] })
    }
    return HttpResponse.json(mockOpenMeteoGeocodingResponse)
  }),

  http.get('https://api.open-meteo.com/v1/forecast', () => {
    return HttpResponse.json(mockOpenMeteoWeatherResponse)
  }),

  http.get('https://api.weatherapi.com/v1/current.json', ({ request }) => {
    const url = new URL(request.url)
    const q = url.searchParams.get('q')
    if (q === 'InvalidCity999') {
      return HttpResponse.json(
        { error: { code: 1006, message: 'No matching location found.' } },
        { status: 400 },
      )
    }
    return HttpResponse.json(mockWeatherApiResponse)
  }),
]
