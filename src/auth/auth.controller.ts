import {
  Controller,
  Get,
  Post,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const user = await this.authService.register(dto);
    if (!user) {
      throw new BadRequestException(
        `Не получается зарегестрировать пользователя с данными: ${JSON.stringify(
          dto,
        )} `,
      );
    }
    return user;
  }
  @Post('login')
  async login(@Body() dto: LoginDto) {
    const tokens = await this.authService.login(dto);
    if (!tokens) {
      throw new BadRequestException(
        `Не получается войти с данными: ${JSON.stringify(dto)} `,
      );
    }
    return { accessToken: tokens.accessToken };
  }

  @Get('refresh')
  refreshTokens() {}
}
