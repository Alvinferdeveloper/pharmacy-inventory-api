import { Injectable, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../entities/User.entity';
import { REPOSITORIES } from '../constants';
import * as bcrypt from 'bcrypt';
import { LoginPayload } from './interfaces/login-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @Inject(REPOSITORIES.USER)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) { }

  async validateUser(identification: string, pass: string): Promise<any> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .withDeleted()
      .leftJoinAndSelect('user.role', 'role')
      .where('user.deletedAt IS NULL')
      .andWhere('user.identification = :identification', { identification })
      .getOne();

    if (user && user.deletedAt) {
      return null;
    }

    // Check if the user is active
    if (user && !user.isActive) {
      return null; // User is inactive, prevent login
    }

    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return { ...result, mustChangePassword: user.mustChangePassword };
    }
    return null;
  }

  async login(user: User) {
    const payload: LoginPayload = {
      identification: user.identification,
      sub: user.idUser,
      roles: [user.role.roleName],
      mustChangePassword: user.mustChangePassword,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateUserById(id: number) {
    return await this.userRepository.findOne({ where: { idUser: id } });
  }
}