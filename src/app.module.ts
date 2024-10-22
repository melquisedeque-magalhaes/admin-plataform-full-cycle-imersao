import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { PrismaService } from './prisma.service'
import { UserModule } from './user/user.module'

@Module({
  imports: [AuthModule, UserModule],
  providers: [PrismaService],
})
export class AppModule {}
