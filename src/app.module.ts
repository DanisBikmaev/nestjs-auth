import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { BcardsModule } from './modules/bcards/bcards.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [UsersModule, BcardsModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
