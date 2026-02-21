import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import WeatherContent from './components/WeatherContent.tsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1 },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WeatherContent />
    </QueryClientProvider>
  );
}
