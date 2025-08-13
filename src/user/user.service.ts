import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../entities/User.entity';
import { REPOSITORIES } from '../constants';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '../entities/Role.entity';

@Injectable()
export class UserService {
  constructor(
    @Inject(REPOSITORIES.USER)
    private readonly userRepository: Repository<User>,
    @Inject(REPOSITORIES.ROLE)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const role = await this.roleRepository.findOne({ where: { idRole: createUserDto.roleId } });
    if (!role) {
      throw new BadRequestException(`Role with ID ${createUserDto.roleId} not found`);
    }

    const user = await this.userRepository.findOne({ where: { username: createUserDto.username } });
    if (user) {
      throw new BadRequestException(`User with username ${createUserDto.username} already exists`);
    }
    const newUser = this.userRepository.create({ ...createUserDto, role });
    return this.userRepository.save(newUser);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({ relations: ['role'] });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { idUser: id }, relations: ['role'] });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    const userByUsername = await this.userRepository.findOne({ where: { username: updateUserDto.username } });
    if (userByUsername && userByUsername.idUser !== id) {
      throw new BadRequestException(`User with username ${updateUserDto.username} already exists`);
    }

    if (updateUserDto.roleId) {
      const role = await this.roleRepository.findOne({ where: { idRole: updateUserDto.roleId } });
      if (!role) {
        throw new BadRequestException(`Role with ID ${updateUserDto.roleId} not found`);
      }
      user.role = role;
    }

    // Update only the allowed properties from the DTO
    if (updateUserDto.name !== undefined) {
      user.name = updateUserDto.name;
    }
    if (updateUserDto.username !== undefined) {
      user.username = updateUserDto.username;
    }
    if (updateUserDto.password !== undefined) {
      user.password = updateUserDto.password; // BeforeInsert hook will hash this
    }

    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.softRemove(user);
  }
}
