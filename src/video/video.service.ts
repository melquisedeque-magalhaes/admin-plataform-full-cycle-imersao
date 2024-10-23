import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateVideoDto } from './dto/create-video-dto'
import { UpdateVideoDto } from './dto/update-video-dto'
import { PrismaService } from 'src/prisma.service'
import { generateSlug } from './utils/generate-slug'
import { join } from 'path'
import { existsSync, mkdirSync, renameSync } from 'fs'

interface UploadProps {
  fileName: string
  chunkNumber: string
  file: Express.Multer.File
  totalChunks: string
  uploadDir: string
  videoId: string
}

@Injectable()
export class VideoService {
  constructor(private prismaService: PrismaService) {}

  async create({ description, title }: CreateVideoDto) {
    const slug = generateSlug(title)

    const video = await this.prismaService.video.create({
      data: {
        title,
        description,
        slug,
      },
    })

    return video
  }

  async findAll() {
    const videos = await this.prismaService.video.findMany()

    return videos
  }

  async findOne(id: string) {
    const video = await this.prismaService.video.findUnique({
      where: {
        id,
      },
    })

    return video
  }

  async update({
    description,
    id,
    isPublish,
    title,
    countLikes,
    countViews,
  }: UpdateVideoDto) {
    const updatedVideo = await this.prismaService.video.update({
      data: {
        count_likes: countLikes,
        count_views: countViews,
        is_publish: isPublish,
        title,
        description,
      },
      where: {
        id,
      },
    })

    return updatedVideo
  }

  async remove(id: string) {
    const deleteVideo = await this.prismaService.video.delete({
      where: {
        id,
      },
    })

    return deleteVideo
  }

  async upload({
    chunkNumber,
    file,
    fileName,
    totalChunks,
    uploadDir,
    videoId,
  }: UploadProps) {
    const videoDir = join(uploadDir, fileName)

    if (!existsSync(videoDir)) {
      mkdirSync(videoDir, { recursive: true })
    }

    const chunkPath = join(videoDir, `${chunkNumber}.chunk`)

    renameSync(file.path, chunkPath)

    if (parseInt(chunkNumber, 10) === parseInt(totalChunks, 10)) {
      const findVideo = await this.prismaService.video.findUnique({
        where: {
          id: videoId,
        },
      })

      if (!findVideo) {
        throw new NotFoundException('video não encontrado!')
      }

      const video = await this.prismaService.video.update({
        where: {
          id: videoId,
        },
        data: {
          status: 'UPLOADED_STARTED',
        },
      })

      return { message: 'Upload completo', video }
    }

    return { message: `Chunk ${chunkNumber} do vídeo ${fileName} recebido` }
  }
}
