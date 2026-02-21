import { z } from 'zod'

export const locationSchema = z
  .string()
  .trim()
  .min(2, 'Location must be at least 2 characters')
  .max(100, 'Location must be at most 100 characters')
  .regex(
    /^[a-zA-Z\s,.\-]+$/,
    'Location can only contain letters, spaces, commas, periods, and hyphens',
  )
