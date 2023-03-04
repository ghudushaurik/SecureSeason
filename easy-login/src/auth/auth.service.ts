import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './auth.repository';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entity/user.entity';
import { hashSync, verify } from '@node-rs/bcrypt';

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

  async validateUser(userId: number): Promise<boolean> {
    const user = await this.userRepository.findOneUserBy({ id: userId });
    if (!user) {
      return false;
    }
    return true;
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
