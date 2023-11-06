import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { UserResponse } from './responses';
import { User } from '@prisma/client';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UserService) {}
  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async create(@Body() dto: any) {
    const user = await this.usersService.save(dto);
    return new UserResponse(user);
  }
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll() {
    const user: User[] = await this.usersService.findAll();
    const users = user.map((user) => new UserResponse(user));
    return users;
  }
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':idOrEmail')
  async findOne(@Param('idOrEmail') idOrEmail: string) {
    const user = await this.usersService.findOne(idOrEmail);
    return new UserResponse(user);
  }
  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: any) {
    const user = await this.usersService.update(id, dto);
    return new UserResponse(user);
  }
  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    const user = await this.usersService.delete(id);
    return user;
  }
}
