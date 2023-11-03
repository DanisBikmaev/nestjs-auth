import { Injectable } from '@nestjs/common';
import { CreateBcardDto } from './dto/create-bcard.dto';
import { UpdateBcardDto } from './dto/update-bcard.dto';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class BcardsService {
  constructor(private prisma: PrismaService) {}

  async create(createBcardDto: CreateBcardDto) {
    return await this.prisma.bCards.create({
      data: createBcardDto,
    });
  }

  async findAll() {
    return await this.prisma.bCards.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.bCards.findFirst({
      where: { id },
    });
  }

  async update(id: number, updateBcardDto: UpdateBcardDto) {
    return await this.prisma.bCards.update({
      where: { id },
      data: updateBcardDto,
    });
  }

  remove(id: number) {
    return this.prisma.bCards.delete({ where: { id } });
  }
}
