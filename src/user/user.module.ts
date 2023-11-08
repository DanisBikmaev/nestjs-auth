import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UsersController } from './user.controller';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  controllers: [UsersController],
  providers: [UserService],
  exports: [UserService],
  imports: [CacheModule.register()],
})
export class UsersModule {}
