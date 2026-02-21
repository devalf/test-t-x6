import { useState } from 'react';
import { locationSchema } from '../validation/locationSchema';
import { useWeatherStore } from '../store/weatherStore';
import { getTheme } from '../theme/serviceThemes';

export function LocationInput() {
  const { selectedServiceId, setLocation } = useWeatherStore();
  const theme = getTheme(selectedServiceId);
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = locationSchema.safeParse(input);
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }
    setError(null);
    setLocation(result.data);
  }

  function handleChange(value: string) {
    setInput(value);
    if (error) {
      const result = locationSchema.safeParse(value);
      if (result.success) setError(null);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Enter city name..."
          aria-label="Location"
          className={`flex-1 px-4 py-2 rounded-lg border ${theme.border} bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1 transition-colors`}
        />
        <button
          type="submit"
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${theme.button}`}
        >
          Search
        </button>
      </div>
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </form>
  );
}
