import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto, RegisterDto } from './dto';
import { UserService } from '@user/user.service';
import { Tokens } from './interfaces';
import { compareSync } from 'bcrypt';
import { Token, User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@prisma/prisma.service';
import { v4 } from 'uuid';
import { add } from 'date-fns';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async register(dto: RegisterDto) {
    const user: User | null = await this.userService
      .findOne(dto.email)
      .catch((err) => {
        this.logger.error(err);
        return null;
      });
    if (user) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }
    return this.userService.save(dto).catch((err) => {
      this.logger.error(err);
      return null;
    });
  }

  async login(dto: LoginDto): Promise<Tokens> {
    const user: User | null = await this.userService
      .findOne(dto.email)
      .catch((err) => {
        this.logger.error(err);
        return null;
      });
    if (!user || !compareSync(dto.password, user.password)) {
      throw new UnauthorizedException('Не верный логин или пароль');
    }
    return this.generateTokens(user);
  }

  private async generateTokens(user: User): Promise<Tokens> {
    const accessToken =
      'Bearer ' +
      (await this.jwtService.signAsync({
        id: user.id,
        email: user.email,
        role: user.roles,
      }));
    const refreshToken = await this.getRefreshToken(user.id);
    return { accessToken, refreshToken };
  }

  async refreshTokens(refreshToken: string) {
    const token = await this.prisma.token.delete({
      where: { token: refreshToken },
    });
    if (!token) {
      throw new UnauthorizedException();
    }
    const user = await this.userService.findOne(token.userId);
    return this.generateTokens(user!);
  }

  private async getRefreshToken(userId: string): Promise<Token> {
    return this.prisma.token.create({
      data: {
        token: v4(),
        exp: add(new Date(), { months: 1 }),
        userId,
        userAgent: '',
      },
    });
  }
}
