import { ApiProperty } from '@nestjs/swagger';
import { IsLowercase, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty()
  @IsString()
  @IsLowercase()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: Number, isArray: true })
  @IsNotEmpty()
  @IsNumber()
  permission: number[];
}
