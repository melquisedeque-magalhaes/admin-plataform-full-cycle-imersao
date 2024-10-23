import { z } from 'zod'

export const createVideo = z.object({
  title: z.string(),
  description: z.string(),
})

export type CreateVideoDto = z.infer<typeof createVideo>
