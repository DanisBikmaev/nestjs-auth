import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { genSaltSync, hashSync } from 'bcrypt';
import { JwtPayload } from '@auth/interfaces';
import { Role, User } from '@prisma/client';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';
import { convertToSecondsUtil } from '@shared/utils';
@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly configService: ConfigService,
  ) {}

  async save(dto: any) {
    const hashedPassword = await this.hashPassword(dto.password);
    return await this.prisma.user.create({
      data: { ...dto, password: hashedPassword },
    });
  }

  async findAll() {
    return await this.prisma.user.findMany();
  }

  async findOne(idOrEmail: string, isReset = false) {
    if (isReset) {
      await this.cacheManager.del(idOrEmail);
    }
    const user = await this.cacheManager.get<User>(idOrEmail);
    if (!user) {
      const user = await this.prisma.user.findFirst({
        where: { OR: [{ id: idOrEmail }, { email: idOrEmail }] },
      });
      if (!user) {
        throw new BadRequestException('Пользователь не найден');
      }
      await this.cacheManager.set(
        idOrEmail,
        user,
        convertToSecondsUtil(this.configService.get('JWT_EXP')),
      );
      return user;
    }
    return user;
  }

  async update(id: string, dto: any) {
    return await this.prisma.user.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: string, currentUser: JwtPayload) {
    if (currentUser.id !== id && !currentUser.roles.includes(Role.ADMIN)) {
      throw new ForbiddenException();
    }
    await Promise.all([
      this.cacheManager.del(id),
      this.cacheManager.del(currentUser.email),
    ]);
    return await this.prisma.user.delete({
      where: { id },
      select: { id: true },
    });
  }
  private hashPassword(password: string) {
    return hashSync(password, genSaltSync(10));
  }
}
