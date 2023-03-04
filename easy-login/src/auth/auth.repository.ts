import { HttpException, HttpStatus } from '@nestjs/common';
import { EntityRepository, Repository, DataSource } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { GetAllSortDto } from './dto/qagination.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entity/user.entity';

export const UserFields = [
  'id',
  'firstName',
  'lastName',
  'userName',
  'birthDate',
  'phoneNumber',
  'personalNumber',
  'createdAt',
  'updatedAt',
];

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  constructor(private dataSource: DataSource) {
    super(UserEntity, dataSource.createEntityManager());
  }

  findOneUserBy(options: any): Promise<UserEntity> {
    return UserEntity.findOneBy(options);
  }

  //Just to be here
  async findAllUsers(query: GetAllSortDto): Promise<any> {
    const filter = JSON.parse(query.filter);
    const sort = JSON.parse(query.sort);
    const pagination = JSON.parse(query.pagination);
    const data = this.dataSource
      .createQueryBuilder(UserEntity, 'u')
      .select([
        'u.id',
        'u.role',
        'u.userName',
        'u.firstName',
        'u.lastName',
        'u.birthDate',
        'u.phoneNumber',
        'u.personalNumber',
        'u.createdAt',
        'u.updatedAt',
      ]);
    let field = 'id';
    if (UserFields.includes(sort.field)) {
      field = sort.field;
    }

    if (filter.id) {
      data.where('u.id = :id', {
        id: filter.id,
      });
    }

    const order =
      sort.order === 'ASC' || sort.order === 'DESC' ? sort.order : 'ASC';
    data.orderBy(`u.${field}`, order);
    const perPage = pagination.perPage || 10;
    const page = pagination.page || 1;
    const total = await data.getCount();
    data.offset(perPage * page - perPage);
    data.limit(perPage);

    return { data: await data.getMany(), total };
  }
  async createUserBy(
    completeUser: CreateUserDto,
    password: string,
  ): Promise<UserEntity> {
    const user = new UserEntity();
    user.firstName = completeUser.firstName;
    user.userName = completeUser.userName;
    user.lastName = completeUser.lastName;
    user.birthDate = completeUser.birthDate;
    user.personalNumber = completeUser.personalNumber;
    user.password = password;
    user.phoneNumber = completeUser.phoneNumber;
    console.log(user);

    try {
      const data = await user.save();
      return data;
    } catch (e) {
      console.log(e);

      throw new HttpException(`${e.detail}`, HttpStatus.BAD_REQUEST);
    }
  }

  async updateUser(completeUser: UpdateUserDto, id: number) {
    const user = {
      firstName: completeUser.firstName,
      userName: completeUser.userName,
      lastName: completeUser.lastName,
      birthDate: completeUser.birthDate,
      personalNumber: completeUser.personalNumber,
      phoneNumber: completeUser.phoneNumber,
    };
    try {
      await this.dataSource
        .createQueryBuilder()
        .update(UserEntity)
        .set(user)
        .where('id = :id', { id })
        .execute();
    } catch (e) {
      throw new HttpException('DATABASE_ERROR', HttpStatus.BAD_REQUEST);
    }

    const data = await this.findOneBy({ id });
    return { data };
  }

  async changeUserPassword(password: string, user: UserEntity) {
    try {
      await this.dataSource
        .createQueryBuilder()
        .update(UserEntity)
        .set({ password })
        .where('id = :id', { id: user.id })
        .execute();
    } catch (e) {
      throw new HttpException('DATABASE_ERROR', HttpStatus.BAD_REQUEST);
    }

    return {
      success: true,
    };
  }

  //Just to be here
  async removeUser(user: UserEntity) {
    const data = await user.remove();
    return { data: data };
  }

  async getOneUser(id: number): Promise<any> {
    const data = await this.dataSource
      .createQueryBuilder(UserEntity, 'u')
      .select([
        'u.id',
        'u.role',
        'u.userName',
        'u.firstName',
        'u.lastName',
        'u.birthDate',
        'u.phoneNumber',
        'u.personalNumber',
      ])
      .where('u.id = :id', { id })
      .getOne();
    return data;
  }
}
