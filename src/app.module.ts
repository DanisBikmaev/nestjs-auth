import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { BcardsModule } from './bcards/bcards.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UsersModule, BcardsModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
