import { Module } from '@nestjs/common'
import { VideoService } from './video.service'
import { VideoController } from './video.controller'
import { PrismaService } from 'src/prisma.service'
import { FastifyMulterModule } from '@nest-lab/fastify-multer'

@Module({
  imports: [FastifyMulterModule.register({ dest: './uploads' })],
  controllers: [VideoController],
  providers: [VideoService, PrismaService],
})
export class VideoModule {}
