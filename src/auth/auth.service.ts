import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import * as bcrypt from 'bcrypt'
import { InvalidCredentials } from 'src/errors/invalid-credential-errors'
import { User } from '@prisma/client'
import { JwtService } from '@nestjs/jwt'

interface RegisterProps {
  email: string
  password: string
}

interface ValidateUserProps {
  email: string
  password: string
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register({ email, password }: RegisterProps) {
    const hashPassword = await bcrypt.hash(password, 10)

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashPassword,
      },
    })

    delete user.password

    return {
      user,
    }
  }

  async validateUser({ email, password }: ValidateUserProps) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      throw new InvalidCredentials()
    }

    const isPasswordMatches = bcrypt.compare(password, user.password)

    if (!isPasswordMatches) {
      throw new InvalidCredentials()
    }

    return {
      user,
    }
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id }

    const accessToken = await this.jwtService.signAsync(payload)

    return {
      accessToken,
    }
  }
}
