import { Controller, Get, Post, Body, Put, Param, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleName } from '../entities/Role.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleName.ADMINISTRATOR)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleName.ADMINISTRATOR, RoleName.CONSULTANT)
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleName.ADMINISTRATOR, RoleName.CONSULTANT)
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleName.ADMINISTRATOR)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Put(':id/toggle-status')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleName.ADMINISTRATOR)
  toggleStatus(@Param('id') id: string) {
    return this.userService.toggleStatus(+id);
  }

  @Put(':id/change-password')
  @UseGuards(AuthGuard('jwt'))
  changePassword(@Param('id') id: string, @Body() changePasswordDto: ChangePasswordDto, @Req() req) {
    // Ensure the authenticated user is changing their own password
    if (req.user.idUser !== +id) {
      throw new UnauthorizedException('No tiene permiso para cambiar la contraseña de este usuario');
    }
    return this.userService.changePassword(+id, changePasswordDto);
  }

  @Put(':id/profile')
  @UseGuards(AuthGuard('jwt'))
  updateProfile(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto, @Req() req) {
    // Ensure the authenticated user is updating their own profile
    if (req.user.idUser !== +id) {
      throw new UnauthorizedException('No tiene permiso para actualizar el perfil de este usuario');
    }
    return this.userService.updateProfile(+id, updateProfileDto);
  }
}
