# Weather App (Technical Assignment)

A multi-provider weather application built with a modular, strategy-based architecture.
Users can look up current weather by location and seamlessly switch between providers.
This is a demo app built with a minimalist approach, using modern AI coding tools.

## Requirements

- Enter a city or village name to retrieve current weather data
- Toggle between two weather services (Open-Meteo and WeatherAPI)
- Switching providers with a location already entered refreshes the UI automatically
- Services are easily replaceable; theming is fully configurable
- Follows modern front-end development best practices

## Tech Stack

React, TailwindCSS, TanStack Query, Zustand, Zod, Vite, Vitest

## Getting Started

1. Copy the example environment file and add your WeatherAPI key:
   ```sh
   cp .env.example .env
   ```
2. Open `.env` and set `VITE_WEATHERAPI_API_KEY` to your key (Open-Meteo requires no key)
3. Install dependencies and start the dev server:
   ```sh
   npm install
   npm run dev
   ```

## Testing

Unit test coverage is provided. Run the suite with:

```sh
npm test
```
