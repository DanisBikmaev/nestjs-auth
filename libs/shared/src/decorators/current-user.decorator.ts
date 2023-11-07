import { JwtPayload } from '@auth/interfaces';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (
    key: keyof JwtPayload,
    ctx: ExecutionContext,
  ): JwtPayload | Partial<JwtPayload> => {
    console.log(ctx.switchToHttp().getRequest().user);
    const request = ctx.switchToHttp().getRequest();
    return key ? request.user[key] : request.user;
  },
);
