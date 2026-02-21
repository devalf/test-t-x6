import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { registerService, clearServices } from '../../api/registry';
import { openMeteoService } from '../../api/services/openMeteo';
import { weatherApiService } from '../../api/services/weatherApi';
import { useWeatherStore } from '../../store/weatherStore';
import App from '../../App.tsx';

describe('App Integration', () => {
  beforeEach(() => {
    clearServices();
    registerService(openMeteoService);
    registerService(weatherApiService);
    useWeatherStore.setState({
      selectedServiceId: 'openmeteo',
      location: '',
    });
  });

  it('renders the app with title and controls', () => {
    render(<App />);
    expect(screen.getByText('Weather App')).toBeInTheDocument();
    expect(screen.getByLabelText('Location')).toBeInTheDocument();
    expect(screen.getByText('Open-Meteo')).toBeInTheDocument();
    expect(screen.getByText('WeatherAPI')).toBeInTheDocument();
  });

  it('searches for weather and displays results', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText('Location'), 'London');
    await user.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => {
      expect(screen.getByText('London')).toBeInTheDocument();
    });
    expect(screen.getByText('15.5°C')).toBeInTheDocument();
    expect(screen.getByText('Powered by Open-Meteo')).toBeInTheDocument();
  });

  it('toggles service and refreshes weather data', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Search first
    await user.type(screen.getByLabelText('Location'), 'London');
    await user.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => {
      expect(screen.getByText('Powered by Open-Meteo')).toBeInTheDocument();
    });

    // Toggle to WeatherAPI
    await user.click(screen.getByText('WeatherAPI'));

    await waitFor(() => {
      expect(screen.getByText('Powered by WeatherAPI')).toBeInTheDocument();
    });
  });

  it('shows validation error for invalid input', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText('Location'), 'A');
    await user.click(screen.getByRole('button', { name: 'Search' }));

    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});
