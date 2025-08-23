import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Role } from '../entities/Role.entity';
import { REPOSITORIES } from '../constants';

@Injectable()
export class RolesService {
  constructor(
    @Inject(REPOSITORIES.ROLE)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async findAll(): Promise<Role[]> {
    return this.roleRepository.find();
  }
}
