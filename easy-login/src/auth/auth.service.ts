import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './auth.repository';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entity/user.entity';
import { hashSync, verify, verifySync } from '@node-rs/bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<UserEntity> {
    const password = hashSync(createUserDto.password, 13);
    const user = await this.userRepository.createUserBy(
      createUserDto,
      password,
    );
    return this.getUserWithoutPassword(user);
  }

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOneUserBy({
      userName: loginDto.userName,
    });

    if (!user) {
      throw new NotFoundException();
    }

    if (!verifySync(loginDto.password, user.password)) {
      throw new UnauthorizedException();
    }

    return this.getUserWithoutPassword(user);
  }

  async validateUser(username: string, password: string) {
    const user = await this.userRepository.findOneUserBy({
      userName: username,
    });
    console.log(user);

    const hash = verify(password, user.password);
    if (!hash) {
      return false;
    }
    return this.getUserWithoutPassword(user);
  }

  async updateUser(body: UpdateUserDto, userId: number) {
    return this.userRepository.updateUser(body, userId);
  }

  async updatePassword(body: ChangePasswordDto, userId: number) {
    const user = await this.getOneUser(userId);

    if (!(await verify(body.oldPassword, user.password))) {
      throw new ForbiddenException();
    }

    const password = hashSync(body.password, 13);

    return this.userRepository.changeUserPassword(password, user);
  }

  async getUserWithoutPassword(user: UserEntity) {
    if (!user) {
      throw new NotFoundException();
    }

    delete user.password;
    return user;
  }

  getOneUser(id: number): Promise<UserEntity> {
    return this.userRepository.getOneUser(id);
  }
}
