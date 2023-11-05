import {
  Controller,
  Get,
  Post,
  Body,
  BadRequestException,
  UnauthorizedException,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';
import { Tokens } from './interfaces';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { Cookie } from '@shared/decorators';

const REFRESH_TOKEN = 'refreshToken';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

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
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    const tokens = await this.authService.login(dto);
    if (!tokens) {
      throw new BadRequestException(
        `Не получается войти с данными: ${JSON.stringify(dto)} `,
      );
    }
    this.setRefreshTokenToCookies(tokens, res);
  }

  @Get('refresh-tokens')
  async refreshTokens(
    @Cookie(REFRESH_TOKEN) refreshToken: string,
    @Res() res: Response,
  ) {
    if (!refreshToken) {
      throw new UnauthorizedException();
    }
    const tokens = await this.authService.refreshTokens(refreshToken);
    if (!tokens) {
      throw new UnauthorizedException();
    }
    this.setRefreshTokenToCookies(tokens, res);
  }

  private setRefreshTokenToCookies(tokens: Tokens, res: Response) {
    if (!tokens) {
      throw new UnauthorizedException();
    }
    res.cookie(REFRESH_TOKEN, tokens.refreshToken.token, {
      httpOnly: true,
      sameSite: 'lax',
      expires: new Date(tokens.refreshToken.exp),
      secure:
        this.configService.get('NODE_ENV', 'development') === 'production',
      path: '/',
    });
    res.status(HttpStatus.CREATED).json({ accessToken: tokens.accessToken });
  }
}
