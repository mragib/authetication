import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { HasPermission } from '../decorators/has-permission.decorator';
import { PermissionGuard } from 'src/guards/permission.guard';
import { JwtAuthGuard } from 'src/user/jwt-auth.guard';
import { Permission } from './entities/permission.entity';

@ApiTags('Pemission')
@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @UseGuards(JwtAuthGuard, PermissionGuard)
  @HasPermission('create_permission')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a permisssion' })
  @ApiCreatedResponse({ description: 'a permission is created' })
  @ApiInternalServerErrorResponse({ description: 'Server Error' })
  @ApiUnauthorizedResponse({ description: 'You need to login' })
  @ApiForbiddenResponse({
    description: 'You need create_permission permission',
  })
  @Post()
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionService.create(createPermissionDto);
  }

  @UseGuards(JwtAuthGuard, PermissionGuard)
  @HasPermission('view_permission')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'View all Permission' })
  @ApiOkResponse({
    type: Permission,
    isArray: true,
    description: 'All Permissions',
  })
  @ApiUnauthorizedResponse({ description: 'You need to login' })
  @ApiForbiddenResponse({ description: 'You need view_permission permission' })
  @Get()
  findAll() {
    return this.permissionService.findAll();
  }

  @UseGuards(JwtAuthGuard, PermissionGuard)
  @HasPermission('view_a_permission')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'View a permission' })
  @ApiOkResponse({ type: Permission, description: 'a permission' })
  @ApiUnauthorizedResponse({ description: 'You need to login' })
  @ApiForbiddenResponse({
    description: 'You need view_a_permission permission',
  })
  @ApiNotFoundResponse({ description: 'Invalid permission id' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const found = await this.permissionService.findOne(+id);

    if (!found) {
      throw new NotFoundException('Permission is not found');
    }

    return found;
  }

  @UseGuards(JwtAuthGuard, PermissionGuard)
  @HasPermission('delete_permission')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a permission ' })
  @ApiOkResponse({ description: 'A permission is Deleted' })
  @ApiUnauthorizedResponse({ description: 'You need to login' })
  @ApiForbiddenResponse({
    description: 'You need delete_permission permission',
  })
  @ApiNotFoundResponse({ description: 'Permission id is not found' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.permissionService.remove(+id);
  }
}
