import { http, HttpResponse } from 'msw';

export const mockOpenMeteoGeocodingResponse = {
  results: [
    {
      name: 'London',
      latitude: 51.5085,
      longitude: -0.1257,
    },
  ],
};

export const mockOpenMeteoWeatherResponse = {
  current: {
    temperature_2m: 15.5,
    relative_humidity_2m: 72,
    apparent_temperature: 14.2,
    weather_code: 2,
    wind_speed_10m: 12.6,
  },
};

export const mockWttrInResponse = {
  current_condition: [
    {
      temp_C: '16',
      FeelsLikeC: '14.8',
      humidity: '70',
      weatherDesc: [{ value: 'Partly cloudy' }],
      weatherCode: '116',
      windspeedKmph: '12',
    },
  ],
  nearest_area: [
    {
      areaName: [{ value: 'London' }],
    },
  ],
};

export const handlers = [
  http.get('https://geocoding-api.open-meteo.com/v1/search', ({ request }) => {
    const url = new URL(request.url);
    const name = url.searchParams.get('name');
    if (name === 'InvalidCity999') {
      return HttpResponse.json({ results: [] });
    }
    return HttpResponse.json(mockOpenMeteoGeocodingResponse);
  }),

  http.get('https://api.open-meteo.com/v1/forecast', () => {
    return HttpResponse.json(mockOpenMeteoWeatherResponse);
  }),

  http.get('https://wttr.in/:location', ({ params }) => {
    if (params['location'] === 'InvalidCity999') {
      return new HttpResponse('Unknown location', { status: 404 });
    }
    return HttpResponse.json(mockWttrInResponse);
  }),
];
