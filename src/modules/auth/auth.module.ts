import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from 'src/modules/users/users.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '1 days',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, UsersService, JwtStrategy],
})
export class AuthModule {}
