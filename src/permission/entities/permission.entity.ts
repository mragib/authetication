import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/role/entities/role.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@ApiTags('Permission')
@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  name: string;

  @ManyToMany(() => Role, (role) => role.permissions)
  role: Role[];
}
