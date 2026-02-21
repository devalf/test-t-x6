import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ServiceToggle } from '../../components/ServiceToggle';
import { useWeatherStore } from '../../store/weatherStore';
import { registerService, clearServices } from '../../api/registry';
import { openMeteoService } from '../../api/services/openMeteo';
import { wttrInService } from '../../api/services/wttrIn';

describe('ServiceToggle', () => {
  beforeEach(() => {
    clearServices();
    registerService(openMeteoService);
    registerService(wttrInService);
    useWeatherStore.setState({
      selectedServiceId: 'openmeteo',
      location: '',
    });
  });

  it('renders all registered services', () => {
    render(<ServiceToggle />);
    expect(screen.getByText('Open-Meteo')).toBeInTheDocument();
    expect(screen.getByText('WTTR')).toBeInTheDocument();
  });

  it('marks the active service as checked', () => {
    render(<ServiceToggle />);
    expect(screen.getByText('Open-Meteo').closest('button')).toHaveAttribute(
      'aria-checked',
      'true',
    );
    expect(screen.getByText('WTTR').closest('button')).toHaveAttribute('aria-checked', 'false');
  });

  it('switches service on click', async () => {
    const user = userEvent.setup();
    render(<ServiceToggle />);

    await user.click(screen.getByText('WTTR'));

    expect(useWeatherStore.getState().selectedServiceId).toBe('wttrin');
  });

  it('renders nothing when fewer than 2 services', () => {
    clearServices();
    registerService(openMeteoService);
    const { container } = render(<ServiceToggle />);
    expect(container.innerHTML).toBe('');
  });
});
