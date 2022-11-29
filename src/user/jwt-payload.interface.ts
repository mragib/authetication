import { Role } from '../role/entities/role.entity';

export interface JwtPayload {
  email: string;
  role: Role;
}
