import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BcardsService } from './bcards.service';
import { CreateBcardDto } from './dto/create-bcard.dto';
import { UpdateBcardDto } from './dto/update-bcard.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('bcards')
@ApiTags('buisness cards')
export class BcardsController {
  constructor(private readonly bcardsService: BcardsService) {}

  @Post()
  create(@Body() createBcardDto: CreateBcardDto) {
    return this.bcardsService.create(createBcardDto);
  }

  @Get()
  findAll() {
    return this.bcardsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bcardsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBcardDto: UpdateBcardDto) {
    return this.bcardsService.update(+id, updateBcardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bcardsService.remove(+id);
  }
}
