import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ServiceToggle } from '../../components/ServiceToggle';
import { useWeatherStore } from '../../store/weatherStore';
import { registerService, clearServices } from '../../api/registry';
import { openMeteoService } from '../../api/services/openMeteo';
import { weatherApiService } from '../../api/services/weatherApi';

describe('ServiceToggle', () => {
  beforeEach(() => {
    clearServices();
    registerService(openMeteoService);
    registerService(weatherApiService);
    useWeatherStore.setState({
      selectedServiceId: 'openmeteo',
      location: '',
    });
  });

  it('renders all registered services', () => {
    render(<ServiceToggle />);
    expect(screen.getByText('Open-Meteo')).toBeInTheDocument();
    expect(screen.getByText('WeatherAPI')).toBeInTheDocument();
  });

  it('marks the active service as checked', () => {
    render(<ServiceToggle />);
    expect(screen.getByText('Open-Meteo').closest('button')).toHaveAttribute(
      'aria-checked',
      'true',
    );
    expect(screen.getByText('WeatherAPI').closest('button')).toHaveAttribute(
      'aria-checked',
      'false',
    );
  });

  it('switches service on click', async () => {
    const user = userEvent.setup();
    render(<ServiceToggle />);

    await user.click(screen.getByText('WeatherAPI'));

    expect(useWeatherStore.getState().selectedServiceId).toBe('weatherapi');
  });

  it('renders nothing when fewer than 2 services', () => {
    clearServices();
    registerService(openMeteoService);
    const { container } = render(<ServiceToggle />);
    expect(container.innerHTML).toBe('');
  });
});
