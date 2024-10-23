import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { PrismaService } from './prisma.service'
import { UserModule } from './user/user.module'
import { VideoModule } from './video/video.module'

@Module({
  imports: [AuthModule, UserModule, VideoModule],
  providers: [PrismaService],
})
export class AppModule {}
