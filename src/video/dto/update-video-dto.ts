import { z } from 'zod'

export const updateVideo = z.object({
  id: z.string().uuid(),
  title: z.string().optional(),
  description: z.string().optional(),
  isPublish: z.boolean().optional(),
  countLikes: z.number().optional(),
  countViews: z.number().optional(),
})

export type UpdateVideoDto = z.infer<typeof updateVideo>
