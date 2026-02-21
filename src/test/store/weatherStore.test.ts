import { describe, it, expect, beforeEach } from 'vitest';
import { useWeatherStore } from '../../store/weatherStore';

describe('Weather Store', () => {
  beforeEach(() => {
    useWeatherStore.setState({
      selectedServiceId: 'openmeteo',
      location: '',
    });
  });

  it('has correct default state', () => {
    const state = useWeatherStore.getState();
    expect(state.selectedServiceId).toBe('openmeteo');
    expect(state.location).toBe('');
  });

  it('updates selected service id', () => {
    useWeatherStore.getState().setSelectedServiceId('weatherapi');
    expect(useWeatherStore.getState().selectedServiceId).toBe('weatherapi');
  });

  it('updates location', () => {
    useWeatherStore.getState().setLocation('London');
    expect(useWeatherStore.getState().location).toBe('London');
  });

  it('handles multiple state updates independently', () => {
    useWeatherStore.getState().setLocation('Paris');
    useWeatherStore.getState().setSelectedServiceId('weatherapi');

    const state = useWeatherStore.getState();
    expect(state.location).toBe('Paris');
    expect(state.selectedServiceId).toBe('weatherapi');
  });
});
