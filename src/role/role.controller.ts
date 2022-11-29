import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Role } from './entities/role.entity';
import { HasPermission } from 'src/decorators/has-permission.decorator';
import { PermissionGuard } from 'src/guards/permission.guard';
import { JwtAuthGuard } from 'src/user/jwt-auth.guard';

@ApiTags('Role')
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @UseGuards(JwtAuthGuard, PermissionGuard)
  @HasPermission('create_role')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a role with array of permisssion id' })
  @ApiCreatedResponse({ description: 'Role is created with permission' })
  @ApiInternalServerErrorResponse({ description: 'Server Error' })
  @ApiUnauthorizedResponse({ description: 'You need to login' })
  @ApiForbiddenResponse({ description: 'You need create_role permission' })
  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @UseGuards(JwtAuthGuard, PermissionGuard)
  @HasPermission('view_role')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'View all Roles' })
  @ApiOkResponse({ type: Role, isArray: true, description: 'All roles' })
  @ApiUnauthorizedResponse({ description: 'You need to login' })
  @ApiForbiddenResponse({ description: 'You need view_role permission' })
  @Get()
  async findAll(): Promise<Role[]> {
    return await this.roleService.findAll();
  }

  @UseGuards(JwtAuthGuard, PermissionGuard)
  @HasPermission('view_a_role')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'View a Role' })
  @ApiOkResponse({ type: Role, description: 'a role' })
  @ApiUnauthorizedResponse({ description: 'You need to login' })
  @ApiForbiddenResponse({ description: 'You need view_a_role permission' })
  @ApiNotFoundResponse({ description: 'Invalid role id' })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Role> {
    const found = await this.roleService.findOne(+id);

    if (!found) {
      throw new NotFoundException('Role is not found');
    }

    return found;
  }

  @UseGuards(JwtAuthGuard, PermissionGuard)
  @HasPermission('edit_role')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a role with permission' })
  @ApiOkResponse({ description: 'update a role with permission' })
  @ApiUnauthorizedResponse({ description: 'You need to login' })
  @ApiForbiddenResponse({ description: 'You need edit_role permission' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(+id, updateRoleDto);
  }

  @UseGuards(JwtAuthGuard, PermissionGuard)
  @HasPermission('delete_role')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a role ' })
  @ApiOkResponse({ description: 'A role is Deleted' })
  @ApiUnauthorizedResponse({ description: 'You need to login' })
  @ApiForbiddenResponse({ description: 'You need delete_role permission' })
  @ApiNotFoundResponse({ description: 'Role id is not found' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roleService.remove(+id);
  }
}
