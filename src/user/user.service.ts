import { Injectable, Inject, NotFoundException, ConflictException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../entities/User.entity';
import { REPOSITORIES } from '../constants';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '../entities/Role.entity';
import { randomBytes } from 'crypto';

@Injectable()
export class UserService {
  constructor(
    @Inject(REPOSITORIES.USER)
    private readonly userRepository: Repository<User>,
    @Inject(REPOSITORIES.ROLE)
    private readonly roleRepository: Repository<Role>,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<{ user: User; temporaryPassword?: string }> {
    const role = await this.roleRepository.findOne({ where: { idRole: createUserDto.roleId } });
    if (!role) {
      throw new NotFoundException(`Role with ID ${createUserDto.roleId} not found`);
    }

    const user = await this.userRepository.findOne({ where: { identification: createUserDto.identification } });
    if (user) {
      throw new ConflictException(`User with identification ${createUserDto.identification} already exists`);
    }

    const temporaryPassword = randomBytes(8).toString('hex');

    const newUser = this.userRepository.create({
      ...createUserDto,
      password: temporaryPassword,
      role,
      mustChangePassword: true,
    });

    const savedUser = await this.userRepository.save(newUser);
    return { user: savedUser, temporaryPassword };
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

    const userByIdentification = await this.userRepository.findOne({ where: { identification: updateUserDto.identification } });
    if (userByIdentification && userByIdentification.idUser !== id) {
      throw new ConflictException(`User with identification ${updateUserDto.identification} already exists`);
    }

    if (updateUserDto.roleId) {
      const role = await this.roleRepository.findOne({ where: { idRole: updateUserDto.roleId } });
      if (!role) {
        throw new NotFoundException(`Role with ID ${updateUserDto.roleId} not found`);
      }
      user.role = role;
    }

    // Update only the allowed properties from the DTO
    if (updateUserDto.name !== undefined) {
      user.name = updateUserDto.name;
    }
    if (updateUserDto.identification !== undefined) {
      user.identification = updateUserDto.identification;
    }
    if (updateUserDto.phone !== undefined) {
      user.phone = updateUserDto.phone;
    }
    if (updateUserDto.email !== undefined) {
      user.email = updateUserDto.email;
    }
    if (updateUserDto.password !== undefined) {
      user.password = updateUserDto.password; // BeforeInsert hook will hash this
      user.mustChangePassword = false;
    }

    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.softRemove(user);
  }
}
