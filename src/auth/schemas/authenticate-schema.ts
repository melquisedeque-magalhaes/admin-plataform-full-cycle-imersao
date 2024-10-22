import { z } from 'zod'

export const authenticateSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})
