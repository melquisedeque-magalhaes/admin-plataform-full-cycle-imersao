import { z } from 'zod'

export const uploadVideo = z.object({
  chunkNumber: z.string(),
  totalChunks: z.string(),
  fileName: z.string(),
  videoId: z.string(),
})

export type UploadVideoDto = z.infer<typeof uploadVideo>
