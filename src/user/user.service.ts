import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async getProfile(userId: string) {
    const findUser = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    })

    delete findUser.password

    return findUser
  }
}
