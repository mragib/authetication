import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../role/entities/role.entity';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private refelector: Reflector) {}
  async canActivate(context: ExecutionContext) {
    const access = this.refelector.get<string>('access', context.getHandler());
    const { user } = context.switchToHttp().getRequest();

    const role: Role = user.role;

    if (!access) {
      return true;
    }

    return role.permissions.some((item) => item.name === access);
  }
}
