import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { genSaltSync, hashSync } from 'bcrypt';
import { JwtPayload } from '@auth/interfaces';
import { UserRole } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async save(dto: any) {
    const hashedPassword = await this.hashPassword(dto.password);
    return await this.prisma.user.create({
      data: { ...dto, password: hashedPassword },
    });
  }

  async findAll() {
    return await this.prisma.user.findMany();
  }

  async findOne(idOrEmail: string) {
    const user = await this.prisma.user.findFirst({
      where: { OR: [{ id: idOrEmail }, { email: idOrEmail }] },
    });
    if (!user) {
      throw new BadRequestException('Пользователь не найден');
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
    if (currentUser.id !== id && !currentUser.roles.includes(UserRole.ADMIN)) {
      throw new ForbiddenException();
    }
    return await this.prisma.user.delete({
      where: { id },
      select: { id: true },
    });
  }
  private hashPassword(password: string) {
    return hashSync(password, genSaltSync(10));
  }
}
