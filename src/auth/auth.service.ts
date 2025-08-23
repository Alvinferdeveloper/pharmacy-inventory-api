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

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { username },
      relations: ['role'],
    });
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return { ...result, mustChangePassword: user.mustChangePassword };
    }
    return null;
  }

  async login(user: User) {
    const payload: LoginPayload = {
      username: user.username,
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