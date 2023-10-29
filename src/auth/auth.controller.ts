import {
  Controller,
  Post,
  Body,
  HttpCode,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from 'src/auth//auth.service';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from 'src/auth/localAuth.guard';
import RequestWithUser from './requestWithUser.interface';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() request: RequestWithUser) {
    const user = request.user;
    return user;
  }
}
