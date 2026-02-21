import { useWeatherStore } from '../store/weatherStore'
import { getTheme } from '../theme/serviceThemes'

interface ErrorDisplayProps {
  message: string
  onRetry: () => void
}

export function ErrorDisplay({ message, onRetry }: ErrorDisplayProps) {
  const { selectedServiceId } = useWeatherStore()
  const theme = getTheme(selectedServiceId)

  return (
    <div className="w-full max-w-md mx-auto rounded-xl border border-red-200 bg-red-50 p-6 text-center">
      <p className="text-red-600 font-medium mb-3">{message}</p>
      <button
        onClick={onRetry}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${theme.button}`}
      >
        Try again
      </button>
    </div>
  )
}
