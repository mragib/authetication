import { ApiProperty } from '@nestjs/swagger';
import { IsLowercase, IsNotEmpty, IsString } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty()
  @IsString()
  @IsLowercase()
  @IsNotEmpty()
  name: string;
}
