import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

const jwtModuleOptions = (config: ConfigService): JwtModuleOptions => ({
  secret: config.get('JWT_SECRET'),
  signOptions: { expiresIn: config.get('JWT_EXP', '5m') },
});

export const options = () => ({
  inject: [ConfigService],
  useFactory: (config: ConfigService) => jwtModuleOptions(config),
});
