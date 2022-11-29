import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { Permission } from './entities/permission.entity';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async create(createPermissionDto: CreatePermissionDto) {
    try {
      return await this.permissionRepository.save(createPermissionDto);
    } catch (error) {
      throw new InternalServerErrorException('Permission is not created');
    }
  }

  async findAll(): Promise<Permission[]> {
    return await this.permissionRepository.find();
  }

  async findOne(id: number) {
    return await this.permissionRepository.findOneBy({ id });
  }

  async remove(id: number) {
    const found = await this.permissionRepository.findOneBy({ id });
    if (!found) {
      throw new NotFoundException('Permission ID is not found');
    }
  }
}
