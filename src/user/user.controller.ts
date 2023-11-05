import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UserService) {}

  @Post()
  create(@Body() dto: any) {
    return this.usersService.save(dto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':idOrEmail')
  findOne(@Param('idOrEmail') idOrEmail: string) {
    return this.usersService.findOne(idOrEmail);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: any) {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.remove(id);
  }
}
