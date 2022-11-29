import { ApiProperty } from '@nestjs/swagger';
import { IsLowercase, IsNotEmpty, IsString } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty()
  @IsString()
  @IsLowercase()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  permission: number[];
}
