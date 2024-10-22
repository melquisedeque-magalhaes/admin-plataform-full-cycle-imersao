import { Controller, Get, Request, UseGuards } from '@nestjs/common'
import { AuthGuard } from 'src/auth/auth.guard'
import { UserService } from './user.service'

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  async getProfile(@Request() req) {
    const userId = req.user.sub

    const user = await this.userService.getProfile(userId)

    return {
      user,
    }
  }
}
