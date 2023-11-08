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
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { UserResponse } from './responses';
import { Role, User } from '@prisma/client';
import { CurrentUser, Roles } from '@shared/decorators';
import { JwtPayload } from '@auth/interfaces';
import { RolesGuard } from '@auth/guards/role.guard';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UserService) {}

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  async create(@Body() dto: any) {
    const user = await this.usersService.save(dto);
    return new UserResponse(user);
  }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll() {
    const user: User[] = await this.usersService.findAll();
    const users = user.map((user) => new UserResponse(user));
    return users;
  }

  @Get('profile')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  profile(@CurrentUser() currentUser: JwtPayload) {
    console.log(currentUser);
    return currentUser;
  }

  @Get(':idOrEmail')
  @UseInterceptors(ClassSerializerInterceptor)
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

  @Delete(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    const user = await this.usersService.delete(id, currentUser);
    return user;
  }
}
