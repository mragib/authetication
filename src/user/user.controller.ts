import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ClassSerializerInterceptor,
  UseInterceptors,
  Req,
  UseGuards,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiExcludeEndpoint,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOAuth2,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { AuthCredentialsDto } from './dto/auth-credintials.dto';
import { AuthGuard } from '@nestjs/passport';
import { HasPermission } from 'src/decorators/has-permission.decorator';
import { PermissionGuard } from 'src/guards/permission.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { GetUser } from 'src/decorators/get-user.decorator';

@ApiTags('User')
@UseInterceptors(ClassSerializerInterceptor)
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'User Register' })
  @ApiBadRequestResponse({ description: 'provide valid email' })
  @ApiCreatedResponse({ type: User, description: 'A user is registered' })
  @ApiConflictResponse({ description: 'Email Id is already in use' })
  @ApiInternalServerErrorResponse({ description: 'Internal server problem' })
  @Post('register')
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.register(createUserDto);
  }

  @ApiOperation({ summary: 'User login' })
  @ApiUnauthorizedResponse({ description: 'Invalid Credientials' })
  @ApiOkResponse({ description: 'Provide a token' })
  @ApiCreatedResponse({ description: 'Provide a jwt accessToken' })
  @Post('login')
  async signin(
    @Body() authCred: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return await this.userService.signin(authCred);
  }

  @ApiOperation({ summary: 'View all users' })
  @ApiUnauthorizedResponse({ description: 'You need to login' })
  @ApiForbiddenResponse({ description: 'You need view permission' })
  @ApiOkResponse({ type: User, isArray: true, description: 'View all users' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @HasPermission('view_user')
  @Get('users')
  async findAll(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @ApiOperation({
    summary: 'Register a new user or Login existing user using Google',
  })
  @ApiForbiddenResponse({
    description: "Google account was not connected to user's account",
  })
  @UseGuards(AuthGuard('google'))
  @Get('user/google-login')
  async signInWithGoogle() {}

  @ApiExcludeEndpoint()
  @UseGuards(AuthGuard('google'))
  @Get('user/google-redirect')
  async signInWithGoogleRedirect(@Req() req): Promise<{ accessToken: string }> {
    return this.userService.signInWithGoogle(req);
  }

  @ApiOperation({ summary: 'User profile' })
  @ApiOkResponse({ type: User, description: 'Login user profile' })
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'You need to login' })
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @HasPermission('view_profile')
  @Get('user/profile')
  findLoginUser(@GetUser() user: User): User {
    return user;
  }

  @UseGuards(JwtAuthGuard, PermissionGuard)
  @HasPermission('view_a_user')
  @ApiUnauthorizedResponse({ description: 'You need to login' })
  @ApiForbiddenResponse({ description: 'You need view_a_user permission' })
  @ApiOperation({ summary: 'Find any user with ID' })
  @ApiOkResponse({ description: 'Single user will be return', type: User })
  @ApiNotFoundResponse({ description: 'User Id is not exiets' })
  @Get('user/:id')
  async findOne(@Param('id') id: string): Promise<User> {
    const found = await this.userService.findOne({ id });

    if (!found) throw new NotFoundException('User is not found');

    return found;
  }
}
