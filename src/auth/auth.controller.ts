import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
  InternalServerErrorException,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { registerSchema } from './schemas/register-schema'
import { ZodValidationPipe } from 'src/pipe/zod-validation-pipe'
import { z } from 'zod'
import { authenticateSchema } from './schemas/authenticate-schema'
import { InvalidCredentials } from 'src/errors/invalid-credential-errors'

type CreateUserDTO = z.infer<typeof registerSchema>

type AuthenticateUserDTO = z.infer<typeof authenticateSchema>

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(new ZodValidationPipe(registerSchema))
  async register(@Body() body: CreateUserDTO) {
    const { email, password } = body

    const user = this.authService.register({
      email,
      password,
    })

    return user
  }

  @Post('login')
  @UsePipes(new ZodValidationPipe(authenticateSchema))
  async authenticate(@Body() body: AuthenticateUserDTO) {
    try {
      const { email, password } = body

      const { user } = await this.authService.validateUser({
        email,
        password,
      })

      const { accessToken } = await this.authService.login(user)

      return {
        accessToken,
      }
    } catch (error) {
      if (error instanceof InvalidCredentials) {
        throw new UnauthorizedException(error.message)
      }

      throw new InternalServerErrorException()
    }
  }
}
