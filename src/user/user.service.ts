import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { AuthCredentialsDto } from './dto/auth-credintials.dto';
import { JwtPayload } from './jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  //Create
  async register(createUserDto: CreateUserDto): Promise<User> {
    let { email, password } = createUserDto;

    email = email.toLowerCase();

    createUserDto.email = email;

    const user = await this.findOne({ email });
    if (user) {
      throw new ConflictException('Email Already exists');
    }

    try {
      const salt = await bcrypt.genSalt();
      const haspassword = await this.hashPassword(password, salt);

      createUserDto.password = haspassword;
      const savedData = await this.userRepository.save({
        ...createUserDto,
        salt,
      });

      return savedData;
    } catch (error) {
      throw new InternalServerErrorException('Failed to create a user');
    }
  }

  findAll() {
    return this.userRepository.find();
  }

  // Find by id
  async findOne(condition): Promise<User> {
    return await this.userRepository.findOneBy(condition);
  }

  //Signin
  async signin(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const user = await this.valivateCredentials(authCredentialsDto);

    if (!user) {
      throw new UnauthorizedException('Invalid Credentials');
    }
    const { email, role } = user;

    const payload: JwtPayload = { email, role };

    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }

  async valivateCredentials(authCredentialsDto: AuthCredentialsDto) {
    const { email, password } = authCredentialsDto;

    const user = await this.findOne({ email });

    if (!user) {
      return null;
    }

    if (user && (await this.validatePassword(password, user))) {
      return user;
    } else {
      return null;
    }
  }

  async validatePassword(pass: string, user: User): Promise<boolean> {
    const { password, salt } = user;
    const hash = await bcrypt.hash(pass, salt);

    return hash === password;
  }

  async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  async signInWithGoogle(data) {
    if (!data.user) throw new BadRequestException();

    const { firstName, email, lastName } = data.user;

    const name = firstName + ' ' + lastName;

    let user = await this.userRepository.findOneBy({ email });
    if (user) return this.login(user);

    user = await this.userRepository.findOneBy({ email });
    if (user)
      throw new ForbiddenException(
        "User already exists, but Google account was not connected to user's account",
      );

    try {
      const newUser = new User();
      newUser.name = name;
      newUser.email = email;
      const salt = await bcrypt.genSalt();
      const haspassword = await this.hashPassword(
        process.env.GOOGLE_PASSWORD,
        salt,
      );
      newUser.password = haspassword;
      newUser.salt = salt;

      await this.userRepository.save(newUser);
      return this.login(newUser);
    } catch (e) {
      throw new Error(e);
    }
  }

  async login(user: User) {
    const { email, role } = user;
    const payload: JwtPayload = { email, role };

    const accessToken = this.jwtService.sign(payload);
    return {
      accessToken,
    };
  }
}
