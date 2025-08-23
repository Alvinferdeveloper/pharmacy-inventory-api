import { Controller, Get, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleName } from '../entities/Role.entity';

@Controller('roles')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(RoleName.ADMINISTRATOR)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  findAll() {
    return this.rolesService.findAll();
  }
}
