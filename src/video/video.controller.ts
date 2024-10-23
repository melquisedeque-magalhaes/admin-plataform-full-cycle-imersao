import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  BadRequestException,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common'
import { VideoService } from './video.service'

import { createVideo, CreateVideoDto } from './dto/create-video-dto'
import { updateVideo, UpdateVideoDto } from './dto/update-video-dto'
import { ZodValidationPipe } from 'src/pipe/zod-validation-pipe'
import { FileInterceptor } from '@nest-lab/fastify-multer'
import { existsSync, mkdirSync } from 'fs'

@Controller('video')
export class VideoController {
  private readonly uploadDir = './uploads/chunks'

  constructor(private readonly videoService: VideoService) {
    if (!existsSync(this.uploadDir)) {
      mkdirSync(this.uploadDir, { recursive: true })
    }
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createVideo))
  create(@Body() createVideoDto: CreateVideoDto) {
    return this.videoService.create(createVideoDto)
  }

  @Get()
  findAll() {
    return this.videoService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.videoService.findOne(id)
  }

  @Patch(':id')
  @UsePipes(new ZodValidationPipe(updateVideo))
  update(@Param('id') id: string, @Body() updateVideoDto: UpdateVideoDto) {
    return this.videoService.update(updateVideoDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.videoService.remove(id)
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadVideo(
    @UploadedFile() file: Express.Multer.File,
    @Body('chunkNumber') chunkNumber: string,
    @Body('totalChunks') totalChunks: string,
    @Body('fileName') fileName: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded')
    }

    return this.videoService.upload({
      chunkNumber,
      file,
      fileName,
      totalChunks,
      uploadDir: this.uploadDir,
    })
  }
}
