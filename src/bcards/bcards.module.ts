import { Module } from '@nestjs/common';
import { BcardsService } from './bcards.service';
import { BcardsController } from './bcards.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [BcardsController],
  providers: [BcardsService, PrismaService],
})
export class BcardsModule {}
