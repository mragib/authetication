import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    const { permission, ...data } = createRoleDto;

    const newRole = await this.roleRepository.save({
      ...data,
      permissions: permission.map((id) => ({ id })),
    });

    return newRole;
  }

  async findAll(): Promise<Role[]> {
    return await this.roleRepository.find();
  }

  async findOne(id: number) {
    return await this.roleRepository.findOneBy({ id });
  }

  async remove(id: number) {
    const found = await this.findOne(id);

    if (!found) {
      throw new NotFoundException('Data is not found');
    }

    return await this.roleRepository.remove(found);
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const role = await this.findOne(id);
    if (!role) {
      throw new NotFoundException('Role is not Found');
    }
    const { permission, ...data } = updateRoleDto;

    try {
      Object.assign(role, {
        ...data,
        permissions: permission.map((id) => ({ id })),
      });

      const updatedRole = await this.roleRepository.save(role);
      if (!updatedRole) {
        throw new InternalServerErrorException('Update Failed');
      }

      return updatedRole;
    } catch (error) {
      throw new InternalServerErrorException('Update Failed');
    }
  }
}
