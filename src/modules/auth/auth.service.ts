import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from 'src/modules/auth/dto/register.dto';
import { LoginDto } from 'src/modules/auth/dto/login.dto';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/modules/users/users.service';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerData: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerData.password, 10);

    const userData: CreateUserDto = {
      ...registerData,
      password: hashedPassword,
    };

    const user = this.usersService.create(userData);
    return user;
  }
  async login(loginData: LoginDto) {
    const user = await this.usersService.findOneByEmail(loginData.email);
    if (!user) {
      throw new UnauthorizedException();
    }
    await this.verifyPassword(loginData.password, user.password);
    const payload = { sub: user.id, user: user.email };
    const accessToken = {
      access_token: await this.jwtService.signAsync(payload),
    };
    return accessToken;
  }

  async getCurentUser(userId: number) {
    const user = await this.usersService.findOneById(userId);
    return user;
  }

  async verifyPassword(password: string, hashedPassword: string) {
    const result = await bcrypt.compare(password, hashedPassword);
    if (!result) {
      throw new UnauthorizedException();
    }
  }
}
