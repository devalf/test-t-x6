import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LocationInput } from '../../components/LocationInput';
import { useWeatherStore } from '../../store/weatherStore';

describe('LocationInput', () => {
  beforeEach(() => {
    useWeatherStore.setState({
      selectedServiceId: 'openmeteo',
      location: '',
    });
  });

  it('renders input and search button', () => {
    render(<LocationInput />);
    expect(screen.getByLabelText('Location')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });

  it('shows validation error for empty submit', async () => {
    const user = userEvent.setup();
    render(<LocationInput />);

    await user.click(screen.getByRole('button', { name: 'Search' }));

    expect(screen.getByRole('alert')).toHaveTextContent('Location must be at least 2 characters');
  });

  it('shows validation error for invalid characters', async () => {
    const user = userEvent.setup();
    render(<LocationInput />);

    await user.type(screen.getByLabelText('Location'), 'City123');
    await user.click(screen.getByRole('button', { name: 'Search' }));

    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('updates store on valid submit', async () => {
    const user = userEvent.setup();
    render(<LocationInput />);

    await user.type(screen.getByLabelText('Location'), 'London');
    await user.click(screen.getByRole('button', { name: 'Search' }));

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(useWeatherStore.getState().location).toBe('London');
  });

  it('submits on Enter key', async () => {
    const user = userEvent.setup();
    render(<LocationInput />);

    await user.type(screen.getByLabelText('Location'), 'Paris{enter}');

    expect(useWeatherStore.getState().location).toBe('Paris');
  });

  it('clears error when input becomes valid', async () => {
    const user = userEvent.setup();
    render(<LocationInput />);

    await user.click(screen.getByRole('button', { name: 'Search' }));
    expect(screen.getByRole('alert')).toBeInTheDocument();

    await user.type(screen.getByLabelText('Location'), 'London');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
